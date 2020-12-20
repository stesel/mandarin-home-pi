import * as path from "path";
import express from "express";
import * as http from "http";
import { registerWSServer } from "./servicers/webSocketServer";
import { registerDB } from "./servicers/db";
import { registerSchedule } from "./servicers/schedule";

const app = express();

const httpPort = process.env.HTTP_PORT_PI || 3000;
const wsPort = process.env.HTTP_PORT_PI || 3001;

app.use(express.static(path.join(".", "packages", "client", "build")));
app.use("/mandarin-home-pi.js", express.static(path.join(".", "packages", "client-pi", "build", "index.js")));

if (process.env.NODE_ENV === "production") {
    app.listen(httpPort);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(__dirname, "..", "..", "client", "build", "index.html")));
});

const server = http.createServer(app);

app.set("port", wsPort);

registerDB();
registerWSServer(server);
registerSchedule();

server.listen(app.get("port"), () => {
    console.log(
        `App is running at port: ${app.get("port")}, mode: ${app.get("env")}`,
    );
});
