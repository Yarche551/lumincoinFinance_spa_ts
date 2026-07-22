import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./src/app.ts",
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compiler: "typescript"
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        // в исходниках импорты вида "./router.js", а физически лежит router.ts
        extensionAlias: {
            ".js": [".ts", ".tsx", ".js"],
        },
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/static/fonts", to: "fonts" },
            ],
        }),
    ],
};