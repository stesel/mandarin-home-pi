import {
    GenericPayload,
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";

function hello() {
    const i: GenericPayload = {
        timestamp: Date.now(),
    };
    console.log("Hello Pi", i.timestamp, RepeatType.EveryDay,  StartTimeType.Nine);
}

hello();
