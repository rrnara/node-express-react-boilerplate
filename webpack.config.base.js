const path = require('path');
const config = require('config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const environment = config.util.getEnv() || 'development';

module.exports = {
  entry: path.join(__dirname, 'client', 'app.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(environment),
        FACEBOOK_CLIENT_ID: JSON.stringify(config.get('passport.facebook.clientID'))
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html')
    })
  ],
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   query: {
      //     configFile: './.eslintrc.js',
      //   },
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer(), cssnano()],
              sourceMap: true
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  }
};
