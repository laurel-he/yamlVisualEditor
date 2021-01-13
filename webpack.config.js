const HtmlWebPackPlugin = require('html-webpack-plugin');

const production = (process.env.NODE_ENV === 'production');
module.exports = {
  entry: './src/index.tsx',
  resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.tsx']
  },
  module: {
      rules: [
          {
              test: /\.tsx?$/, // jsx/js文件的正则
              exclude: /node_modules/, // 排除 node_modules 文件夹
              use: {
                  // loader 是 babel
                  loader: 'babel-loader',
                  options: {
                      // babel 转义的配置选项
                      babelrc: false,
                      presets: [
                          // 添加 preset-react
                          require.resolve('@babel/preset-react'),
                          [require.resolve('@babel/preset-env'), {modules: false}]
                      ],
                      cacheDirectory: true
                  }
              }
          }
      ]
  },
  plugins: [
    new HtmlWebPackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: true
    })
  ],
  devServer: {
    historyApiFallback: { index: '/' },
    disableHostCheck: true,
    stats: 'normal',
    compress: true,
    progress: true
  },
};