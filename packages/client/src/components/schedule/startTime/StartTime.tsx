import * as React from "react";
import { Select } from "../../select/Select";
import {
    useChangeStartTime,
    useScheduleStartTime,
} from "../../hooks";
import { StartTimeType } from "@mandarin-home-pi/common";

const allStartTimes = Object.values(StartTimeType);

export const StartTime: React.FC = () => {
    const startTime = useScheduleStartTime();
    const changeStartTime = useChangeStartTime();
    return (
        <Select
            name="startTime"
            id="startTime"
            label="Start time"
            defaultValue={startTime}
            onChange={changeStartTime}
        >
            {allStartTimes.map(time => (
                <option key={time} value={time}>{time}</option>
            ))}
        </Select>
    );
};
