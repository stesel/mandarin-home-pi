import React from "react";
import { MobXProviderContext, useObserver } from "mobx-react";
import {
    ConnectionStore,
    PumpingSchedule,
    PumpingStore,
    RepeatType,
    StartTimeType,
    Stores,
    UIStore,
} from "@mandarin-home-pi/common";

export function useStores(): Stores {
    return React.useContext<Stores>(MobXProviderContext as unknown as React.Context<Stores>)
}

export function useConnection(): ConnectionStore {
    const { connection } = useStores();
    return connection;
}

export function useConnectionLatency(): number {
    return useConnection().connectionLatency.get();
}

export function usePumping(): PumpingStore {
    const { pumping } = useStores();
    return pumping;
}

export function usePumpingSchedule(): PumpingStore {
    const { pumping } = useStores();
    return pumping;
}

export function useScheduleRepeat(): RepeatType {
    const { schedule } = usePumpingSchedule();
    return useObserver<RepeatType>(() => schedule.repeat as RepeatType);
}

export function useScheduleStartTime(): StartTimeType {
    const { schedule } = usePumpingSchedule();
    return useObserver<StartTimeType>(() => schedule.startTime as StartTimeType);
}

export function useUI(): UIStore {
    const { ui } = useStores();
    return ui;
}

export function useIsScheduleOpen(): boolean {
    const ui = useUI();
    return useObserver(() => ui.isScheduleOpen.get());
}
