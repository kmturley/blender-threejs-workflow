const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const OUTPUT_FOLDER = 'dist';

module.exports = {
  entry: {
    globe: './src/globe.js',
    parallax: './src/parallax.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, OUTPUT_FOLDER),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { context: './src', from: '*.html', to: './' },
      { context: './src', from: './models', to: './models' },
      { context: './src', from: './textures', to: './textures' },
    ]),
  ],
  devServer: {
    contentBase: './' + OUTPUT_FOLDER,
    hot: true,
    host: '0.0.0.0',
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};
