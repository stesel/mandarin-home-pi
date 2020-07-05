import { ControlObserver } from "shared/state";
import { autorun, transaction } from "mobx";
import { controlsState } from "./state/controlsState";

export const registerControlObservers = (observers: ReadonlyArray<ControlObserver>) => {
    autorun(() => {
        const broadcastKeys = Array.from(
            controlsState.keys(),
        ).filter(key => {
            return controlsState.get(key)!.broadcast;
        });

        if (broadcastKeys.length === 0) {
            return;
        }

        transaction(() => {
            broadcastKeys.forEach(key => {
                controlsState.get(key)!.setBroadcast(false);
            });
        });

        observers.forEach(observer => {
            observer(broadcastKeys);
        });
    });
};
