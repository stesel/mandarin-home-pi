import * as React from "react";
import "./Schedule.css";
import { CloseButton } from "./button/CloseButton";
import { useIsScheduleOpen } from "../hooks";
import { Repeat } from "./repeat/Repeat";
import { StartTime } from "./startTime/StartTime";

export const Schedule: React.FC = () => {
    const isOpen = useIsScheduleOpen();
    return isOpen ? (
        <div className="schedule">
            <div className="scheduleContent">
                <h2>Schedule</h2>
                <br/>
                <Repeat />
                <StartTime />
                <br/>
                <CloseButton />
            </div>
        </div>
    ) : null;
};
