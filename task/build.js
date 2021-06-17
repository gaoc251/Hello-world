const shell = require('shelljs/global')
const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const _ = require('lodash')
const r = url => resolve(process.cwd(), url)
const config = require('./config') // 我们抽出的小程序主要的文件
const webpackConf = require('./webpack.conf') // webpack配置

const assetsPath = config.assetsPath

rm('-rf', assetsPath)
mkdir(assetsPath)

const renderConf = webpackConf
const entry = () => _.reduce(config.json.pages, (en, i) => {
    en[i] = resolve(__dirname, '../src/components/', 'HelloWorld.vue') // 需要转化成小程序的文件地址
    return en
}, {}) // 输出一个对象

renderConf.output = {
    // 输出文件的配置
    path: config.assetsPath,
    filename: '[name].js'
}

renderConf.entry = entry()

// 如果你不传入回调函数到 webpack 执行函数中，就会得到一个 webpack Compiler 实例。你可以通过它手动触发 webpack 执行器，或者是让它执行构建并监听变更。和 CLI API 很类似。Compiler 实例提供了以下方法

const compiler = webpack(renderConf) // 导入的webpack函数需要传入一个webpack配置对象，当同时传入回调函数时就会执行 webpack 

fs.writeFileSync(resolve(config.assetsPath, './app.json'), JSON.stringify(config.json), 'utf8') // 一步写入文件小程序的app.json

// const callback = (err, stats) => {
//     console.log("Compiler 已经完成执行。")
//     if (err) process.stdout.write(err) // 如果有报错，就在控制台打印出报错信息
// }

// compiler.run(callback)

compiler.watch({
    aggregateTimeout: 300,  //一旦第一个文件改变，在重建之前添加一个延迟
    ignored: /node_modules/,  //观察许多文件系统会导致大量的CPU或内存使用量。可以排除一个巨大的文件夹
    poll: false  //每隔（你设定的毫秒）多少时间查一下有没有文件改动过，不想启用也可以填false
}, (err, stats) => {
    //if (err) throw err  //打包的时候有错误我们就抛出错误
    /**
     * 对打包结果进行一些配置化
     * 在webpack()回调里拿到一个stats打包状态，process.stdout.write跟console.log一个意思
     * 因为在node环境里console.log也是用process封装的就是向cli里打印输出，但是输出的时候进行了一些格式化
     */
    process.stdout.write(stats.toString({
        colors: true,  //让打包的时候有颜色
        modules: false,  //去掉内置模块信息
        children: false,  //去掉子模块
        chunks: false,  //增加包信息（设置为false能允许较少的冗长输出）
        chunkModules: false  //去除包里内置模块的信息
    }) + '\n\n')
})