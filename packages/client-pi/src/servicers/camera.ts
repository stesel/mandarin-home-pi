import { camera } from "../store/camera";
import { runInAction } from "mobx";
import {
    defaultBase64Shot,
    getBase64ShotAndSaveToFile,
    isMandarinPiDevice,
} from "../utils/deviceUtils";

export function requestCameraShot() {
    runInAction(() => {
        camera.imageBase64.set("");
    });

    if (isMandarinPiDevice()) {
        getBase64ShotAndSaveToFile().then(base64 => {
            runInAction(() => {
                camera.imageBase64.set(base64);
            });
        }).catch(reason => console.warn("Failed to make shot", reason));
    } else {
        runInAction(() => {
            camera.imageBase64.set(defaultBase64Shot);
        });
    }
 }
