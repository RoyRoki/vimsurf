const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: "./src/celery/background.ts",
    content: "./src/extension/content.ts",
    options: "./src/ui/options.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      // Move alias under resolve
      extension: path.resolve(__dirname, 'src/extension/')
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        type: 'json'
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Copy manifest.json into dist/
        { from: "src/manifest.json", to: "manifest.json" },
        // Copy the options page HTML
        { from: "src/ui/options.html", to: "options.html" },
        // Copy all assets (icons, etc.)
        { from: "src/assets", to: "assets" },
      ],
    }),
  ],
};

