
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: "./src/background.ts",
    content: "./src/content.ts",
    options: "./src/options/options.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Copy manifest.json into dist/
        { from: "src/manifest.json", to: "manifest.json" },
        // Copy the options page HTML
        { from: "src/options/options.html", to: "options.html" },
        // Copy all assets (icons, etc.)
        { from: "src/assets", to: "assets" },
      ],
    }),
  ],
};

