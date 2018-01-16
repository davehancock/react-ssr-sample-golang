'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths ? {publicPath: Array(cssFilename.split('/').length).join('../')} : {};

module.exports = [
    {
        bail: true,
        devtool: 'source-map',
        entry: {
            client: [require.resolve('./polyfills'), paths.appClientJs],
        },
        output: {
            path: paths.appBuild,
            filename: 'static/js/[name].[chunkhash:8].js',
            chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
            publicPath: publicPath,
            devtoolModuleFilenameTemplate: info =>
                path
                    .relative(paths.appSrc, info.absoluteResourcePath)
                    .replace(/\\/g, '/'),
        },
        resolve: {
            modules: ['node_modules', paths.appNodeModules].concat(
                process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
            ),
            extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
            alias: {
                'react-native': 'react-native-web',
            },
            plugins: [
                new ModuleScopePlugin(paths.appSrc),
            ],
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    use: [
                        {
                            options: {
                                formatter: eslintFormatter,
                            },
                            loader: require.resolve('eslint-loader'),
                        },
                    ],
                    include: paths.appSrc,
                },
                {
                    exclude: [
                        /\.html$/,
                        /\.(js|jsx)$/,
                        /\.scss$/,
                        /\.css$/,
                        /\.json$/,
                        /\.bmp$/,
                        /\.gif$/,
                        /\.jpe?g$/,
                        /\.png$/,
                    ],
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: /\.(js|jsx)$/,
                    include: paths.appSrc,
                    loader: require.resolve('babel-loader'),
                    options: {
                        compact: true,
                    },
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract(
                        Object.assign(
                            {
                                fallback: require.resolve('style-loader'),
                                use: [
                                    {
                                        loader: require.resolve('css-loader'),
                                        options: {
                                            importLoaders: 1,
                                            minimize: true,
                                            sourceMap: true,
                                        },
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {
                                            ident: 'postcss',
                                            plugins: () => [
                                                require('postcss-flexbugs-fixes'),
                                                autoprefixer({
                                                    browsers: [
                                                        '>1%',
                                                        'last 4 versions',
                                                        'Firefox ESR',
                                                        'not ie < 9',
                                                    ],
                                                    flexbox: 'no-2009',
                                                }),
                                            ],
                                        },
                                    },
                                ],
                            },
                            extractTextPluginOptions
                        )
                    ),
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {

                                    minimize: true,
                                    sourceMap: true,
                                    importLoaders: 2,
                                    localIdentName: '[name]__[local]___[hash:base64:5]'
                                }
                            },
                            'sass-loader'
                        ]
                    })
                },
            ],
        },
        plugins: [
            new InterpolateHtmlPlugin(env.raw),
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.appHtml,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
                excludeChunks: ['server']
            }),
            new webpack.DefinePlugin(env.stringified),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    comparisons: false,
                },
                output: {
                    comments: false,
                    ascii_only: true,
                },
                sourceMap: true,
            }),
            new ExtractTextPlugin({filename: cssFilename, allChunks: true}),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
            }),
            new SWPrecacheWebpackPlugin({
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                logger(message) {
                    if (message.indexOf('Total precache size is') === 0) {
                        return;
                    }
                    if (message.indexOf('Skipping static resource') === 0) {
                        return;
                    }
                    console.log(message);
                },
                minify: true,
                navigateFallback: publicUrl + '/index.html',
                navigateFallbackWhitelist: [/^(?!\/__).*/],
                staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ],

        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        },
    },
    {
        bail: true,
        devtool: 'source-map',
        entry: {
            server: [require.resolve('./polyfills'), paths.appServerJs]
        },
        output: {
            path: paths.appBuild,
            filename: 'static/js/[name].js',
            chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
            publicPath: publicPath,
            devtoolModuleFilenameTemplate: info =>
                path
                    .relative(paths.appSrc, info.absoluteResourcePath)
                    .replace(/\\/g, '/'),
        },
        resolve: {
            modules: ['node_modules', paths.appNodeModules].concat(
                process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
            ),
            extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
            alias: {
                'react-native': 'react-native-web',
            },
            plugins: [
                new ModuleScopePlugin(paths.appSrc),
            ],
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    use: [
                        {
                            options: {
                                formatter: eslintFormatter,
                            },
                            loader: require.resolve('eslint-loader'),
                        },
                    ],
                    include: paths.appSrc,
                },
                {
                    exclude: [
                        /\.(js|jsx)$/,
                    ],
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: /\.(js|jsx)$/,
                    include: paths.appSrc,
                    loader: require.resolve('babel-loader'),
                    options: {

                        compact: true,
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(env.stringified),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false,
            //         comparisons: false,
            //     },
            //     output: {
            //         comments: false,
            //         ascii_only: true,
            //     },
            //     sourceMap: true,
            // }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ],
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        },
    }
];
