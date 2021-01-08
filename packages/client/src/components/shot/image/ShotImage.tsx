import * as React from "react";
import { useShotBase64 } from "../../hooks";
import "./ShotImage.css";

export const ShotImage: React.FC = () => {
    const base64 = useShotBase64();

    return (
        <div className="shotImageContainer">
            {base64 ? (
                <img
                    className="shotImage"
                    src={base64}
                    alt="shot"
                />
            ) : <span className="waitImage">Wait for Shot...</span>}
        </div>
    );
};
