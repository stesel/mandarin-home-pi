import {
    reaction,
    runInAction,
} from "mobx";
import { pumping } from "../store/pumping";
import {
    ClientUpdateStateMessage,
    IncomingClientMessage,
    MANDARIN_HOME_PI_PARAM,
    OutgoingClientMessage,
    PumpingStore,
    ServerSendShotMessage,
    ServerUpdateStateMessage,
} from "@mandarin-home-pi/common";
import {
    connection,
    updateLatency,
    updateServerConnected,
} from "../store/connection";
import { createPingPong } from "./pingPong";
import WebSocket, { MessageEvent } from "ws";

const { startPing, stopPing, handlePong } = createPingPong();

function serverUpdateStateHandler(message: ServerUpdateStateMessage) {
    runInAction(() => {
        if (pumping.isPumping.get() !== message.payload.isPumping) {
            pumping.isPumping.set(message.payload.isPumping);
        }
        if(pumping.repeat.get() !== message.payload.repeat) {
            pumping.repeat.set(message.payload.repeat);
        }
        if(pumping.startTime.get() !== message.payload.startTime) {
            pumping.startTime.set(message.payload.startTime);
        }
        if (connection.isPiConnected.get() !== message.payload.isConnected) {
            connection.isPiConnected.set(message.payload.isConnected);
        }
    });
}

function serverSendShotHandler(message: ServerSendShotMessage) {
    console.log("SHOT:", message.payload.base64);
}

const parseWSData = (data: string) => {
    try {
        const message: IncomingClientMessage = JSON.parse(data);
        switch (message.type) {
            case "mhp.pong":
                handlePong(message, updateLatency);
                break;
            case "mhp.server.updateState":
                serverUpdateStateHandler(message);
                break;
            case "mhp.server.sendShot":
                serverSendShotHandler(message);
                break;
        }
    } catch (e) {
        console.warn("WS DATA ERROR: ", e);
    }
};

function updateStateRequest(pumping: PumpingStore): ClientUpdateStateMessage {
    return {
        type: "mhp.client.updateState",
        payload: {
            isPumping: pumping.isPumping.get(),
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
            timestamp: Date.now(),
        }
    };
}

function getWS(): WebSocket {
    process.env.WS_HOST_PI = "localhost";
    return new WebSocket(`ws://${process.env.WS_HOST_PI}:3001?${MANDARIN_HOME_PI_PARAM}=true`);
}

export const registerWS = () => {
    let ws: WebSocket;

    let reconnectTimeoutId: NodeJS.Timeout;
    const reconnectTimeout = 3000;

    const clearReconnection = () => {
        if (reconnectTimeoutId) {
            clearTimeout(reconnectTimeoutId);
        }
    }

    const reconnect = () => {
        console.warn("WS RECONNECT");
        stopPing();
        clearReconnection();
        reconnectTimeoutId = setTimeout(connect, reconnectTimeout);
    }

    const connect = () => {
        if (ws) {
            ws.close(1000, "Terminate before connect")
        }

        ws = getWS();

        ws.onopen = (event) => {
            console.log("WS OPENED: ", event);
            updateServerConnected(true);
            clearReconnection();
            startPing(sendMessage);
        };
        ws.onclose = (event) => {
            console.log("WS CLOSED: ", event);
            updateServerConnected(false);
            reconnect();
        };
        ws.onerror = (event) => {
            console.log("WS ERROR: ", event);
            updateServerConnected(false);
            reconnect();
        };
        ws.onmessage = (event: MessageEvent) => {
            console.log("WS DATA: ", event.data);
            parseWSData(event.data as string);
        };
    }

    connect();

    const sendMessage = (message: OutgoingClientMessage) => {
        if (ws && connection.isServerConnected.get()) {
            ws.send(JSON.stringify(message));
        }
    }

    reaction(
        () => pumping.changePumping.get(),
        () => sendMessage(updateStateRequest(pumping)),
    );
};
