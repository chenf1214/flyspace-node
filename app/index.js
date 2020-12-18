const Koa = require('koa')
const koaBody = require('koa-body')
// 放置图片的静态文件服务
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const path = require('path')
const parameter = require('koa-parameter')
// 1. 引入 mongoose
const mongoose = require('mongoose')
// 实例化
const app = new Koa()
const routing = require('./routes')
const { patch } = require('./routes/users')
//const { connectionStr } = require('./config')
//mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('MongoDB 链接成功了'))
//mongoose.connection.on('error', console.error) 1223

// 2 开始正式的链接
mongoose.connect("mongodb://127.1.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once("open", function () {
    console.log("数据库连接成功了")
})





// use
app.use(koaStatic(path.join(__dirname, 'public')))

app.use(error({
    postFormat: (e, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {
        stack,
        ...rest
    }
}))
app.use(koaBody({
    multipart: true,
    formidable: {
        // 保存路径
        uploadDir: path.join(__dirname, '/public/uploads'),
        // 保留jpg png 等图片文件扩展名
        keepExtensions: true
    }
}))
app.use(parameter(app))
routing(app)



app.listen(3000, () => console.log('success, 程序已在3000端口启动'))