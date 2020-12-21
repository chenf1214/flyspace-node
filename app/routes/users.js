const Router = require('koa-router')
const {
    create,
    find,
    findById,
    update,
    delUser,
    login,
    checkOwner
} = require('../controllers/users')
const router = new Router({
    prefix: '/users'
})
                                                                                                                                                                   
const { secret } = require('../config')
const jwt = require('koa-jwt')

const auth = jwt({ secret })

//const auth = async (ctx, next) => {
// 短路语法   
//     const { authorization = '' } = ctx.request.header
//     const token = authorization.replace('Bearer ', "")
//     try{
//         const user = jsonwebtoken.verify(token, secret)
//         ctx.state.user = user
//     }catch(err){
//         ctx.throw(401, err.message)
//     }
//     await next()
// }

router.post('/', create)
router.get('/', find)
router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, delUser)

router.post('/login', login)



module.exports = router