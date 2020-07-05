declare module "mandarin-home-pi" {
    import { IObservableValue } from "mobx";

    export interface PumpingStore {
        isPumping: IObservableValue<boolean>;
    }

    export interface Store {
        pumping: PumpingStore
    }

    interface GenericPayload {
        timestamp: number;
    }

    interface GenericMessage<T extends string, P extends {} = {}> {
        type: T;
        payload: P & GenericPayload;
    }

    type ServerStateMessage = GenericMessage<"mhp.server.updateState", {
        pumping: boolean;
        timeRemaining: number;
    }>;

    type ServerTakeShotMessage = GenericMessage<"mhp.server.takeShot">;

    type ServerSendShotMessage = GenericMessage<"mhp.server.sendShot", {
        base64: string;
    }>;

    type PiUpdateStateMessage = GenericMessage<"mhp.pi.updateState", {
        pumping: boolean;
        timeRemaining: number;
    }>;

    type PiSendShotMessage = GenericMessage<"mhp.pi.sendShot", {
        base64: string;
    }>;

    type ClientUpdateStateMessage = GenericMessage<"mhp.client.updateState", {
        pumping: boolean;
    }>;

    type ClientTakeShotMessage = GenericMessage<"mhp.client.takeShot">;

    type PingMessage = GenericMessage<"mhp.ping">;
    type PongMessage = GenericMessage<"mhp.pong">;

    export type IncomingServerMessage =
        | PingMessage
        | PiUpdateStateMessage
        | PiSendShotMessage
        | ClientUpdateStateMessage
        | ClientTakeShotMessage;

    export type OutgoingServerMessage =
        | PongMessage
        | ServerStateMessage
        | ServerTakeShotMessage
        | ServerSendShotMessage;

    export type IncomingPiMessage =
        | PongMessage
        | ServerStateMessage
        | ServerTakeShotMessage;

    export type OutgoingPiMessage =
        | PingMessage
        | PiUpdateStateMessage
        | PiSendShotMessage;

    export type IncomingClientMessage =
        | PongMessage
        | ServerStateMessage
        | ServerSendShotMessage;

    export type OngoingClientMessage =
        | PingMessage
        | ClientUpdateStateMessage
        | ClientTakeShotMessage;
}
