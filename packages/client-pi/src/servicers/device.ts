import { Gpio } from "onoff";
import { reaction } from "mobx";
import { pumping } from "../store/pumping";
import { execSync } from "child_process";

export function registerDevice() {
    const uname = execSync("uname -a").toString();
    if (!uname.includes("raspberrypi")) {
        console.warn("This is not PI device");
        return;
    }

    const pumper = new Gpio(4, "out");

    const writePamper = (value: boolean) => {
        pumper.write(value ? 1 : 0)
            .then(value => console.log("Pumper state changed:", value))
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
