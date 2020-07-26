import { Gpio, BinaryValue } from "onoff";
import { platform } from "os";
import { controlsState } from "./state/controlsState";
import { ControlType, ControlObserver } from "shared/state";

const booleanToBinary = (value: boolean): BinaryValue => {
   return value ? 1 : 0;
};

export const registerDevice = () => {
    if (platform() !== "linux") {
        console.warn("This is not PI device");
        return () => {
            console.warn("Changes are ignored for devices");
        };
    }
    const cooler = new Gpio(4, "out");

    cooler.read()
        .then(() => cooler.writeSync(1));

    process.on("SIGHUP", () => {
        cooler.writeSync(0);
        cooler.unexport();
    });

    const observer: ControlObserver = keys => {
        keys.forEach((key: ControlType) => {
            const value = booleanToBinary(controlsState.get(key)!.value);
            switch (key) {
                case "mainCooler":
                    cooler.writeSync(value);
                    break;
                default:
                    break;
            }
        });
    };
    return observer;
};
