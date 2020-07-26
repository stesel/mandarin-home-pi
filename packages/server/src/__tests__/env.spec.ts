import { Express, Response } from "express";
import { env } from "../env";

describe("/env", () => {

    it("should return env property", () => {
        const app = {
            get: (prop: string) => {
                if (prop === "env") {
                    return "test-env";
                } else {
                    return "error";
                }
            },
        };
        const response = {
            send: jest.fn(),
            app: app,
        };
        env({} as any, response as any, jest.fn());
        expect(response.send).toHaveBeenCalledWith(app.get("env"));
    });

});
