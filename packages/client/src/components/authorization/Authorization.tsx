import * as React from "react";
import "./Authorization.css";
import { Button } from "../button/Button";
import {
    useAuthorization,
    useIsAuthorized,
} from "../hooks";

export const Authorization: React.FC = () => {
    const { onChange, onSubmit } = useAuthorization();
    return !useIsAuthorized() ? (
        <div className="authorization">
            <form className="authorizationContent" onSubmit={onSubmit}>
                <h2>Authorization</h2>
                <input
                    id="password"
                    type="password"
                    autoComplete="off"
                    placeholder="Password"
                    className="authorizationInput"
                    onChange={onChange}
                />
                <Button
                    label={"Submit"}
                    onClick={onSubmit}
                />
            </form>
        </div>
    ) : null;
};
