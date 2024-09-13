const path = require('node:path');
const sveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');

exports.devServer = () => ({
  devtool: 'eval-source-map',
  devServer: {
    port: 8080,
    allowedHosts: 'all',
    host: '0.0.0.0',
    hot: true,
    static: ['public'],
  },
});

const babelUseEntry = {
  loader: 'babel-loader',
};

exports.svelte = (mode) => {
  const prod = mode === 'production';

  return {
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte'), // Svelte 3
      },
      extensions: ['.mjs', '.js', '.ts', '.svelte'],
      mainFields: ['svelte', 'browser', '...'],
      conditionNames: ['svelte', 'browser', '...'],
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: [
            babelUseEntry,
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
          // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        }, // Ref. https://github.com/sveltejs/svelte-loader/blob/d42a6053207ffbe3f8889775d50fd4796378013f/README.md#usage
      ],
    },
  };
};

exports.typescriptOrJavascript = () => ({
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts)$/,
        exclude: /node_modules/,
        use: [babelUseEntry],
      },
    ],
  },
});

exports.css = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
});

exports.typeCheck = () => ({
  plugins: [new ForkTsCheckerWebpackPlugin()],
});

exports.analysis = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      generateStatsFile: false,
    }),
  ],
});

exports.webpackBar = () => ({
  plugins: [new WebpackBar()],
});
