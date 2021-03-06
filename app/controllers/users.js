const jsonwebtoken = require('jsonwebtoken')
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
    async findById(ctx){
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(v => ' +' + v).join('')
        const user = await User.findById(ctx.params.id).select(selectFields)
        if(!user) { ctx.throw(404, '用户不存在');}
        ctx.body = user
    }
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
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false },
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
    async listFollowing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if(!user) { ctx.throw(404); }
        ctx.body = user.following;
    }
    // 关注
    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        // 204 成功了 但是 并没有内容返回
        ctx.body = me  
    }
    // 取消关注
    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1){
            me.following.splice(index, 1)
            me.save()
        }      
        // 204 成功了 但是 并没有内容返回
        ctx.body = me  
    }
}

module.exports = new UsersCtl()