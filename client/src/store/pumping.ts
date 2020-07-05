import {
    autorun,
    observable,
    reaction,
} from "mobx";
import { PumpingStore } from "mandarin-home-pi";

export const pumping: PumpingStore = {
    isPumping: observable.box(false),
};

// window.setInterval(() => pumping.isPumping.set(!pumping.isPumping.get()), 3000);

reaction(() => pumping.isPumping.get(), (isPumping, disposable) => {
    console.log("isPumping", isPumping);
    disposable.trace();
});

pumping.isPumping.observe(change => console.log(change.oldValue, "->", change.newValue));

autorun(reaction => {
    console.log("autorun", pumping.isPumping.get());
    reaction.trace();
});

