import {
    IObservableObject,
    IObservableValue,
} from "mobx";

export interface ConnectionStore {
    isServerConnected: IObservableValue<boolean>;
    isPiConnected: IObservableValue<boolean>;
    connectionLatency: IObservableValue<number>;
}

export interface PumpingSchedule {
    repeat: string;
    startTime: string;
}

export interface PumpingStore {
    isPumping: IObservableValue<boolean>;
    changePumping: IObservableValue<boolean>;
    schedule: PumpingSchedule & IObservableObject;
}

export interface UIStore {
    isScheduleOpen: IObservableValue<boolean>;
}

export interface Stores {
    connection: ConnectionStore;
    pumping: PumpingStore;
    ui: UIStore;
}
