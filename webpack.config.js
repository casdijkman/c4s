// SPDX-FileCopyrightText: 2024 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const path = require('path');

const config = {
    entry: './docs/javascript/main.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};

module.exports = (environment, argv) => {
    const { mode } = argv;
    if (mode === 'development') config.devtool = 'inline-cheap-source-map';
    return config;
};
