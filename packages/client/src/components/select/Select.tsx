import * as React from "react";
import "./Select.css";

export interface SelectProps extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> {
    label: string;
}

export const Select: React.FC<SelectProps> = props => {
    return (
        <div className="selectWrapper">
            <label>Repeat</label>
            <select {...props}>
                {props.children}
            </select>
        </div>
    );
};
