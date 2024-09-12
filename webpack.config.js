const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const { EsbuildPlugin } = require('esbuild-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');
const browserslist = require('browserslist');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    'build/bundle': ['./src/main.ts'],
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'), // Svelte 3
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser'],
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: /node_modules/,
        use: [{ loader: 'esbuild-loader', options: { target: resolveToEsbuildTarget(browserslist()) } }],
      },
      {
        test: /\.svelte$/,
        use: [
          { loader: 'esbuild-loader', options: { loader: 'js', target: resolveToEsbuildTarget(browserslist()) } },
          {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev: !prod,
              },
              emitCss: prod,
              hotReload: !prod,
              preprocess: sveltePreprocess({ sourceMap: !prod }),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: resolveToEsbuildTarget(browserslist()),
        css: true, // Apply minification to CSS assets
      }),
    ],
  },
};
