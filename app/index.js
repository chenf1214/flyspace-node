const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
// 实例化
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('MongoDB 链接成功了'))
mongoose.connection.on('error', console.error)




// use
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest}
}))
app.use(bodyparser())
app.use(parameter(app))
routing(app)



app.listen(3000, ()=> console.log('success, 程序已在3000端口启动'))