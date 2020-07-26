import { transaction } from "mobx";
import { pumping } from "../store/pumping";
import { Server } from "http";
import {
    ClientTakeShotMessage,
    ClientUpdateStateMessage,
    IncomingServerMessage,
    OutgoingServerMessage,
    PingMessage,
    PongMessage,
} from "@mandarin-home-pi/common";
import WebSocket = require("ws");

function sendMessage(ws: WebSocket, message: OutgoingServerMessage) {
    ws.send(JSON.stringify(message));
}

function pongResponse(t: number): PongMessage {
    return {
        type: "mhp.pong",
        payload: {
            t: t,
            timestamp: Date.now(),
        }
    }
}

function pingHandler(message: PingMessage, ws: WebSocket) {
    console.log("PING:", message.payload.timestamp);
    sendMessage(ws, pongResponse(message.payload.timestamp));

}

function clientUpdateStateHandler(message: ClientUpdateStateMessage) {
    transaction(() => {
        if (pumping.isPumping.get() !== message.payload.pumping) {
            pumping.isPumping.set(message.payload.pumping);
        }
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

export function registerWSServer(server: Server) {
    const wss = new WebSocket.Server({
        server: server,
    });

    wss.on("connection", (ws: WebSocket) => {
        console.log("WS client is connected");

        ws.onmessage = event => {
            parseWSData(event.data as string, event.target);
        };

        ws.onclose = event => {
            console.log("WS client is closed", event.code);
        };

        ws.onerror = event => {
            console.log("WS client error", event.message);
        }
    });
}
