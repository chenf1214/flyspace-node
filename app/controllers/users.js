const jsonwebtoken = require('koa-jwt')
const User = require('../models/users')
const { secret } = require('../config')
class UsersCtl {
    async checkOwner(ctx, next){
        // 403 授权错误 ForbiddenError
        if(ctx.params.id !== ctx.state.user._id){ ctx.throw(403, '没有权限')}
        await next()
    }
    async find(ctx){
        ctx.body = await User.find()
    }
    findById(ctx){}
    async create(ctx){
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true}
        })
        const { name } = ctx.request.body
        const repeatedName = await User.findOne({name})
        if( repeatedName ) { ctx.throw(409, "用已存在")}
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    async update(ctx){
        ctx.verifyParams({
            name: { type: 'string', required: false},
            password: { type: 'string', required: false}
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body,{new: true})
        if(!user) { ctx.throw (404, "用户不存在"); }
        ctx.body = user
    }
    async delUser(ctx){
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user) { ctx.throw (404, "用户不存在"); }
        ctx.status = 204
    }
    async login(ctx){
        ctx.verifyParams({
            name: { type: 'string', required: true},
            password: { type: 'string', require: true}
        })
        const user = await User.findOne(ctx.request.body)
        if(!user) { ctx.throw(401, "用户名或者密码不正确");}
        const { _id, name } = user
        const token = jsonwebtoken.sign({ _id, name}, secret, {expiresIn:'1d'})
        ctx.body = { token }
    }
}

module.exports = new UsersCtl()