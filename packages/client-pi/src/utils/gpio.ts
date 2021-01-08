import {
    execute,
    executeSync,
} from "./deviceUtils";

export function createGpio(pin: number, mode: "input" | "output") {
    return {
        setup() {
            return execute(`gpio -g mode ${pin} ${mode} && gpio -g read ${pin}`);
        },
        write(value: 0 | 1) {
            return execute(`gpio -g write ${pin} ${value} && gpio -g read ${pin}`);
        },
        writeSync(value: 0 | 1) {
            executeSync(`gpio -g write ${pin} ${value}`);
        },
        read() {
            return execute(`gpio -g read ${pin}`)
        },
    }
}
