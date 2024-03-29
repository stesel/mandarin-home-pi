import {
    PingMessage,
    PongMessage,
} from "../messages/types";

function pingRequest(): PingMessage {
    return {
        type: "mhp.ping",
        payload: {
            timestamp: Date.now(),
        }
    }
}

type StartPing = (sendMessage: (message: PingMessage) => void) => void;
type StopPing = () => void;
type HandlePong = (message: PongMessage, updateLatency: (latency: number) => void) => void;

interface PingPong {
    startPing: StartPing;
    stopPing: StopPing;
    handlePong: HandlePong;
}

export function createClientPingPong(interval = 10000): PingPong {
    let pingIntervalId: NodeJS.Timeout;
    let lastPingTime = Date.now();

    const startPing: StartPing = (sendMessage) => {
        console.log("Start ping");
        const sendPing = () => {
            const ping = pingRequest();
            lastPingTime = ping.payload.timestamp;
            sendMessage(ping);
        };
        pingIntervalId = setInterval(sendPing, interval);
    }

    const stopPing = () => {
        if (pingIntervalId) {
            console.log("Stop ping");
            clearInterval(pingIntervalId);
        }
    }

    const handlePong: HandlePong = (message, updateLatency) => {
        if (lastPingTime === message.payload.t) {
            const latency = Date.now() - lastPingTime;
            updateLatency(latency);
        }
    }

    return {
        startPing: startPing,
        stopPing: stopPing,
        handlePong: handlePong,
    }
}
