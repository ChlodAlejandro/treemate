/* eslint-disable */
const fs = require("fs");
const path = require("path");
const {
    ProgressPlugin
} = require("webpack");

module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: 'source-map',
    entry: ["./src/Treemate.ts"],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "treemate.js"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"]
    },
    devServer: {
        compress: true,
        port: 8080,
        hot: true,
        contentBase: path.join(__dirname, "static"),
    },
    plugins: [
        new ProgressPlugin({
            activeModules: true,
            entries: true,
            modules: true,
            dependencies: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: ["text-loader"]
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: [
                    path.resolve(__dirname, "build"),
                    path.resolve(__dirname, "node_modules")
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: [
                    path.resolve(__dirname, "build")
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};