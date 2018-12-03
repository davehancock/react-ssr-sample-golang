const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports =
  [
    // Client (frontend) bundle
    {
      entry: './react-src/client.js',
      output: {
        path: path.join(__dirname, 'react-build'),
        filename: 'static/js/client.[chunkhash:8].js',
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env', 'react'],
                babelrc: false,
              },
            },
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
        new ExtractTextPlugin(`static/css/client.[contenthash:8].css`),
        new HtmlWebPackPlugin({
          template: "public/index.html",
        })
      ],
    },
    // Server side (SSR) bundle
    {
      entry: ['babel-polyfill', './react-src/server.js'],
      output: {
        path: path.join(__dirname, 'react-build'),
        filename: 'static/js/server.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env', 'react'],
                babelrc: false,
              },
            },
          },
        ],
      },
      plugins: [
        new CopyWebpackPlugin([
          { from: 'public', ignore: ['*.html'] }
        ])
      ]
    }
  ];
