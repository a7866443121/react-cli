'use strict'
const path = require('path')
const autoprefixer = require('autoprefixer');
const packageConfig = require('../package.json')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


exports.cssLoaders = function (options) {
  options = options || {}
  // options是用来传递参数给loader的
  // minimize表示压缩，如果是生产环境就压缩css代码
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap,
      importLoaders: 2,
      minimize: options.extract ? true : false,
    }
  }
  //postcss-loader
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      plugins: () => [autoprefixer({
        browsers: 'last 5 versions'
      })],
    }
  }


  function generateLoaders (loader, loaderOptions) {
    // 将上面的基础cssLoader配置放在一个数组里面
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    // 如果该函数传递了单独的loader就加到这个loaders数组里面，这个loader可能是less,sass之类的
    if (loader) {
      loaders.push({
        // 加载对应的loader
        loader: loader + '-loader',
        // Object.assign是es6的方法，主要用来合并对象的，浅拷贝
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    // 注意这个extract是自定义的属性，
    //可以定义在options里面，主要作用就是当配置为true就把文件单独提取，false表示不单独提取，
    if (options.extract) {
      return [ MiniCssExtractPlugin.loader ].concat(loaders)
    } else {
      return ['style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {
        modifyVars: {
            "@primary-color": "#075DA5",
            "@font-size-base": "12px",
            '@menu-dark-bg':'#283142'
        },
        javascriptEnabled: true,
    }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// 下面这个主要处理import这种方式导入的文件类型的打包，上面的exports.cssLoaders是为这一步服务的
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  // 下面就是生成的各种css文件的loader对象
  for (const extension in loaders) {
    // 把每一种文件的laoder都提取出来
    const loader = loaders[extension]
    // 把最终的结果都push到output数组中，大事搞定
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      // exclude: /node_modules/,
      use: loader
    });
    // 处理node_modules中的样式问题
    // if (options.extract === ) {
    //   output.push({
    //     test: new RegExp('\\.' + extension + '$'),
    //     include: /node_modules/,
    //     use: loader
    //   })
    // }
  }
  // console.log(output)
  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
