'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const HOST = process.env.HOST
const PORT = (process.env.PORT && Number(process.env.PORT)) || '8080'

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      name:'vendor'
    },
  },
  module: {
    //合并styleloader
    rules: utils.styleLoaders({ sourceMap: true, usePostCSS: false, extract: false, })
  },
  // 源错误检查
  devtool: 'eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    historyApiFallback: true, 
    contentBase: path.resolve(__dirname, '../src'),
    compress: true,
    // 热加载
    hot: true, 
    //自动刷新
    inline: true, 
    //自动打开浏览器
    open: false, 
    host: HOST||'localhost',
    port: PORT,
    // 在浏览器上全屏显示编译的errors或warnings。
    overlay: { warnings: false, errors: true }, 
    publicPath: '/',
    // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
    proxy: {},
    quiet: true, 
    // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。默认为false
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      ...process.env
    }),
    //开启HMR(热替换功能,替换更新部分,不重载页面！)
    new webpack.HotModuleReplacementPlugin(),
    //显示模块相对路径
    // new webpack.NamedModulesPlugin(),
    //不显示错误信息
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    //配置html入口信息
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      chunksSortMode: 'none',
      inject: true
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: 'static',
      ignore: ['.*']
    }]),
  ]
})
module.exports = new Promise((resolve, reject) => {
  	// 获取当前设定的端口
  portfinder.basePort = PORT
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 发布新的端口，对于e2e测试
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
      // 友好的报错插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: utils.createNotifierCallback(),
      }))
      resolve(devWebpackConfig)
    }
  })
})

