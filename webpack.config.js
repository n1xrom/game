const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const isDev = process.env.NODE_ENV !== "production";
const isTrajectory = process.env.NODE_ENV === "trajectories";

const config = {
  mode: isDev ? "development" : "production",
  devtool: "source-map",
  entry: isTrajectory
    ? "./src/scripts/shared/generateResultTables/resultTable.ts"
    : "./src/scripts/app.ts",
  output: {
    path: path.resolve(
      __dirname,
      isTrajectory
        ? "./src/scripts/shared/generateResultTables/resultTables"
        : "dist"
    ),
    filename: isTrajectory ? "resultTable.js" : "bundle.js",
    library: "plinko",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: isTrajectory
          ? "src/scripts/shared/generateResultTables/index.html"
          : "src/index.html",
        to: "index.html",
      },
      { from: "src/css/style.css", to: "css/" },
    ]),
    new Dotenv(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    hot: true,
  },
  optimization: {
    minimize: !isDev,
  },
};

module.exports = config;
