import { Button } from "../../button/Button";
import * as React from "react";
import { useIsScheduleOpen } from "../../hooks";
import { openSchedule } from "../../../store/ui";

export const ScheduleButton: React.FC = () => {
    const isScheduleOpen = useIsScheduleOpen();
    return (
        <Button
            label="Schedule"
            onClick={openSchedule}
            disabled={isScheduleOpen}
        />
    );
}
