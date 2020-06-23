'use strict';

const Path = require('path');
const webpack = require('webpack');
const webpackConfig = require('@silverstripe/webpack-config');
const {
    resolveJS,
    externalJS,
    moduleJS,
    pluginJS,
    moduleCSS,
    pluginCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
    ROOT: Path.resolve(),
    MODULES: 'node_modules',
    FILES_PATH: '../',
    THIRDPARTY: 'thirdparty',
    SRC: Path.resolve('client/src'),
};


const config = {
    entry: {
        bundle: Path.join(__dirname, '/client/src/bundles/bundle')
    },
    output: {
        path: Path.join(__dirname, '/client/dist'),
        filename: '[name].min.js'
    },

    resolve: resolveJS(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    //module: moduleJS(ENV, PATHS),
    plugins: pluginJS(ENV, PATHS),
    /*
    resolve: {
        extensions: ["", ".webpack.js", ".jsx", ".js"]
    },*/

    // module: {
    //     loaders: [
    //         {
    //             test: /\.jsx?$/,
    //             exclude: /node_modules/,
    //             loader: 'babel-loader'
    //         }
    //     ]
    // },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            }
        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         }
    //     })
    // ]
};

//module.exports = config;
module.exports = (process.env.WEBPACK_CHILD)
    ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
    : module.exports = config;

