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
    repeat: observable.box(RepeatType.Never),
    startTime: observable.box(StartTimeType.Zero),
    changePumping: observable.box(false),
};

autorun(reaction => reaction.trace());
