import React from "react";
import { RepeatType } from "../../../consts/RepeatType";
import { Select } from "../../select/Select";
import { useScheduleRepeat } from "../../hooks";

const allRepeatTypes: RepeatType[] = Object.values(RepeatType);

const labelMap: Record<RepeatType, string> = {
    [RepeatType.Never]: "Never",
    [RepeatType.EveryDay]: "Every Day",
    [RepeatType.EverySecondDay]: "Every Second Day",
    [RepeatType.EveryThirdDay]: "Every Third Day",
    [RepeatType.EveryFourthDay]: "Every Fourth Day",
    [RepeatType.EveryFifthDay]: "Every Fifth Day",
};

export const Repeat: React.FC = () => {
    const repeat = useScheduleRepeat();
    return (
        <Select
            name="repeat"
            id="repeat"
            label="Repeat"
            defaultValue={repeat}
        >
            {allRepeatTypes.map(type => (
                <option key={type} value={type}>{labelMap[type]}</option>
            ))}
        </Select>
    );
};
