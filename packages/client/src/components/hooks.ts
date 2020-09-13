import {
    IObservableValue,
    runInAction,
} from "mobx";
import React, { useCallback } from "react";
import { MobXProviderContext, useObserver } from "mobx-react";
import {
    ConnectionStore,
    PumpingStore,
    RepeatType,
    StartTimeType,
    Stores,
    UIStore,
} from "@mandarin-home-pi/common";

export function useStores(): Stores {
    return React.useContext<Stores>(MobXProviderContext as unknown as React.Context<Stores>)
}

export function useObservableValue<
    K extends keyof S,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    S extends { [k in K]: S[K] extends IObservableValue<any> ? IObservableValue<any> : any },
>(useStore: () => S, property: K): ReturnType<S[K]["get"]> {
    const value = useStore()[property];
    return useObserver(() => value.get());
}

export function useConnection(): ConnectionStore {
    const { connection } = useStores();
    return connection;
}

export function useIsServerConnected(): boolean {
    return useObservableValue(useConnection, "isServerConnected");
}

export function useIsPiConnected(): boolean {
    return useObservableValue(useConnection, "isPiConnected");
}

export function useConnectionLatency(): number {
    return useObservableValue(useConnection, "connectionLatency");
}

export function usePumping(): PumpingStore {
    const { pumping } = useStores();
    return pumping;
}

export function useIsPumping(): boolean {
    return useObservableValue(usePumping, "isPumping");
}

export function useScheduleRepeat(): RepeatType {
    return useObservableValue(usePumping, "repeat");
}

export function useScheduleStartTime(): StartTimeType {
    return useObservableValue(usePumping, "startTime");
}

export function useChangeIsPumping(): (value: boolean) => void {
    const { isPumping, changePumping } = usePumping();
    return useCallback<(value: boolean) => void>(value => {
        runInAction(() => {
            isPumping.set(value);
            changePumping.set(!changePumping.get());
        });
    }, [isPumping, changePumping]);
}

export function useChangeRepeat(): React.ChangeEventHandler<HTMLSelectElement> {
    const { repeat, changePumping } = usePumping();
    return useCallback<React.ChangeEventHandler<HTMLSelectElement>>(event => {
        runInAction(() => {
            repeat.set(event.target.value as RepeatType);
            changePumping.set(!changePumping.get());
        });
    }, [repeat, changePumping]);
}

export function useChangeStartTime(): React.ChangeEventHandler<HTMLSelectElement> {
    const { startTime, changePumping } = usePumping();
    return useCallback<React.ChangeEventHandler<HTMLSelectElement>>(event => {
        runInAction(() => {
            startTime.set(event.target.value as StartTimeType);
            changePumping.set(!changePumping.get());
        });
    }, [startTime, changePumping]);
}

export function useUI(): UIStore {
    const { ui } = useStores();
    return ui;
}

export function useIsScheduleOpen(): boolean {
    return useObservableValue(useUI, "isScheduleOpen");
}
