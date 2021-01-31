declare namespace NodeJS {
    export interface ProcessEnv {
        SECRET_PHRASE_CLIENT: string;
        SECRET_PHRASE_PI: string;
        DB_SECRET_PI: string;
        PI_MODE: "PRODUCTION" | "EMULATION";
    }
}
