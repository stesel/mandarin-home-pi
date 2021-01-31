import * as path from "path";
import express from "express";
import { registerWSServer } from "./services/webSocketServer";
import { registerDB } from "./services/db";
import { registerSchedule } from "./services/schedule";
import { registerPiEmulator } from "./services/piEmulation";
import { DEFAULT_PORT } from "@mandarin-home-pi/common";

const port = process.env.PORT || DEFAULT_PORT;

const app = express();

app.use(express.static(path.join(".", "packages", "client", "build")));
app.use("/mandarin-home-pi.js", express.static(path.join(".", "packages", "client-pi", "build", "index.js")));

app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(__dirname, "..", "..", "client", "build", "index.html")));
});

const server = app.listen(port, () => {
    console.log(
        `App is running at port: ${port}, mode: ${app.get("env")}`,
    );
});

registerDB();
registerWSServer(server);
registerSchedule();
registerPiEmulator();
