import * as React from "react";
import { observer } from "mobx-react";
import { useConnectionLatency } from "../../hooks";
import "./Latency.css";

export const Latency: React.FC = observer(() => {
    return (
        <span className="latency">{useConnectionLatency()}ms</span>
    );
});
