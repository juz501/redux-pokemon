const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = [{
  entry: path.join(__dirname, 'src', 'client', 'client.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style!css',
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['', '.js', '.jsx'],
        },
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(), // dedupe similar code
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
    }), // minify everything
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
  ],
},
{
  entry: path.join(__dirname, 'src', 'server', 'server.js'),
  output: {
    path: __dirname,
    filename: 'index.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
}];
