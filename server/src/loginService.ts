import { RequestHandler } from "express";

export const userAuthentication: RequestHandler = (request, response) => {
    const password = request.body.password;

    process.env.SECRET_PHRASE_PI = "222";

    if (process.env.SECRET_PHRASE_PI && password === process.env.SECRET_PHRASE_PI) {
        return response.status(200).json({ message: "Success" });
    }

    return response.status(401).json({ message: "Invalid Authentication Credentials" });
};
