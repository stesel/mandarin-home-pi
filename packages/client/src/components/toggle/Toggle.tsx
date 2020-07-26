import {
    action,
    IObservableValue,
} from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import "./Toggle.css";

export interface ToggleProps {
    value: IObservableValue<boolean>
    changeValue: IObservableValue<boolean>;
    title: string;
}

@observer
export class Toggle extends React.PureComponent<ToggleProps> {

    public render() {
        const { value, title } = this.props;
        return (
            <div className="toggle-container">
                <p className="toggle-title">{title}</p>
                <label className="toggle">
                    <input
                        checked={value.get()}
                        onChange={this.onChange}
                        type="checkbox"
                        className="toggle-input"
                    />
                    <span className="toggle-slider" />
                </label>
            </div>
        );
    }

    @action("Toggle Component Change")
    private onChange = () => {
        this.props.changeValue.set(!this.props.value.get());
    }

}
