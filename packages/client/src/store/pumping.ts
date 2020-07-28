import {
    autorun,
    observable,
    reaction,
} from "mobx";
import {
    PumpingStore,
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
    changePumping: observable.box(false),
    schedule: observable.object({
        repeat: RepeatType.EveryDay,
        startTime: StartTimeType.Zero,
    }),
};

reaction(() => pumping.changePumping.get(), value => {
    pumping.isPumping.set(value);
});

autorun(reaction => reaction.trace());
