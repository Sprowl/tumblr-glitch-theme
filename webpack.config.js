const path = require("path");

module.exports = {
    entry: ["./src/scripts/index.ts", "./src/styles/theme.less"],
    mode: "production",
    //devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].css",
                            outputPath: "/"
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "less-loader", options: {
                            strictMath: true,
                            noIeCompat: true
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ],
        modules : [
            "app", "node_modules"
        ],
        alias: {
            html2canvas : path.resolve(__dirname, "node_modules/html2canvas/dist/html2canvas.js"),
            colorcolor : path.resolve(__dirname, "node_modules/colorcolor/src/colorcolor.js")
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist",
    }
};
