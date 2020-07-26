import * as React from "react";
import { Toggle } from "../toggle/Toggle";
import { usePumping } from "../hooks";
import { observer } from "mobx-react";

export const Pumping: React.FC = observer(() => {
    const { isPumping, changePumping } = usePumping();
    return (
        <section className="pumping">
            <Toggle title={"Pumping"} value={isPumping} changeValue={changePumping} />
        </section>
    );
});
