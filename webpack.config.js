const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const config = require("./package.json");

module.exports = {
    entry: path.resolve(__dirname, config.main),  // entry file to all our js modules
    devtool: "source-map",  // add source mapping
    output: {
        path: __dirname +'/public',  // path to output files
        filename: 'dist/bundle.js'
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    mode: config.mode
}