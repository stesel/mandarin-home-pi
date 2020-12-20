import {
    reaction,
    runInAction,
} from "mobx";
import {
    PUMPING_TIMEOUT,
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";
import { pumping } from "../store/pumping";

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

const TIMEOUT_INTERVAL = ONE_MINUTE;

const hourTimeMap: Record<StartTimeType, number> = {
    [StartTimeType.Zero]: 0,
    [StartTimeType.One]: 1,
    [StartTimeType.Two]: 2,
    [StartTimeType.Three]: 3,
    [StartTimeType.Four]: 4,
    [StartTimeType.Five]: 5,
    [StartTimeType.Six]: 6,
    [StartTimeType.Seven]: 7,
    [StartTimeType.Eight]: 8,
    [StartTimeType.Nine]: 9,
    [StartTimeType.Ten]: 10,
    [StartTimeType.Eleven]: 11,
    [StartTimeType.Twelve]: 12,
    [StartTimeType.Thirteen]: 13,
    [StartTimeType.Fourteen]: 14,
    [StartTimeType.Fifthteen]: 15,
    [StartTimeType.Sixteen]: 16,
    [StartTimeType.Seventeen]: 17,
    [StartTimeType.Eighteen]: 18,
    [StartTimeType.Nineteen]: 19,
    [StartTimeType.Twenty]: 20,
    [StartTimeType.TwentyOne]: 21,
    [StartTimeType.TwentyTwo]: 22,
    [StartTimeType.TwentyThree]: 23,
};

const dayTimeMap: Record<RepeatType, number> = {
    [RepeatType.Never]: 0,
    [RepeatType.EveryDay]: 1,
    [RepeatType.EverySecondDay]: 2,
    [RepeatType.EveryThirdDay]: 3,
    [RepeatType.EveryFourthDay]: 4,
    [RepeatType.EveryFifthDay]: 5,
};

function getIsNextTimeApproached(repeat: RepeatType, startTime: StartTimeType, lastTime: number): boolean {
    const lastDate = new Date(lastTime);
    const now = Date.now();
    const nowDate = new Date(now);

    const daysPassed = nowDate.getDate() > lastDate.getDate()
        ? nowDate.getDate() - lastDate.getDate()
        : lastDate.getDate() + new Date(lastDate.getFullYear(), lastDate.getMonth(), 0).getDate() - lastDate.getDate();

    return daysPassed === dayTimeMap[repeat] && nowDate.getHours() === hourTimeMap[startTime]
        && now - lastTime > ONE_HOUR;
}

export function registerSchedule() {
    let scheduleTimeout: NodeJS.Timeout;
    function schedulePumping() {
        clearTimeout(scheduleTimeout);
        const repeat = pumping.repeat.get();
        const startTime = pumping.startTime.get();
        const lastTime = pumping.lastTime.get();
        if (pumping.repeat.get() !== RepeatType.Never) {
            scheduleTimeout = setTimeout(() => {
                if (getIsNextTimeApproached(repeat, startTime, lastTime)) {
                    runInAction(() => {
                        pumping.isPumping.set(true);
                    });
                } else {
                    schedulePumping();
                }
            }, TIMEOUT_INTERVAL);
        }
    }

    reaction(() => pumping.repeat.get(), () => {
        schedulePumping();
    });

    reaction(() => pumping.startTime.get(), () => {
        schedulePumping();
    });

    reaction(() => pumping.isPumping.get(), isPumping => {
        console.warn("isPumping", isPumping, Date.now());
        if (isPumping) {
            runInAction(() => {
                pumping.lastTime.set(Date.now());
            });
        } else {
            schedulePumping();
        }
    });

    let pumpingTimeout: NodeJS.Timeout;
    reaction(() => pumping.isPumping.get(), isPumping => {
        clearTimeout(pumpingTimeout);
        if (isPumping) {
            pumpingTimeout = setTimeout(() => {
                runInAction(() => {
                    pumping.isPumping.set(false);
                });
            }, PUMPING_TIMEOUT);
        }
    });
}
