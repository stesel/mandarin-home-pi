import React from "react";
import { MobXProviderContext, useObserver } from "mobx-react";
import {
    ConnectionStore,
    PumpingSchedule,
    PumpingStore,
    Stores,
    UIStore,
} from "@mandarin-home-pi/common";
import { RepeatType } from "../consts/RepeatType";
import { StartTimeType } from "../consts/StartTime";

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
    return useObserver<RepeatType>(() => schedule.repeat);
}

export function useScheduleStartTime(): StartTimeType {
    const { schedule } = usePumpingSchedule();
    return useObserver<StartTimeType>(() => schedule.startTime);
}

export function useUI(): UIStore {
    const { ui } = useStores();
    return ui;
}

export function useIsScheduleOpen(): boolean {
    const ui = useUI();
    return useObserver(() => ui.isScheduleOpen.get());
}
