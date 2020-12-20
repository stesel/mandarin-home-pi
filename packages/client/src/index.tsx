import { configure } from "mobx";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/app/App";
import * as serviceWorker from "./serviceWorker";
import { registerWS } from "./services/webSocket";

configure({ enforceActions: "observed" });

ReactDOM.render(<App />, document.getElementById("root"));
registerWS();

serviceWorker.register();
