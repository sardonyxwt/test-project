/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const {
    default: createStyledComponentsTransformer,
} = require('typescript-plugin-styled-components');
const { apiMiddleware } = require('./dev-server-api.middleware');

module.exports = {
    entry: ['./src/index'],
    output: {
        filename: `js/[name].[hash].js`,
        chunkFilename: `js/[name].[hash].js`,
    },
    devtool: 'source-map',
    mode: 'development',
    stats: 'errors-only',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.sass', '.json']
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(t|j)sx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            createStyledComponentsTransformer({
                                minify: false,
                                displayName: true,
                            }),
                        ],
                    }),
                },
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'index.html',
        }),
    ],
    devServer: {
        hot: true,
        overlay: true,
        before: apiMiddleware,
    },
};
