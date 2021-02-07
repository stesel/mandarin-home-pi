import { IObservableValue } from "mobx";
import {
    RepeatType,
    StartTimeType,
} from "../schedule/consts";

export interface ConnectionStore {
    isAuthorized: IObservableValue<boolean>;
    authorize: IObservableValue<string>;
    isServerConnected: IObservableValue<boolean>;
    isPiConnected: IObservableValue<boolean>;
    connectionLatency: IObservableValue<number>;
}

export interface PumpingStore {
    isPumping: IObservableValue<boolean>;
    repeat: IObservableValue<RepeatType>;
    startTime: IObservableValue<StartTimeType>;
    lastTime: IObservableValue<number>;
    changePumping: IObservableValue<boolean>;
}

export interface UIStore {
    isScheduleOpen: IObservableValue<boolean>;
    isShotOpen: IObservableValue<boolean>;
    shotBase64: IObservableValue<string>;
}

export interface StatisticsStore {
    visitors: IObservableValue<number>,
    authorizedVisitors: IObservableValue<number>,
    pumpRequests: IObservableValue<number>,
    shotRequests: IObservableValue<number>,
}

export interface Stores {
    connection: ConnectionStore;
    pumping: PumpingStore;
    ui: UIStore;
}
