import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/app/App";
import * as serviceWorker from "./serviceWorker";
import { registerWS } from "./services/webSocket";
import { userAuthentication } from "./services/login";

async function authenticate() {
    const success = await userAuthentication();

    if (success) {
        ReactDOM.render(<App />, document.getElementById("root"));
        registerWS();
    }

    return success;
}

authenticate().then(authenticated => {
    console.log("authenticated", authenticated);
});

serviceWorker.register();
