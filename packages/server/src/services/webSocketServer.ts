import {
    reaction,
    runInAction,
} from "mobx";
import { connection } from "../store/connection";
import { pumping } from "../store/pumping";
import { Server } from "http";
import {
    AuthorizedMessage,
    AuthorizeMessage,
    ClientUpdateStateMessage,
    ConnectionStore,
    IncomingServerMessage,
    MANDARIN_HOME_PI_PARAM,
    OutgoingServerMessage,
    PingMessage,
    PiSendShotMessage,
    PongMessage,
    PumpingStore,
    ServerSendShotMessage,
    ServerTakeShotMessage,
    ServerUpdateStateMessage,
} from "@mandarin-home-pi/common";
import WebSocket from "ws";
import http from "http";

interface Client {
    ws: WebSocket;
    authorized: boolean;
}

let clients: Client[] = [];
let piClient: Client | null;

function sendMessage(client: Client, message: OutgoingServerMessage) {
    if (client.ws && client.authorized) {
        client.ws.send(JSON.stringify(message));
    }
}

export function sendMessageToAll(message: OutgoingServerMessage) {
    clients.forEach((client) => {
        sendMessage(client, message);
    });
}

function authorizedMessage(authorized: boolean): AuthorizedMessage {
    return {
        type: "mhp.authorized",
        payload: {
            authorized: authorized,
            timestamp: Date.now(),
        }
    };
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

function takeShotMessage(): ServerTakeShotMessage {
    return {
        type: "mhp.server.takeShot",
        payload: {
            timestamp: Date.now(),
        }
    }
}

function serverSendShotMessage(base64: string): ServerSendShotMessage {
    return {
        type: "mhp.server.sendShot",
        payload: {
            base64: base64,
            timestamp: Date.now(),
        }
    }
}

function clientAuthorize(message: AuthorizeMessage, client: Client) {
    const isPi = client === piClient;
    const secret = isPi ? process.env.SECRET_PHRASE_PI : process.env.SECRET_PHRASE_CLIENT;

    const authorized = message.payload.password === secret;
    client.authorized = authorized;

    if (client.ws) {
        client.ws.send(JSON.stringify(authorizedMessage(authorized)));
    }

    if (authorized) {
        sendMessage(client, updateStateMessage(pumping, connection));
    }
}

function pingHandler(message: PingMessage, client: Client) {
    sendMessage(client, pongResponse(message.payload.timestamp));
}

function clientUpdateStateHandler(message: ClientUpdateStateMessage) {
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
        sendMessageToAll(
            updateStateMessage(pumping, connection),
        );
    });
}

function clientTakeShotHandler() {
    if (piClient) {
        sendMessage(piClient, takeShotMessage());
    }
}

function piSendShotHandler(message: PiSendShotMessage) {
    clients.forEach(client => {
        if (client !== piClient) {
            sendMessage(client, serverSendShotMessage(message.payload.base64));
        }
    });
}

function parseWSData(data: string, client: Client) {
    try {
        const message: IncomingServerMessage = JSON.parse(data);
        switch (message.type) {
            case "mhp.authorize":
                clientAuthorize(message, client);
                break;
            case "mhp.ping":
                pingHandler(message, client);
                break;
            case "mhp.client.updateState":
                clientUpdateStateHandler(message);
                break;
            case "mhp.client.takeShot":
                clientTakeShotHandler();
                break;
            case "mhp.pi.sendShot":
                piSendShotHandler(message);
                break;
            default:
                console.warn("UNHANDLED MESSAGE: ", message);
                break;
        }
    } catch (e) {
        console.warn("WS DATA ERROR: ", e);
    }
}

function addClient(client: Client): Client[] {
    if (client.ws) {
        clients.push(client);
    }
    return clients;
}

function removeClient(client: Client): Client[] {
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

export function registerWSServer(server: Server) {
    const wss = new WebSocket.Server({
        server: server,
    });

    wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
        const client: Client = {
            ws: ws,
            authorized: false,
        }

        if (request.url && request.url.includes(MANDARIN_HOME_PI_PARAM)) {
            piClient = client;
            runInAction(() => {
                connection.isPiConnected.set(true);
            });
            sendMessageToAll(
                updateStateMessage(pumping, connection),
            );
        } else {
            runInAction(() => {
                const visitors = connection.visitors.get();
                connection.visitors.set(visitors + 1);
            });
        }

        addClient(client);
        client.ws.send(JSON.stringify(authorizedMessage(false)));

        ws.onmessage = event => {
            parseWSData(event.data as string, client);
        };

        ws.onclose = event => {
            removeClient(client);
            console.log("WS client is closed", event.code);
        };

        ws.onerror = event => {
            removeClient(client);
            console.log("WS client error", event.message);
        }
    });

    reaction(() => pumping.isPumping.get(), () => {
        sendMessageToAll(updateStateMessage(pumping, connection));
    });
}
