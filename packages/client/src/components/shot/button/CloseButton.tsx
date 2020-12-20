import { Button } from "../../button/Button";
import * as React from "react";
import { useCloseShot } from "../../hooks";

export const CloseButton: React.FC = () => {
    return (
        <Button
            label="Close"
            onClick={useCloseShot()}
        />
    );
};
