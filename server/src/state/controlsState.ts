import { action, observable } from "mobx";
import { ControlsState, ToggleControl } from "server/state";

class ToggleControlClass {

    @observable
    public value = false;

    @observable
    public broadcast = false;

    constructor(value = false) {
        this.value = value;
        this.setValue = this.setValue.bind(this);
        this.setBroadcast = this.setBroadcast.bind(this);
    }

    @action("update control value")
    public setValue(value: boolean) {
        this.value = value;
    }

    @action("update broadcast value")
    public setBroadcast(broadcast: boolean) {
        this.broadcast = broadcast;
    }
}

export const controlsState = observable.map<keyof ControlsState, ToggleControl>({
    "mainLight": new ToggleControlClass(),
    "additionalLight": new ToggleControlClass(),
    "mainCooler": new ToggleControlClass(),
});
