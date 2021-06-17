const {
    resolve
} = require('path') // 方法会把一个路径或路径片段的序列解析为一个绝对路径。
const r = url => resolve(__dirname, url)
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin') //将单个文件或整个目录复制到构建目录
const ProgressBarPlugin = require('progress-bar-webpack-plugin') //打包时候在命令行里的进度条
const ExtractTextPlugin = require('mini-css-extract-plugin') //打包的时候分离出文本，比如css，打包到单独的文件夹里

const extractSass = new ExtractTextPlugin({
    filename: '[name].wxss'
})

const config = require('./config')

module.exports = {
    devtool: false,
    mode: 'production',
    output: {
        path: config.assetsPath,
        filename: '[name].js'
    },
    resolve: {
        alias: {
            utils: r('../utils/utils')
        }
    },
    resolveLoader: {
        // 去哪些项目下寻找Loader，有先后顺序之分，这里是为了本地调试laoder方便
        modules: ['node_modules', './loaders/'],
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        'latest'
                    ]
                }
            },
            {
                test: /\.vue$/,
                loader: 'program-loader', //这个就是我们变成的小程序laoder
                options: {
                    dist: './program',
                    type: 'wx',
                }
            }
        ]
    },
    plugins: [
        extractSass,
        new CopyWebpackPlugin([{
            from: {
                glob: 'pages/**/*.json',
                to: ''
            }
        }, {
            from: 'static',
            to: 'static'
        }]),
        new webpack.optimize.ModuleConcatenationPlugin(), //解释是启用作用域提升，webpack3新特性,作用是让代码文件更小、运行的更快
        new ProgressBarPlugin()
    ]
}