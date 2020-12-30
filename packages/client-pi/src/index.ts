import { registerWS } from "./servicers/webSocket";
import { registerPumper } from "./servicers/pumper";

registerPumper();
registerWS();
