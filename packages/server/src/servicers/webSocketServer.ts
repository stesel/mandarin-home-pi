import {
    reaction,
    runInAction,
} from "mobx";
import { connection } from "../store/connection";
import { pumping } from "../store/pumping";
import { Server } from "http";
import {
    ClientTakeShotMessage,
    ClientUpdateStateMessage,
    ConnectionStore,
    IncomingServerMessage,
    MANDARIN_HOME_PI_PARAM,
    OutgoingServerMessage,
    PingMessage,
    PongMessage,
    PUMPIMG_TIMEOUT,
    PumpingStore,
    ServerUpdateStateMessage,
} from "@mandarin-home-pi/common";
import WebSocket from "ws";
import http from "http";

let clients: WebSocket[] = [];
let piClient: WebSocket | null;

function sendMessage(ws: WebSocket, message: OutgoingServerMessage) {
    ws.send(JSON.stringify(message));
}

export function sendMessageToAll(message: OutgoingServerMessage) {
    clients.forEach(ws => {
        if (ws) {
            sendMessage(ws, message);
        }
    });
}

function pongResponse(t: number): PongMessage {
    return {
        type: "mhp.pong",
        payload: {
            t: t,
            timestamp: Date.now(),
        }
    };
}

function updateStateMessage(pumping: PumpingStore, connection: ConnectionStore): ServerUpdateStateMessage {
    return {
        type: "mhp.server.updateState",
        payload: {
            isPumping: pumping.isPumping.get(),
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
            isConnected: connection.isPiConnected.get(),
            timestamp: Date.now(),
        }
    }
}

function pingHandler(message: PingMessage, ws: WebSocket) {
    console.log("PING:", message.payload.timestamp);
    sendMessage(ws, pongResponse(message.payload.timestamp));

}

function clientUpdateStateHandler(message: ClientUpdateStateMessage) {
    runInAction(() => {
        if (pumping.isPumping.get() !== message.payload.isPumping) {
            clearTimeout(pumpingTimeout);
            pumping.isPumping.set(message.payload.isPumping);
        }
        if(pumping.repeat.get() !== message.payload.repeat) {
            pumping.repeat.set(message.payload.repeat);
        }
        if(pumping.startTime.get() !== message.payload.startTime) {
            pumping.startTime.set(message.payload.startTime);
        }
        sendMessageToAll(
            updateStateMessage(pumping, connection),
        );
    });
}

function clientTakeShotHandler(message: ClientTakeShotMessage) {
    console.log("SHOT:", message.payload.timestamp);
}

function parseWSData(data: string, ws: WebSocket) {
    try {
        const message: IncomingServerMessage = JSON.parse(data);
        switch (message.type) {
            case "mhp.ping":
                pingHandler(message, ws);
                break;
            case "mhp.client.updateState":
                clientUpdateStateHandler(message);
                console.warn(message.type, data);
                break;
            case "mhp.client.takeShot":
                clientTakeShotHandler(message);
                break;
            default:
                console.warn("UNHANDLED MESSAGE: ", message);
                break;
        }
    } catch (e) {
        console.warn("WS DATA ERROR: ", e);
    }
}

function addClient(client: WebSocket): WebSocket[] {
    if (client) {
        clients.push(client);
    }
    console.log("clients", clients.length);
    return clients;
}

function removeClient(client: WebSocket): WebSocket[] {
    if (client) {
        clients = clients.filter(ws => ws !== client);
        if (client === piClient) {
            runInAction(() => {
                connection.isPiConnected.set(false);
            });
            sendMessageToAll(
                updateStateMessage(pumping, connection),
            );
            piClient = null;
        }
    }
    console.log("clients", clients.length);
    return clients;
}

let pumpingTimeout: NodeJS.Timeout;

reaction(() => pumping.isPumping.get(), (value) => {
    if (value) {
        pumpingTimeout = setTimeout(() => {
            pumping.isPumping.set(!pumping.isPumping.get());
            sendMessageToAll(
                updateStateMessage(pumping, connection),
            );
        }, PUMPIMG_TIMEOUT);
    }
});

export function registerWSServer(server: Server) {
    const wss = new WebSocket.Server({
        server: server,
    });

    wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
        if (request.url && request.url.includes(MANDARIN_HOME_PI_PARAM)) {
            piClient = ws;
            runInAction(() => {
                connection.isPiConnected.set(true);
            });
            sendMessageToAll(
                updateStateMessage(pumping, connection),
            );
        }
        addClient(ws);
        sendMessage(ws, updateStateMessage(pumping, connection));
        console.log("WS client is connected");

        ws.onmessage = event => {
            parseWSData(event.data as string, event.target);
        };

        ws.onclose = event => {
            removeClient(ws);
            console.log("WS client is closed", event.code);
        };

        ws.onerror = event => {
            removeClient(ws);
            console.log("WS client error", event.message);
        }
    });
}
