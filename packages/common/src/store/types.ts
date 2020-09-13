import {
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common/schedule/consts";
import { IObservableValue } from "mobx";

export interface ConnectionStore {
    isServerConnected: IObservableValue<boolean>;
    isPiConnected: IObservableValue<boolean>;
    connectionLatency: IObservableValue<number>;
}

export interface PumpingStore {
    isPumping: IObservableValue<boolean>;
    repeat: IObservableValue<RepeatType>;
    startTime: IObservableValue<StartTimeType>;
    changePumping: IObservableValue<boolean>;
}

export interface UIStore {
    isScheduleOpen: IObservableValue<boolean>;
}

export interface Stores {
    connection: ConnectionStore;
    pumping: PumpingStore;
    ui: UIStore;
}
