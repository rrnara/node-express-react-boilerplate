const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-bare-webpack-plugin');

const config = require('./webpack.config.base');

config.mode = 'development';

config.plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'index.html')
  }),
  new MiniCssExtractPlugin({
    filename: 'app.css'
  }),
  new StyleLintPlugin({
    syntax: 'scss',
    failOnError: false
  }),
  new webpack.HotModuleReplacementPlugin()
];

config.devServer = {
  hot: true,
  historyApiFallback: true
};

config.optimization = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'app.vendor',
        filename: 'app.vendor.js',
        chunks: 'all'
      }
    }
  }
};

module.exports = config;
