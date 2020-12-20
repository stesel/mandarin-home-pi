import {
    reaction,
    runInAction,
} from "mobx";
import { pumping } from "../store/pumping";
import {
    AuthorizedMessage,
    AuthorizeMessage,
    IncomingPiMessage,
    MANDARIN_HOME_PI_PARAM,
    OutgoingPiMessage,
    PiSendShotMessage,
    PiUpdateStateMessage,
    PumpingStore,
    ServerUpdateStateMessage,
} from "@mandarin-home-pi/common";
import {
    connection,
    updateLatency,
    updateServerConnected,
} from "../store/connection";
import { createPingPong } from "./pingPong";
import WebSocket, { MessageEvent } from "ws";
import { requestCameraShot } from "./camera";
import { camera } from "../store/camera";

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

function authorizedHandler(message: AuthorizedMessage) {
    if (message.payload.authorized !== connection.isAuthorized.get()) {
        runInAction(() => {
            connection.isAuthorized.set(message.payload.authorized);
        });
    }
}

function takeShotHandler() {
    requestCameraShot();
}

const parseWSData = (data: string) => {
    try {
        const message: IncomingPiMessage = JSON.parse(data);
        switch (message.type) {
            case "mhp.authorized":
                authorizedHandler(message);
                break;
            case "mhp.pong":
                handlePong(message, updateLatency);
                break;
            case "mhp.server.updateState":
                serverUpdateStateHandler(message);
                break;
            case "mhp.server.takeShot":
                takeShotHandler();
                break;
        }
    } catch (e) {
        console.warn("WS DATA ERROR: ", e);
    }
};

function updateStateRequest(pumping: PumpingStore): PiUpdateStateMessage {
    return {
        type: "mhp.pi.updateState",
        payload: {
            isPumping: pumping.isPumping.get(),
            timestamp: Date.now(),
        }
    };
}

function authorizeRequest(password: string): AuthorizeMessage {
    return {
        type: "mhp.authorize",
        payload: {
            password: password,
            timestamp: Date.now(),
        },
    };
}

function sendShot(base64: string): PiSendShotMessage {
    return {
        type: "mhp.pi.sendShot",
        payload: {
            base64: base64,
            timestamp: Date.now(),
        },
    };
}

function getWS(): WebSocket {
    const wsProtocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
    const host = process.env.WS_HOST_PI || "localhost";
    const port = process.env.WS_PORT_PI || "3000";
    return new WebSocket(`${wsProtocol}://${host}:${port}?${MANDARIN_HOME_PI_PARAM}=true`);
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

        ws.onopen = () => {
            console.log("WS OPENED");
            updateServerConnected(true);
            clearReconnection();
            authorize();
            startPing(sendMessage);
        };
        ws.onclose = (event) => {
            console.log("WS CLOSED: ", event.reason);
            updateServerConnected(false);
            reconnect();
        };
        ws.onerror = (event) => {
            console.log("WS ERROR: ", event.error);
            updateServerConnected(false);
            reconnect();
        };
        ws.onmessage = (event: MessageEvent) => {
            parseWSData(event.data as string);
        };
    }

    connect();

    const sendMessage = (message: OutgoingPiMessage) => {
        if (ws && connection.isServerConnected.get()) {
            ws.send(JSON.stringify(message));
        }
    }

    const authorize = () => {
        const secret = process.env.SECRET_PHRASE_PI || "test";
        sendMessage(authorizeRequest(secret));
    };

    reaction(
        () => pumping.changePumping.get(),
        () => sendMessage(updateStateRequest(pumping)),
    );

    reaction(
        () => pumping.changePumping.get(),
        () => sendMessage(updateStateRequest(pumping)),
    );

    reaction(
        () => camera.imageBase64.get(), base64 => {
           if (base64) {
               sendMessage(sendShot(base64))
           }
        },
    );
};
