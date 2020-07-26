import { RequestHandler } from "express";

export const env: RequestHandler = (request, response) => {
    response.send(response.app.get("env"));
};
