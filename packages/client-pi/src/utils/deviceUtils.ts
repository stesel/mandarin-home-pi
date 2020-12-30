import {
    exec,
    ExecOptions,
    execSync,
} from "child_process";
import { writeFile } from "fs";
import * as path from "path";

export function isMandarinPiDevice() {
    const uname = execSync("uname -a").toString();
    return uname.includes("mandarinpi");
}

export function execute(command: string, options: ExecOptions = {}) {
    return new Promise<string>((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (stderr || error) {
                reject(stderr || error);
            }
            resolve(stdout);
        });
    });
}

export function saveMandarinShotToFile(image: string) {
    writeFile(
        path.join(".", "mandarin-pi-shots", `${new Date().toISOString()}.jpg`),
        image,
        error => console.warn("Failed to write image", error?.name)
    );
}

export function getBase64ImageUrl(image: string): string {
    const data = Buffer.from(image, "binary").toString("base64");
    return `data:image/jpg;base64,${data}`;
}

const cameraBuffer = 1024 * 1024 * 10;
const cameraExecOptions = { encoding: "binary", maxBuffer: cameraBuffer };

export async function getCameraShot() {
    return await execute(
        "raspistill --nopreview --width 640 --height 480",
        cameraExecOptions,
    );
}

export async function getBase64ShotAndSaveToFile() {
    const image = await getCameraShot();
    saveMandarinShotToFile(image);
    return getBase64ImageUrl(image);
}
