const Router = require('koa-router')
const {
    create,
    find,
    update,
    delUser,
    login,
    checkOwner
} = require('../controllers/users')
const router = new Router({
    prefix: '/users'
})

const { secret } = require('../config')
const jsonwebtoken = require('jsonwebtoken')

const auth = async (ctx, next) => {
    // 短路语法
    
    const { authorization = '' } = ctx.request.header
    const token = authorization.replace('Bearer ', "")
    try{
        const user = jsonwebtoken.verify(token, secret)
        ctx.state.user = user
    }catch(err){
        ctx.throw(401, err.message)
    }
    await next()

}

router.post('/', create)
router.get('/', find)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, delUser)

router.post('/login', login)



module.exports = router