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
    externals: {
        "bufferutil": "bufferutil",
        "utf-8-validate": "utf-8-validate",
        "express": "express",
    },
    optimization: {
        minimize: false,
    },
};

export default config;
