import { Client, query as q } from "faunadb";
import { connection } from "../store/connection";
import { pumping } from "../store/pumping";
import {
    reaction,
    runInAction,
} from "mobx";
import {
    RepeatType,
    StartTimeType,
} from "@mandarin-home-pi/common";

const collectionName = "settings";
const refId = "181388642581742080";

interface DBData {
    data: {
        repeat: RepeatType;
        startTime: StartTimeType;
        lastTime: number;
        visitors: number;
    }
}

function getData(): DBData {
    return {
        data: {
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
            lastTime: pumping.lastTime.get(),
            visitors: connection.visitors.get(),
        },
    };
}

export function registerDB() {
    const dbSecret = process.env.DB_SECRET_PI || "fnAD89FqpUACB4o8Sa6hkrLkzNNEWsdpflELFu_X";

    const client = new Client({
        secret: dbSecret,
        keepAlive: false,
    });

    const lastData: DBData = getData();

    client.query(
        q.Get(q.Ref(q.Collection(collectionName), refId))
    ).then(response => {
        runInAction(() => {
            const { data } = (response as DBData);
            console.log("DB is got: ", JSON.stringify(data));

            lastData.data.repeat = data.repeat || lastData.data.repeat;
            lastData.data.startTime = data.startTime || lastData.data.startTime;
            lastData.data.lastTime = data.lastTime || lastData.data.lastTime;
            lastData.data.visitors = data.visitors || lastData.data.visitors;

            pumping.repeat.set(data.repeat);
            pumping.startTime.set(data.startTime);
            pumping.lastTime.set(data.lastTime);
            connection.visitors.set(data.visitors);
        });
    }).catch(error => {
        if (error.name === "NotFound") {
            client.query(
                q.Create(
                    q.Ref(q.Collection(collectionName), refId),
                    getData(),
                ),
            ).then(() => console.log("DB created"))
            .catch(error => console.error("DB Error: %s", error));
        } else  {
            console.error("DB Error: %s", error);
        }
    });

    function updateDB() {
        const { data } = getData();

        if (data.repeat === lastData.data.repeat
            && data.startTime === lastData.data.startTime
            && data.lastTime === lastData.data.lastTime
            && data.visitors === lastData.data.visitors
        ) {
            return;
        }

        lastData.data.repeat = data.repeat;
        lastData.data.startTime = data.startTime;
        lastData.data.lastTime = data.lastTime;
        lastData.data.visitors = data.visitors;

        client.query(
            q.Update(
                q.Ref(q.Collection(collectionName), refId),
                getData(),
            )
        ).then(() => console.log("DB updated"))
        .catch((error) => console.error("DB Error: %s", error))
    }

    reaction(() => pumping.repeat.get(), () => updateDB());
    reaction(() => pumping.startTime.get(), () => updateDB());
    reaction(() => pumping.lastTime.get(), () => updateDB());
    reaction(() => connection.visitors.get(), () => updateDB());
}
