var fs = require('fs-extra')
const path = require('path')

const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development'
const isEnvDevelopment = mode == 'development' ? true :false
const isEnvProduction = !isEnvDevelopment
console.log(mode)

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      // options: { publicPath: '../../' }
      // options: paths.publicUrlOrPath.startsWith('.')
      //   ? { publicPath: '../../' }
      //   : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        // sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          // sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

fs.emptyDirSync(path.resolve(__dirname,'../build'))

const config = {
  mode,
  entry: {
    index: path.resolve(__dirname,'../src/index.js')
  },
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname,'../build/static/'),
    publicPath:'/static/',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              "presets": [["react-app", { "flow": true, "typescript": false }]]
            }
          },
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                // sourceMap: isEnvProduction && shouldUseSourceMap,
              },
              'sass-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: /\.(less)$/,
            exclude: /\.module\.(less)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                // sourceMap: isEnvProduction && shouldUseSourceMap,
              },
              'less-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: /\.(css)$/,
            exclude: /\.module\.(css)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                // sourceMap: isEnvProduction && shouldUseSourceMap,
              },
              // 'sass-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 1,
              name: 'media/[name].[hash:8].[ext]',
            },
          },
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'media/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin({
      // fileName: 'asset-manifest.json',
      fileName: path.resolve(__dirname,'../build/asset-manifest.json'),
    })
    ,
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    })
  ]
}

if(mode == 'development'){
  config.devtool= 'cheap-module-source-map'
  config.watch = true
}else{
  // config.optimization={
  //   minimize: true,
  //   minimizer:[
  //     // This is only used in production mode
  //     new OptimizeCSSAssetsPlugin(),
  //   ]
  // }
}

module.exports = config