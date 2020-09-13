import * as React from "react";
import "./Toggle.css";

export interface ToggleProps {
    value: boolean;
    changeValue: (value: boolean) => void;
    title: string;
}

export class Toggle extends React.PureComponent<ToggleProps> {

    public render() {
        const { value, title } = this.props;
        return (
            <div className="toggle-container">
                <p className="toggle-title">{title}</p>
                <label className="toggle">
                    <input
                        checked={value}
                        onChange={this.onChange}
                        type="checkbox"
                        className="toggle-input"
                    />
                    <span className="toggle-slider" />
                </label>
            </div>
        );
    }

    private onChange = () => {
        this.props.changeValue(!this.props.value);
    }
}
