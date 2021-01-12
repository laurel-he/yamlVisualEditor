const path = require('path');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');
const TerserPlugin = require('terser-webpack-plugin');


const production = (process.env.NODE_ENV === 'production');
// FIXME: change next line if you don't want publish to gh-pages
const publicPath = production ? './' : 'http://localhost:8080/';
module.exports = {
  entry: {
    jiapin: ['./src/index.tsx'],
  },
  output: {
    globalObject: 'self',
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath,
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[name].[chunkhash].js',
  },

  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      src: path.resolve('./src'),
      // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.min.js 文件，
      // 减少耗时的递归解析操作
      'react-router': path.resolve(__dirname, './node_modules/react-router/umd/', (production ? 'ReactRouter.min.js' : 'ReactRouter.js')),
      'react-redux': path.resolve(__dirname, './node_modules/react-redux/dist/', (production ? 'react-redux.min.js' : 'react-redux.js')),
      'react-router-redux': path.resolve(__dirname, './node_modules/react-router-redux/dist/', (production ? 'ReactRouterRedux.min.js' : 'ReactRouterRedux.js')),
      bizcharts: path.resolve(__dirname, './node_modules/bizcharts/umd/BizCharts.min.js')
    },
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
  },

  optimization: {
    runtimeChunk: 'single', // enable 'runtime' chunk
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /(react|react-dom|react-router|react-router-redux|react-redux|redux-nprogress|redux-thunk|redux-logger|antd|ant-design-pro|immutable|history|bluebird|src\/utils\/)/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    },
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          mangle: false, // https://github.com/mishoo/UglifyJS2#minify-options
          compress: { // https://github.com/mishoo/UglifyJS2#compress-options
            // drop_console: 'console.log'
          }
        }
      })
    ]
  },
  plugins,

  // https://webpack.js.org/configuration/dev-server/#devserverprogress---cli-only
  devServer: {
    historyApiFallback: { index: '/' },
    disableHostCheck: true,
    host: 'hexiaojiao.top',
    stats: 'normal',
    compress: true,
    progress: true
  },

  module: {
    rules: loaders
  },

  cache: true

};

