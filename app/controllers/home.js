class HomeCtl {
    index(ctx) {
        ctx.body = 'hello lala'
    }
}

module.exports = new HomeCtl()