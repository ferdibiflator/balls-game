var path = require('path')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint-loader'],
        include: [
          path.resolve(__dirname, 'src')
        ]
      }
    ],
    loaders: [
      {
        loaders: ['babel-loader'],
        include: [
          path.resolve(__dirname, 'src')
        ],
        test: /\.js$/,
        plugins: ['transform-runtime']
      }
    ]
  }
}
