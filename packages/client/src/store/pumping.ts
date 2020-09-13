import {
    PumpingStore,
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";
import {
    autorun,
    observable,
} from "mobx";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
    repeat: observable.box(RepeatType.Never),
    startTime: observable.box(StartTimeType.Zero),
    changePumping: observable.box(false),
};

autorun(reaction => reaction.trace());
