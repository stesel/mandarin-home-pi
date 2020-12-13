import { Client, query as q } from "faunadb";
import { pumping } from "../store/pumping";
import {
    reaction,
    runInAction,
} from "mobx";
import {
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";

const collectionName = "schedule";
const refId = "181388642581742080";

interface DBData {
    data: {
        repeat: RepeatType;
        startTime: StartTimeType;
    }
}

function getData(): DBData {
    return {
        data: {
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
        },
    };
}

export function registerDB() {
    process.env.DB_SECRET_PI = "fnAD89FqpUACB4o8Sa6hkrLkzNNEWsdpflELFu_X";

    const client = new Client({
        secret: process.env.DB_SECRET_PI,
        keepAlive: false,
    });

    const lastData: DBData = {
        data: {
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
        },
    }

    client.query(
        q.Get(q.Ref(q.Collection(collectionName), refId))
    ).then(response => {
        console.log("DB is got")
        runInAction(() => {
            const { data } = (response as DBData);

            lastData.data.repeat = data.repeat;
            lastData.data.startTime = data.startTime;

            pumping.repeat.set(data.repeat);
            pumping.startTime.set(data.startTime);
        });
    }).catch(error => {
        if (error.name === "NotFound") {
            client.query(
                q.Create(
                    q.Ref(q.Collection(collectionName), refId),
                    getData(),
                ),
            ).then(() => console.log("DB created"))
            .catch(error => console.error("Error: %s", error));
        } else  {
            console.error("Error: %s", error);
        }
    });

    function updateDB() {
        const { data } = getData();
        if (data.repeat === lastData.data.repeat && data.startTime === lastData.data.startTime) {
            console.log("DB is already actual");
            return;
        }

        lastData.data.repeat = data.repeat;
        lastData.data.startTime = data.startTime;

        client.query(
            q.Update(
                q.Ref(q.Collection(collectionName), refId),
                getData(),
            )
        ).then(() => console.log("DB updated"))
        .catch((error) => console.error("Error: %s", error))
    }

    reaction(() => pumping.repeat.get(), () => updateDB());
    reaction(() => pumping.startTime.get(), () => updateDB());
}
