import * as React from "react";
import { Toggle } from "../toggle/Toggle";
import {
    useChangeIsPumping,
    useIsPumping,
} from "../hooks";

export const Pumping: React.FC = () => {
    const isPumping = useIsPumping();
    const changeIsPumping = useChangeIsPumping();
    return (
        <section className="pumping">
            <Toggle title={"Pumping"} value={isPumping} changeValue={changeIsPumping} />
        </section>
    );
};
