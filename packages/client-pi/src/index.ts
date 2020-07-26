import {
    GenericPayload,
} from "@mandarin-home-pi/common";

function hello() {
    const i: GenericPayload = {
        timestamp: Date.now(),
    };
    console.log("Hello Pi", i.timestamp);
}

hello();
