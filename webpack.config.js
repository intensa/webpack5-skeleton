// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs-extra')

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;

const pages = fs
    .readdirSync(path.resolve(__dirname, 'src/pages'))
    .filter(fileName => (fileName.endsWith('.html') || fileName.endsWith('.pug')));


const config = {
  entry: {
    app: [
      path.resolve(__dirname, 'src/styles/app.scss'),
      path.resolve(__dirname, 'src/scripts/app.js'),
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    ...pages.map(page => new HtmlWebpackPlugin({
      template: `${path.resolve(__dirname, 'src/pages')}/${page}`,
      filename: `${page.split('.')[0]}.html`,
    })),

    new MiniCssExtractPlugin(),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images')
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /fonts/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },],
      }
    ],
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());

  } else {
    config.mode = 'development';
  }
  return config;
};
