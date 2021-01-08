import { reaction } from "mobx";
import { pumping } from "../store/pumping";
import { isMandarinPiDevice } from "../utils/deviceUtils";
import { createGpio } from "../utils/gpio";

export function registerPumper() {
    if (!isMandarinPiDevice()) {
        console.warn("This is not Mandarin PI device");
        return;
    }

    const pumper = createGpio(4, "output");

    const writePamper = (value: boolean) => {
        pumper.write(value ? 1 : 0)
            .then(() => console.log("Pumper state changed:", value))
            .catch(reason => console.log("Pumper state change error:", reason));
    };

    pumper
        .setup()
        .then(value => {
            console.log("Pumper connected:", value);
            const isPumping = pumping.isPumping.get();
            if (!!Number(value) !== pumping.isPumping.get()) {
                writePamper(isPumping);
            }
        })
        .catch(reason => console.log("Pumper error:", reason));

    reaction(() => pumping.isPumping.get(), isPumping => writePamper(isPumping));

    process.on("SIGHUP", () => {
        pumper.writeSync(0);
    });
}
