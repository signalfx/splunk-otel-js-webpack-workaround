const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development',
  devtool: 'source-map',
  entry: './index.ts',
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
  externals: [
    nodeExternals({
      allowlist: [
        function(module) {
          const externalModules = [
            "express",
            "ioredis",
            "mysql",
            "aws-sdk",
            "elasticsearch",
            "sequelize",
            "mongodb"
            // Add any other necessary packages
          ];

          return !externalModules.includes(module);
        }
      ]
    })
  ],
  /** WORKAROUND CONFIG BEGIN **/
};
