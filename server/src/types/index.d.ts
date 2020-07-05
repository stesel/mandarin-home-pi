declare module "server/state" {

    import { ObservableMap } from "mobx";

    export interface ToggleControl {
        value: boolean;
        broadcast: boolean;
        setValue: (value: boolean) => void;
        setBroadcast: (broadcast: boolean) => void;
    }

    export interface ControlsState {
        mainLight: ToggleControl;
        additionalLight: ToggleControl;
        mainCooler: ToggleControl;
    }

    export interface State {
        controlsState: ControlsState;
    }

    export interface Store {
        controlsState: ObservableMap<keyof ControlsState, ToggleControl>;
    }

}
