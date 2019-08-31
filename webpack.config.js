const path = require('path')
const webpack = require('webpack')
const externalsDep = require('externals-dependencies')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'start.js'
  },
  resolve: {
    extensions: ['.js']
  },
  target: 'node',
  externals: [externalsDep()],
  context: __dirname,
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: false,
        parallel: true,
        sourceMap: false
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
