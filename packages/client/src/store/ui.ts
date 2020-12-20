import { UIStore } from "@mandarin-home-pi/common";
import {
    action,
    observable,
} from "mobx";

export const ui: UIStore = {
    isScheduleOpen: observable.box(false),
    isShotOpen: observable.box(false),
    shotBase64: observable.box(""),
};

export const openSchedule = action(() => {
    ui.isScheduleOpen.set(true);
});

export const closeSchedule = action(() => {
    ui.isScheduleOpen.set(false);
});

export const openShot = action(() => {
    ui.isShotOpen.set(true);
});

export const closeShot = action(() => {
    ui.isShotOpen.set(false);
});
