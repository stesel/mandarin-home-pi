import {
    autorun,
    observable,
    reaction,
} from "mobx";
import {
    PumpingStore,
} from "@mandarin-home-pi/common";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
    changePumping: observable.box(false),
};

reaction(() => pumping.changePumping.get(), value => {
    pumping.isPumping.set(value);
});

autorun(reaction => reaction.trace());
