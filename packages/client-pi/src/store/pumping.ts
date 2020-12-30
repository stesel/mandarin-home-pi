import {
    PUMPING_TIMEOUT,
    PumpingStore,
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";
import {
    observable,
    reaction,
    runInAction,
} from "mobx";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
    repeat: observable.box(RepeatType.Never),
    startTime: observable.box(StartTimeType.Zero),
    lastTime: observable.box(0),
    changePumping: observable.box(false),
};

let pumpingTimeout: NodeJS.Timeout;
reaction(() => pumping.isPumping.get(), value => {
    if (value) {
        pumpingTimeout = setTimeout(() => {
            runInAction(() => {
                pumping.isPumping.set(false);
            });
        }, PUMPING_TIMEOUT);
    } else {
        clearTimeout(pumpingTimeout);
    }
});

process.on("SIGHUP", () => {
    clearTimeout(pumpingTimeout);
});
