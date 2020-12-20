import {
    IObservableValue,
    observable,
} from "mobx";

interface CameraStore {
    imageBase64: IObservableValue<string>
}

export const camera: CameraStore = {
    imageBase64: observable.box(""),
};
