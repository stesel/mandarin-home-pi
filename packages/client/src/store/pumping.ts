import {
    autorun,
    observable,
    reaction,
} from "mobx";
import {
    PumpingStore,
} from "@mandarin-home-pi/common";
import { RepeatType } from "../consts/RepeatType";
import { StartTimeType } from "../consts/StartTime";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
    changePumping: observable.box(false),
    schedule: observable.object({
        repeat: RepeatType.Never,
        startTime: StartTimeType.Zero,
    }),
};

reaction(() => pumping.changePumping.get(), value => {
    pumping.isPumping.set(value);
});

autorun(reaction => reaction.trace());
