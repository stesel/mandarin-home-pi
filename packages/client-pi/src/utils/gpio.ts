import {
    execute,
    executeSync,
} from "./deviceUtils";

export enum GpioPin {
    Pumper = 4,
}

export enum GpioMode {
    Input = "input",
    Output = "output",
}

export enum GpioState {
    Off = 0,
    On = 1,
}

export type GpioStatus = `${GpioState}`;

export interface Gpio {
    setup(): Promise<GpioStatus>;
    write(value: GpioState): Promise<GpioStatus>;
    writeSync(value: GpioState): void;
    read(): Promise<GpioStatus>
}

export function createGpio(pin: GpioPin, mode: GpioMode): Gpio {
    return {
        setup(): Promise<GpioStatus> {
            return execute<GpioStatus>(`gpio -g mode ${pin} ${mode} && gpio -g read ${pin}`);
        },
        write(value: GpioState): Promise<GpioStatus> {
            return execute<GpioStatus>(`gpio -g write ${pin} ${value} && gpio -g read ${pin}`);
        },
        writeSync(value: GpioState) {
            executeSync(`gpio -g write ${pin} ${value}`);
        },
        read(): Promise<GpioStatus> {
            return execute<GpioStatus>(`gpio -g read ${pin}`)
        },
    }
}
