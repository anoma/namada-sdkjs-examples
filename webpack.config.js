const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  mode: "development",
  entry: path.join(__dirname, "src", "index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: path.join(__dirname, "tsconfig.json"),
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.join(__dirname, "src/"), "node_modules"],
    fallback: {
      buffer: require.resolve("buffer"),
    },
    alias: {
      "../package.json": path.resolve(
        __dirname,
        "./node_modules/@namada/sdk/package.json",
      ),
    },
  },
  devServer: {
    static: [
      path.join(__dirname, "public"),
      path.join(__dirname, ".", "node_modules", "@namada", "sdk", "dist"),
    ],
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.DefinePlugin({
      process: {
        env: {},
      },
    }),
  ],
};
