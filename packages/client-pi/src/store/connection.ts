import { ConnectionStore } from "@mandarin-home-pi/common";
import {
    action,
    observable,
} from "mobx";

export const connection: ConnectionStore = {
    isAuthorized: observable.box(false),
    authorize: observable.box(""),
    isServerConnected: observable.box(false),
    isPiConnected: observable.box(false),
    connectionLatency: observable.box(0),
    visitors: observable.box(0),
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
