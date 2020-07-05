import express from "express";
import * as http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { env } from "./env";
import { registerWSServer } from "./wsServer";
import { userAuthentication } from "./loginService";
import { registerDevice } from "./device";
import { registerControlObservers } from "./controlObservers";

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
app.set("port", process.env.PORT || 3000);
app.get("/env", env);

registerControlObservers([
    registerWSServer(server),
    registerDevice(),
]);

server.listen(app.get("port"), () => {
    console.log(
        `App is running at port: ${app.get("port")}, mode: ${app.get("env")}`,
    );
});
