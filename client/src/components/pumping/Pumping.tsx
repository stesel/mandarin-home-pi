import * as React from "react";
import {
    inject,
    observer,
} from "mobx-react";
import {
    PumpingStore,
} from "mandarin-home-pi";
import { Toggle } from "../toggle/Toggle";

interface ComponentProps {
    pumping?: PumpingStore;
}

const Component: React.FC<ComponentProps> = ({ pumping }) => {
    return (
        <section className="pumping">
            <Toggle title={"Pumping"} value={pumping!.isPumping} />
        </section>
    );
};

export const Pumping: React.FC = inject("pumping")(observer(Component));
