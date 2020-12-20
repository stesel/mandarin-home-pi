import { ConnectionStore } from "@mandarin-home-pi/common";
import { observable } from "mobx";

export const connection: ConnectionStore = {
    isAuthorized: observable.box(false),
    authorize: observable.box(""),
    isServerConnected: observable.box(false),
    isPiConnected: observable.box(false),
    connectionLatency: observable.box(0),
};
