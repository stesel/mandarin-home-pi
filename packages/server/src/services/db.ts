import { Client, query as q } from "faunadb";
import { pumping } from "../store/pumping";
import { statistics } from "../store/statistics";
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
        authorizedVisitors: number;
        pumpRequests: number;
        shotRequests: number;
    }
}

function getData(): DBData {
    return {
        data: {
            repeat: pumping.repeat.get(),
            startTime: pumping.startTime.get(),
            lastTime: pumping.lastTime.get(),
            visitors: statistics.visitors.get(),
            authorizedVisitors: statistics.authorizedVisitors.get(),
            pumpRequests: statistics.pumpRequests.get(),
            shotRequests: statistics.shotRequests.get(),
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
            lastData.data.authorizedVisitors = data.authorizedVisitors || lastData.data.authorizedVisitors;
            lastData.data.pumpRequests = data.authorizedVisitors || lastData.data.pumpRequests;
            lastData.data.shotRequests = data.authorizedVisitors || lastData.data.shotRequests;

            pumping.repeat.set(data.repeat);
            pumping.startTime.set(data.startTime);
            pumping.lastTime.set(data.lastTime);
            statistics.visitors.set(data.visitors);
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
            && data.authorizedVisitors === lastData.data.authorizedVisitors
            && data.pumpRequests === lastData.data.pumpRequests
            && data.shotRequests === lastData.data.shotRequests
        ) {
            return;
        }

        lastData.data.repeat = data.repeat;
        lastData.data.startTime = data.startTime;
        lastData.data.lastTime = data.lastTime;
        lastData.data.visitors = data.visitors;
        lastData.data.authorizedVisitors = data.authorizedVisitors;
        lastData.data.pumpRequests = data.pumpRequests;
        lastData.data.shotRequests = data.shotRequests;

        client.query(
            q.Update(
                q.Ref(q.Collection(collectionName), refId),
                getData(),
            )
        ).then(() => console.log("DB updated", JSON.stringify(data)))
        .catch((error) => console.error("DB Error: %s", error))
    }

    reaction(() => pumping.repeat.get(), () => updateDB());
    reaction(() => pumping.startTime.get(), () => updateDB());
    reaction(() => pumping.lastTime.get(), () => updateDB());
    reaction(() => statistics.visitors.get(), () => updateDB());
    reaction(() => statistics.authorizedVisitors.get(), () => updateDB());
    reaction(() => statistics.pumpRequests.get(), () => updateDB());
    reaction(() => statistics.shotRequests.get(), () => updateDB());
}
