import * as React from "react";
import { Button } from "../../button/Button";
import {
    useIsPiConnected,
    useIsShotOpen,
    useOpenShot,
} from "../../hooks";

export const ShotButton: React.FC = () => {
    const isShotOpen = useIsShotOpen();
    const isPiConnected = useIsPiConnected();
    return (
        <Button
            label="Take Shot"
            onClick={useOpenShot()}
            disabled={isShotOpen || !isPiConnected}
        />
    );
}
