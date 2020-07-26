import { Button } from "../../button/Button";
import React from "react";
import { useIsScheduleOpen } from "../../hooks";
import { openSchedule } from "../../../store/ui";

export const ScheduleButton: React.FC = () => {
    const isScheduleOpen = useIsScheduleOpen();
    console.log("ScheduleButton", isScheduleOpen);
    return (
        <Button
            label="Schedule"
            onClick={openSchedule}
            disabled={isScheduleOpen}
        />
    );
}
