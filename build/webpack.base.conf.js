'use strict'
const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    index: ['babel-polyfill','./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.[hash:8].js',
    publicPath: '/',
    libraryTarget: 'umd',
  },
  
  resolve: {
    // 自动解析文件扩展名(补全文件后缀)(从左->右)
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    },
    plugins: [
      // 正确解析程序所需的依赖的插件
      PnpWebpackPlugin,
    ],
  },
  resolveLoader: {
    plugins: [
      // 也与插件‘n’Play有关，但这一次它告诉Webpack从当前的包中加载其加载程序
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{
          loader: 'babel-loader',
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 不写fallback，file size 大于limit时，会自动调用file-loader，但是使用的是默认的[hash].[ext]无法指定路径名和文件名
          // 显示声明 fallback之后，就可以将name传至file-loader。
          // 因为使用了CopyWebpackPlugin，防止诸如[name][hash].[ext]和[name].[ext]文件同时存在
          // 特将文件名指定为[name].[ext]
          fallback: 'file-loader',
          name: 'assets/img/[name].[ext]',
          limit: 10000,
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          fallback: 'file-loader',
          limit: 10000,
          name: 'assets/media/[name].[ext]',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          fallback: 'file-loader',
          limit: 10000,
          name: 'assets/fonts/[name].[ext]',
        }
      }  
    ]
  },
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,
}
