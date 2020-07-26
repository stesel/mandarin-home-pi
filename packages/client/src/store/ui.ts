import { UIStore } from "@mandarin-home-pi/common";
import {
    action,
    configure,
    observable,
} from "mobx";

configure({ enforceActions: "observed" });

export const ui: UIStore = {
    isScheduleOpen: observable.box(false),
};

export const openSchedule = action(() => {
    ui.isScheduleOpen.set(true);
});

export const closeSchedule = action(() => {
    ui.isScheduleOpen.set(false);
});
