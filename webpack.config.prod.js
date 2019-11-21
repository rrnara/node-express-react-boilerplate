const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-bare-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const config = require('./webpack.config.base');

config.mode = 'production';

config.output.filename = 'app.[chunkhash:8].js';

const appendPlugins = [
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
config.plugins.push(...appendPlugins);

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
