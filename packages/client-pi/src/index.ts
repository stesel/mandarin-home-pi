import { registerWS } from "./servicers/webSocket";
import { registerDevice } from "./servicers/device";

registerDevice();
registerWS();
