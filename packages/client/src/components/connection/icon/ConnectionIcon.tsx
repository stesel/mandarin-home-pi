import * as React from "react";

import "./ConnectionIcon.css";
import {
    useIsPiConnected,
    useIsServerConnected,
} from "../../hooks";

const borderColor = "#ffffff";

enum IconColor {
    Green = "#34C759",
    Yellow = "#ffcc00",
    Grey = "#8E8D93",
}

function getStatusColor(serverConnected: boolean, piConnected: boolean): IconColor {
    if (serverConnected && piConnected) {
        return IconColor.Green;
    } else if (serverConnected) {
        return IconColor.Yellow;
    } else {
        return IconColor.Grey;
    }
}

const Icon: React.FC<{ color: IconColor }> = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 54 48">
            <rect fill={color} x="1" y="33" width="14" height="14"/>
            <path fill={borderColor} d="M14,34v12H2V34H14 M16,32H0v16h16V32L16,32z"/>
            <rect fill={color} x="39" y="1" width="14" height="46"/>
            <path fill={borderColor} d="M52,2v44H40V2H52 M54,0H38v48h16V0L54,0z"/>
            <rect fill={color} x="20" y="17" width="14" height="30"/>
            <path fill={borderColor} d="M33,18v28H21V18H33 M35,16H19v32h16V16L35,16z"/>
        </svg>
    )
}

export const ConnectionIcon: React.FC = () => {
    const isServerConnected = useIsServerConnected();
    const isPiConnected = useIsPiConnected();
    return (
        <div className="connectionIcon">
            <Icon color={getStatusColor(isServerConnected, isPiConnected)}/>
        </div>
    );
};
