import * as React from "react";
import { ConnectionIcon } from "../connection/icon/ConnectionIcon";
import { Latency } from "../connection/latency/Latency";

import "./StatusBar.css";

const Space: React.FC = () => (<span className="space" />);

export const StatusBar: React.FC = () => {
    return (
        <div className="statusBar">
            <Latency />
            <Space />
            <ConnectionIcon />
        </div>
    );
};
