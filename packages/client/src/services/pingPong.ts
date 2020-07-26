import {
    PingMessage,
    PongMessage,
} from "@mandarin-home-pi/common";

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

export function createPingPong(interval = 10000): PingPong {
    let pingIntervalId: number;
    let lastPingTime = Date.now();

    const startPing: StartPing = (sendMessage) => {
        console.log("Start ping");
        const sendPing = () => {
            const ping = pingRequest();
            lastPingTime = ping.payload.timestamp;
            sendMessage(ping);
        };
        pingIntervalId = window.setInterval(sendPing, interval);
    }

    const stopPing = () => {
        if (pingIntervalId) {
            console.log("Stop ping");
            window.clearInterval(pingIntervalId);
            pingIntervalId = 0;
        }
    }

    const handlePong: HandlePong = (message, updateLatency) => {
        if (lastPingTime === message.payload.t) {
            const latency = Date.now() - lastPingTime;
            updateLatency(latency);
            console.log("Latency:", latency);
        }
    }

    return {
        startPing: startPing,
        stopPing: stopPing,
        handlePong: handlePong,
    }
}
