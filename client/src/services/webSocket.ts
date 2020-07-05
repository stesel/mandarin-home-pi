import { autorun, transaction } from "mobx";
import { ControlType } from "shared/state";
import { ServerMessage, ChangeControlMessage } from "shared/ws";
import { pumping } from "../store/pumping";

type MessageHandler = (message: ServerMessage) => void;

type MessageHandlerMap = Readonly<{
    [K in ServerMessage["type"]]: MessageHandler;
}>;

const controlsChangedHandler: MessageHandler = message => {
    /*
    transaction(() => {
        (Object.keys(message.args) as ControlType[]).forEach(key => {
            state.get(key)!.setValue(message.args[key]!);
        });
    });
    */
};

const messageHandlerMap: MessageHandlerMap = {
    "hsp.controlsState": controlsChangedHandler,
    "hsp.controlChanged": controlsChangedHandler,
};

const parseWSData = (data: string) => {
    try {
        const message: ServerMessage = JSON.parse(data);
        messageHandlerMap[message.type](message);
    } catch (e) {
        console.warn("WS DATA ERROR: ", e);
    }
};

export const registerWS = () => {
    const ws = new WebSocket(`wss://${window.location.host}`);

    ws.onopen = (event) => {
        console.log("WS OPENED: ", event);
    };
    ws.onclose = (event) => {
        console.log("WS CLOSED: ", event);
    };
    ws.onerror = (event) => {
        console.log("WS ERROR: ", event);
    };
    ws.onmessage = (event: MessageEvent) => {
        console.log("WS DATA: ", event.data);
        parseWSData(event.data);
    };

    /**
    autorun(() => {
        const broadcastKeys = Array.from(
            state.keys(),
        ).filter(key => {
            return state.get(key)!.broadcast;
        });

        if (broadcastKeys.length === 0) {
            return;
        }

        transaction(() => {
            broadcastKeys.forEach(key => {
                state.get(key)!.setBroadcast(false);
            });
        });

        const args = broadcastKeys.reduce((result, key) => {
            result[key] = state.get(key)!.value;
            return result;
        }, {} as ChangeControlMessage["args"]);

        ws.send(JSON.stringify({
            type: "hsp.changeControl",
            args: args,
        }));
    });
     */
};
