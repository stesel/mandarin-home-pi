import { Button } from "../../button/Button";
import React from "react";
import { closeSchedule } from "../../../store/ui";

export const CloseButton: React.FC = () => {
    return (
        <Button
            label="Close"
            onClick={closeSchedule}
        />
    );
};
