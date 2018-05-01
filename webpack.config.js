var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");

var srcDir = path.join(__dirname, "src");
var outDir = path.join(__dirname, "dist");

var config = {
  mode: "development",
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    filename: '[name].js'
  },
  output : {
    path: outDir,
    filename: "[name].js"
  },
  module : {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ],
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(srcDir, "images"),
        to: path.join(outDir, "images")
      },
      {
        from: path.join(srcDir, "index.html"),
        to: path.join(outDir, "index.html")
      },
      {
        from: path.join(srcDir, "config.json"),
        to: path.join(outDir, "config.json")
      },
      {
        from: path.join(__dirname, "images", "icon.png"),
        to: path.join(outDir, "icon.png")
      }
    ])
  ]
};

module.exports = [
  Object.assign({}, config, {
    target: "electron-main",
    entry: {
      main: "./src/main.ts",
    }
  }),
  Object.assign({}, config, {
    target: "electron-renderer",
    entry: {
      renderer: "./src/renderer.tsx",
    }
  }),
  Object.assign({}, config, {
    target: "electron-renderer",
    entry: {
      preload: "./src/preload.ts",
    }
  })
]
