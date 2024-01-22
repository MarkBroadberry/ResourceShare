const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
      }
    ],
  },
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "buffer": false,
      "url": false,
      "vm": false,
      "os": false, 
      "crypto-browserify": false,
      "querystring": false,
      "esbuild": false,
      "assert": false, 
      "constants": false,
      "child_process": false, 
      "worker_threads": false, 
      "@swc/core": false,
      "uglify-js":false,
      "module": false, 
    } 
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV' : JSON.stringify('development')
    }),
      // fix "process is not defined" error:
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
  ],
};