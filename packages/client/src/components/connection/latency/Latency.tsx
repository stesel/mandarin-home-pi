import * as React from "react";
import { useConnectionLatency } from "../../hooks";
import "./Latency.css";

export const Latency: React.FC = () => {
    return (
        <span className="latency">{useConnectionLatency()}ms</span>
    );
};
