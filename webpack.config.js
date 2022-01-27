const path = require('path');

module.exports = {
	mode: 'development',
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
	target: "node",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js'
  },
  /** WORKAROUND CONFIG BEGIN **/
  externalsType: 'node-commonjs',
  externals: [
    "express",
    "ioredis",
    "mysql",
    "aws-sdk",
    "elasticsearch",
    "sequelize",
    "mongodb"
  ]
  /** WORKAROUND CONFIG END **/
};
