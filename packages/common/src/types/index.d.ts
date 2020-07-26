import { IObservableValue } from "mobx";

export type RequestStatus = "pending" | "success" | "failed";

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

export interface GenericPayload {
    timestamp: number;
}

export interface GenericMessage<T extends string, P extends {} = {}> {
    readonly type: T;
    readonly payload: P & GenericPayload;
}

export type ServerUpdateStateMessage = GenericMessage<"mhp.server.updateState", {
    connected: boolean;
    pumping: boolean;
    timeRemaining: number;
}>;

export type ServerTakeShotMessage = GenericMessage<"mhp.server.takeShot">;

export type ServerSendShotMessage = GenericMessage<"mhp.server.sendShot", {
    base64: string;
}>;

export type PiUpdateStateMessage = GenericMessage<"mhp.pi.updateState", {
    pumping: boolean;
    timeRemaining: number;
}>;

export type PiSendShotMessage = GenericMessage<"mhp.pi.sendShot", {
    base64: string;
}>;

export type ClientUpdateStateMessage = GenericMessage<"mhp.client.updateState", {
    pumping: boolean;
    schedule: {
        repeat: "never" | "everyday";
        startTime: number,
    };
}>;

export type ClientTakeShotMessage = GenericMessage<"mhp.client.takeShot">;

export type PingMessage = GenericMessage<"mhp.ping">;
export type PongMessage = GenericMessage<"mhp.pong", {
    t: number;
}>;

export type IncomingServerMessage =
    | PingMessage
    | PiUpdateStateMessage
    | PiSendShotMessage
    | ClientUpdateStateMessage
    | ClientTakeShotMessage;

export type OutgoingServerMessage =
    | PongMessage
    | ServerUpdateStateMessage
    | ServerTakeShotMessage
    | ServerSendShotMessage;

export type IncomingPiMessage =
    | PongMessage
    | ServerUpdateStateMessage
    | ServerTakeShotMessage;

export type OutgoingPiMessage =
    | PingMessage
    | PiUpdateStateMessage
    | PiSendShotMessage;

export type IncomingClientMessage =
    | PongMessage
    | ServerUpdateStateMessage
    | ServerSendShotMessage;

export type OutgoingClientMessage =
    | PingMessage
    | ClientUpdateStateMessage
    | ClientTakeShotMessage;
