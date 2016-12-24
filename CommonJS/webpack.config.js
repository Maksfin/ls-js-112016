var webpack = require('webpack');

module.exports = {
  entry: './app/entry.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        // query: {
        //   presets: ['es2015']
        // }
      }
    ]
  }
};