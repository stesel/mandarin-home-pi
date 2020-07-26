import * as React from "react";
import { Select } from "../../select/Select";
import { StartTimeType } from "../../../consts/StartTime";
import { useScheduleStartTime } from "../../hooks";

const allStartTimes = Object.values(StartTimeType);

export const StartTime: React.FC = () => {
    const startTime = useScheduleStartTime();
    return (
        <Select
            name="startTime"
            id="startTime"
            label="Start time"
            defaultValue={startTime}
        >
            {allStartTimes.map(time => (
                <option key={time} value={time}>{time}</option>
            ))}
        </Select>
    );
};
