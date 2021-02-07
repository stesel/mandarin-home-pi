import {
    IObservableValue,
    runInAction,
} from "mobx";

export function incrementObservableNumber(observableNumber: IObservableValue<number>) {
    runInAction(() => {
        observableNumber.set(observableNumber.get() + 1);
    });
}
