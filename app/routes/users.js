const Router = require('koa-router')
const { create,find } = require('../controllers/users')
const router = new Router({prefix: '/users'})

router.post('/', create)
router.get('/', find)



module.exports = router