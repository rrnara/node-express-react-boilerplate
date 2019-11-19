const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-bare-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const config = require('./webpack.config.base');

config.mode = 'production';

config.output.filename = 'app.[chunkhash:8].js';

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'index.html')
  }),
  new MiniCssExtractPlugin({
    filename: 'app.[chunkhash:8].css'
  }),
  new StyleLintPlugin({
    syntax: 'scss',
    failOnError: true
  }),
  new ManifestPlugin({
    fileName: 'manifest.json'
  })
];

config.optimization = {
  minimize: true,
  minimizer: [new TerserPlugin()],
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'app.vendor',
        filename: 'app.vendor.[chunkhash:8].js',
        chunks: 'all'
      }
    }
  }
};

module.exports = config;
