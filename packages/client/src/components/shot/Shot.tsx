import * as React from "react";
import "./Shot.css";
import { CloseButton } from "./button/CloseButton";
import { useIsShotOpen } from "../hooks";
import { ShotImage } from "./image/ShotImage";

export const Shot: React.FC = () => {
    const isOpen = useIsShotOpen();
    return isOpen ? (
        <div className="shot">
            <div className="shotContent">
                <h2>Shot</h2>
                <br/>
                <ShotImage />
                <br/>
                <CloseButton />
            </div>
        </div>
    ) : null;
};
