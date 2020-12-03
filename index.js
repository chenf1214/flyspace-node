const Koa = require('koa')
const app = new Koa()

app.use((ctx) => {
    ctx.body = 'Hello wosssrd'
})

app.listen(3000)