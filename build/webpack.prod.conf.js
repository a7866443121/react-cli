'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = process.env.NODE_ENV=== 'analysis' ? require('webpack-bundle-analyzer').BundleAnalyzerPlugin:null
const CopyWebpackPlugin = require('copy-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? {NODE_ENV: '"testing"'}
  : {NODE_ENV: '"production"'}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    //并入style-loader
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true
    })
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: ('js/[name].[hash:8].js'),
    chunkFilename: ('js/[name]-[id].[hash:8].js')
  },
  //4.0配置  重点
  optimization: {
    //它的作用是将包含chunks 映射关系的 list单独从 app.js里提取出来，
    //因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，
    //所以你每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。缓存就失效了。
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: 'all'
    }
    // splitChunks: {
    //   //默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为gaichunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
    //   chunks: "async”,
    //   //默认值是30kb
    //   minSize: 30000,
    //   //被多少模块共享  
    //   minChunks: 1,
    //   //所有异步请求不得超过5个  
    //   maxAsyncRequests: 5,
    //   //初始话并行请求不得超过3个  
    //   maxInitialRequests: 3,
    //   //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~  
    //   name: true,
    //   //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例  
    //   cacheGroups: { 
    //     common: {
    //       //抽取的chunk的名字
    //       name: 'common',
    //       //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取  
    //       chunks(chunk) { 
    //       },
    //       //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。自己尝试过程中发现不能提取出css，待进一步验证。
    //       test(module, chunks) {  
    //       },
    //     //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
    //     priority: 10,  
    //     //最少被几个chunk引用
    //     minChunks: 2,  
    //     //	如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
    //     reuseExistingChunk: true，
    //     // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
    //     enforce: true  
    //     }
    //   }
    // }
  },
  plugins: [
    //清除目录
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist/*'), {
      root: path.resolve(__dirname, '../'),
      verbose: true,
      dry: false
    }),
    //允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    new webpack.DefinePlugin({
      'process.env': env
    }),
    //压缩css
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name]-[id].[hash:8].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      title: 'React Demo',
      inject: true, // true->'head' || false->'body'
      minify: {
        //删除Html注释
        removeComments: true,
        //去除空格
        collapseWhitespace: true,
        //去除属性引号
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
    new webpack.HashedModuleIdsPlugin(),
    // 这个插件会在 webpack 中实现以上的预编译功能 提升你的代码在浏览器中的执行速度。
    new webpack.optimize.ModuleConcatenationPlugin(),
    //把静态资源copy
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: '/static',
      ignore: ['.*']
    }]),
    process.env.NODE_ENV=== 'analysis' ? new BundleAnalyzerPlugin() : ()=>{}
  ]
})

// 需要服务端做相关的gzip配置
/*
gzip on;
gzip_disable "msie6";
gzip_buffers 32 4k;
gzip_static on;
 */
// 页面请求后的Response Headers中的Content-Encoding的值为“gzip”，Request Headers中Accept-Encoding的值存在“gzip”值
if (true) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
}


module.exports = webpackConfig
