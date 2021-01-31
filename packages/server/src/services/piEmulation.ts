import {
    AuthorizeMessage,
    createClientPingPong,
    DEFAULT_PORT,
    IncomingPiMessage,
    MANDARIN_HOME_PI_PARAM,
    OutgoingPiMessage,
    PiSendShotMessage,
} from "@mandarin-home-pi/common";
import WebSocket, { MessageEvent } from "ws";
import { demoBase64Shot } from "../consts/emulation";
import { getIsPiEmulation } from "../utils/emulation";

export function registerPiEmulator() {
    if (!getIsPiEmulation()) {
        return;
    }

    console.log("PI Emulation is starting");

    const { startPing, stopPing } = createClientPingPong();

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
        const host = "localhost";
        const wsProtocol = host === "localhost" ? "ws" : "wss";
        const port = process.env.PORT || DEFAULT_PORT;
        return new WebSocket(`${wsProtocol}://${host}:${port}?${MANDARIN_HOME_PI_PARAM}=true`);
    }

    const registerWS = () => {
        let reconnectTimeoutId: NodeJS.Timeout;
        const reconnectTimeout = 3000;
        let ws: WebSocket;

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

        const takeShotHandler = () => {
            setTimeout(() => {
                sendMessage(sendShot(demoBase64Shot));
            }, 5000);
        }

        const parseWSData = (data: string) => {
            try {
                const message: IncomingPiMessage = JSON.parse(data);
                switch (message.type) {
                    case "mhp.server.takeShot":
                        takeShotHandler();
                        break;
                }
            } catch (e) {
                console.warn("WS DATA ERROR: ", e);
            }
        };

        const connect = () => {
            if (ws) {
                ws.close(1000, "Terminate before connect")
            }

            ws = getWS();

            ws.onopen = () => {
                console.log("WS OPENED");
                clearReconnection();
                authorize();
                startPing(sendMessage);
            };
            ws.onclose = (event) => {
                console.log("WS CLOSED: ", event.reason);
                reconnect();
            };
            ws.onerror = (event) => {
                console.log("WS ERROR: ", event.error);
                reconnect();
            };
            ws.onmessage = (event: MessageEvent) => {
                parseWSData(event.data as string);
            };
        }

        connect();

        const sendMessage = (message: OutgoingPiMessage) => {
            if (ws) {
                ws.send(JSON.stringify(message));
            }
        }

        const authorize = () => {
            const secret = process.env.SECRET_PHRASE_PI;
            sendMessage(authorizeRequest(secret));
        };
    };

    registerWS();
}
