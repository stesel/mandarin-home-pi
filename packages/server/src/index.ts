import express from "express";
import * as http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { env } from "./env";
import { registerWSServer } from "./servicers/webSocketServer";
import { userAuthentication } from "./servicers/loginService";
import { StartTimeType } from "@mandarin-home-pi/common";

console.log(StartTimeType.Nine);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("../client/build"));

const router = express.Router();
router.post("/users/authenticate", userAuthentication);
app.use(router);

const server = http.createServer(app);

// test app.set("port", process.env.PORT || 3001);
app.set("port", process.env.PORT || 3001);
app.get("/env", env);

registerWSServer(server);

server.listen(app.get("port"), () => {
    console.log(
        `App is running at port: ${app.get("port")}, mode: ${app.get("env")}`,
    );
});
