import { Gpio } from "onoff";
import { reaction } from "mobx";
import { pumping } from "../store/pumping";
import { isMandarinPiDevice } from "../utils/deviceUtils";

export function registerPumper() {
    if (!isMandarinPiDevice()) {
        console.warn("This is not Mandarin PI device");
        return;
    }

    const pumper = new Gpio(4, "out");

    const writePamper = (value: boolean) => {
        pumper.write(value ? 1 : 0)
            .then(() => console.log("Pumper state changed:", value))
            .catch(reason => console.log("Pumper state change error:", reason));
    };

    pumper.read()
        .then(value => {
            console.log("Pumper connected:", value);
            const isPumping = pumping.isPumping.get();
            if (!!value !== pumping.isPumping.get()) {
                writePamper(isPumping);
            }
        })
        .catch(reason => console.log("Pumper error:", reason));

    reaction(() => pumping.isPumping.get(), isPumping => writePamper(isPumping));

    process.on("SIGHUP", () => {
        pumper.writeSync(0);
        pumper.unexport();
    });
}
