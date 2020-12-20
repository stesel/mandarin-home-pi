import * as path from "path";
import express from "express";
import { registerWSServer } from "./servicers/webSocketServer";
import { registerDB } from "./servicers/db";
import { registerSchedule } from "./servicers/schedule";

const port = process.env.PORT || process.env.PORT_PI || 3000;

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
