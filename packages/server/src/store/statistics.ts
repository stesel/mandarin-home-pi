import { StatisticsStore } from "@mandarin-home-pi/common";
import { observable } from "mobx";

export const statistics: StatisticsStore = {
    visitors: observable.box(0),
    authorizedVisitors: observable.box(0),
    pumpRequests: observable.box(0),
    shotRequests: observable.box(0),
};
