import { ConnectionStore } from "@mandarin-home-pi/common";
import {
    action,
    configure,
    observable,
} from "mobx";

configure({ enforceActions: "observed" });

export const connection: ConnectionStore = {
    isServerConnected: observable.box(false),
    isPiConnected: observable.box(false),
    connectionLatency: observable.box(0),
};

export const updateServerConnected = action((connected: boolean) => {
    connection.isServerConnected.set(connected);
});

export const updatePiConnected = action((connected: boolean) => {
    connection.isPiConnected.set(connected);
});

export const updateLatency = action((latency: number) => {
    connection.connectionLatency.set(latency);
});

// DEBUG
setInterval(() => {
    updatePiConnected(!connection.isPiConnected.get());
}, 5000);
