import * as React from "react";
import "./Button.css";

export interface ButtonProps {
    label: string;
    onClick: React.MouseEventHandler;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = props => {
    const { label, onClick, disabled } = props;
    return (
        <button onClick={onClick} disabled={disabled}>{label}</button>
    );
};
