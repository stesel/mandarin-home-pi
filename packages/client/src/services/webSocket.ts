import {
    reaction,
    runInAction,
} from "mobx";
import { pumping } from "../store/pumping";
import {
    AuthorizedMessage,
    AuthorizeMessage,
    ClientTakeShotMessage,
    ClientUpdateStateMessage,
    IncomingClientMessage,
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
import { ui } from "../store/ui";

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

function serverSendShotHandler(message: ServerSendShotMessage) {
    if (message.payload.base64) {
        runInAction(() => {
            ui.shotBase64.set(message.payload.base64);
        });
    }
}

const parseWSData = (data: string) => {
    try {
        const message: IncomingClientMessage = JSON.parse(data);
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
        },
    };
}

function takeShotRequest(): ClientTakeShotMessage {
    return {
        type: "mhp.client.takeShot",
        payload: {
            timestamp: Date.now(),
        },
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

function getWS(): WebSocket {
    const wsPort = process.env.WS_PORT_PI || 3001;
    return new WebSocket(`ws://${window.location.hostname}:${wsPort}`);
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
        stopPing();
        clearReconnection();
        reconnectTimeoutId = window.setTimeout(connect, reconnectTimeout);
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
            startPing(sendMessage);
        };
        ws.onclose = () => {
            console.log("WS CLOSED");
            updateServerConnected(false);
            reconnect();
        };
        ws.onerror = (event) => {
            console.log("WS ERROR: ", event);
            updateServerConnected(false);
            reconnect();
        };
        ws.onmessage = (event: MessageEvent) => {
            parseWSData(event.data);
        };
    }

    connect();

    const sendMessage = (message: OutgoingClientMessage) => {
        if (ws && connection.isServerConnected.get()) {
            ws.send(JSON.stringify(message));
        }
    }

    reaction(() => pumping.changePumping.get(), () => {
        sendMessage(updateStateRequest(pumping));
    });

    reaction(() => ui.isShotOpen.get(), isOpen => {
        if (isOpen) {
            sendMessage(takeShotRequest());
        }
    });

    reaction(() => connection.authorize.get(), password => {
        if (password) {
            sendMessage(authorizeRequest(password));
        }
    });
};
