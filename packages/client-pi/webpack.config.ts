import * as path from "path";
import { Configuration } from "webpack";

const config: Configuration = {
    mode: "production",
    entry: "./src/index.ts",
    target: "node",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "build"),
    },
    performance: {
        hints: false,
    },
};

export default config;
