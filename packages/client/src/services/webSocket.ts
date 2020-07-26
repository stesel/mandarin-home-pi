import {
    action,
    autorun,
    reaction,
    transaction,
} from "mobx";
import { pumping } from "../store/pumping";
import {
    ClientUpdateStateMessage,
    IncomingClientMessage,
    OutgoingClientMessage,
    ServerSendShotMessage,
    ServerUpdateStateMessage,
} from "@mandarin-home-pi/common";
import {
    connection,
    updateLatency,
    updateServerConnected,
} from "../store/connection";
import { createPingPong } from "./pingPong";

const { startPing, stopPing, handlePong } = createPingPong();

function serverUpdateStateHandler(message: ServerUpdateStateMessage) {
    console.log("PONG:", message.payload.timestamp);
    transaction(() => {
        if (pumping.isPumping.get() !== message.payload.pumping) {
            pumping.isPumping.set(message.payload.pumping);
        }
        if (connection.isPiConnected.get() !== message.payload.connected) {
            connection.isPiConnected.set(message.payload.connected);
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

function updateStateRequest(pumping: boolean): ClientUpdateStateMessage {
    return {
        type: "mhp.client.updateState",
        payload: {
            pumping: pumping,
            schedule: { repeat: "never", startTime: 12 },
            timestamp: Date.now(),
        }
    };
}

function getWS(): WebSocket {
    return new WebSocket(`ws://${window.location.hostname}:3001`);
}

export const registerWS = () => {
    let ws: WebSocket;

    let reconnectTimeoutId: number;
    const reconnectTimeout = 3000;

    const clearReconnection = () => {
        if (reconnectTimeoutId) {
            window.clearTimeout(reconnectTimeoutId);
        }
    }

    const reconnect = () => {
        console.warn("WS RECONNECT");
        stopPing();
        clearReconnection();
        reconnectTimeoutId = window.setTimeout(connect, reconnectTimeout);
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
            parseWSData(event.data);
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
        value => sendMessage(updateStateRequest(value)),
    );
};
