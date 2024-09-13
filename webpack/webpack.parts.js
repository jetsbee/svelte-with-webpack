const path = require('node:path');
const sveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

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

// TODO: - Improve preprocess, postprocess, browser compatibility
const cssUseEntry = {
  loader: 'css-loader',
  options: {
    url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
    // Ref. https://github.com/sveltejs/svelte-loader?tab=readme-ov-file#extracting-css
  },
};

exports.css = (mode) => {
  const prod = mode === 'production';

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, cssUseEntry],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            cssUseEntry,
            {
              loader: 'sass-loader',
              /**
               * MARK: - Sass modern javascript api is currently not working with sourcemap, webpack-dev-server.
               * Bugfix: Use legacy api by setting "options.api as legacy"
               * Error:
               * "Could not load content for webpack://...scss
               * (Fetch through target failed: Unsupported URL scheme; Fallback: HTTP error: status code 404, net::ERR_UNKNOWN_URL_SCHEME)"
               * is shown on Chrome DevTools (Sources tab)
               */
              options: {
                api: 'legacy',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: prod ? '[name].[contenthash].css' : '[name].css',
      }),
      !prod &&
        new webpack.SourceMapDevToolPlugin({
          test: /\.css$/i,
          filename: null,
          append: '/*# sourceMappingURL=[url] */',
        }),
      // Ref. https://github.com/webpack-contrib/mini-css-extract-plugin/issues/529#issuecomment-1020847358
    ].filter(Boolean),
  };
};

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
