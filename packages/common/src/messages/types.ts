import {
    RepeatType,
    StartTimeType,
} from "../schedule/consts";

export interface GenericPayload {
    timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface GenericMessage<T extends string, P extends {} = {}> {
    readonly type: T;
    readonly payload: P & GenericPayload;
}

export type ServerUpdateStateMessage = GenericMessage<"mhp.server.updateState", {
    isPumping: boolean;
    repeat: RepeatType;
    startTime: StartTimeType;
    isConnected: boolean;
}>;

export type ServerTakeShotMessage = GenericMessage<"mhp.server.takeShot">;

export type ServerSendShotMessage = GenericMessage<"mhp.server.sendShot", {
    base64: string;
}>;

export type PiUpdateStateMessage = GenericMessage<"mhp.pi.updateState", {
    isPumping: boolean;
    timeRemaining: number;
}>;

export type PiSendShotMessage = GenericMessage<"mhp.pi.sendShot", {
    base64: string;
}>;

export type ClientUpdateStateMessage = GenericMessage<"mhp.client.updateState", {
    isPumping: boolean;
    repeat: RepeatType;
    startTime: StartTimeType;
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

export const MANDARIN_HOME_PI_PARAM = "mandarinHomePi";
