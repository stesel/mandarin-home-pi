import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Provider } from "mobx-react";
import { pumping } from "../../store/pumping";
import { Pumping } from "../pumping/Pumping";

export class App extends React.Component {

    public render() {
        return (
            <Provider pumping={pumping}>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p className="App-header-text">Mandarin Home Pi</p>
                    </header>
                    <main className="App-main">
                        <Pumping />
                    </main>
                </div>
            </Provider>
        );
    }

    public shouldComponentUpdate() {
        return false;
    }
}
