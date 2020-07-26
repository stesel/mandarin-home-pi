import { ConnectionStore } from "@mandarin-home-pi/common";
import { observable } from "mobx";

export const connection: ConnectionStore = {
    isServerConnected: observable.box(false),
    isPiConnected: observable.box(false),
}

// DEBUG
setInterval(() => {
    connection.isPiConnected.set(!connection.isPiConnected.get());
}, 5000);
