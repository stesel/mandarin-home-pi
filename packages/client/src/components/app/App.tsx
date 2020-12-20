import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Provider } from "mobx-react";
import { pumping } from "../../store/pumping";
import { Pumping } from "../pumping/Pumping";
import { connection } from "../../store/connection";
import { ui } from "../../store/ui";
import { StatusBar } from "../statusBar/StatusBar";
import { ScheduleButton } from "../schedule/button/ScheduleButton";
import { Schedule } from "../schedule/Schedule";
import { Authorization } from "../authorization/Authorization";
import { ShotButton } from "../shot/button/ShotButton";
import { Shot } from "../shot/Shot";

export class App extends React.Component {

    public render() {
        return (
            <Provider
                connection={connection}
                pumping={pumping}
                ui={ui}
            >
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p className="App-header-text">Mandarin Home Pi</p>
                    </header>
                    <main className="App-main">
                        <Pumping />
                        <ScheduleButton />
                        <ShotButton />
                    </main>
                    <Schedule />
                    <Shot />
                    <Authorization />
                    <StatusBar />
                </div>
            </Provider>
        );
    }

    public shouldComponentUpdate() {
        return false;
    }
}
