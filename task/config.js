const { resolve } = require('path')
const r = url => resolve(__dirname, url)
const assetsPath = resolve(process.cwd(), './program') 

module.exports={
    "json":{ //通过这个配置小程序的页面
        "pages":[
          "pages/home/home",
        ],
        "window":{
        }
    },
    "style":{
        url:r('./style/common.less'),
        lang:'less'
    },
    "assetsPath": assetsPath,
}

