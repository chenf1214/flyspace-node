const User = require('../models/users')
class UsersCtl {
    async find(ctx){
        ctx.body = await User.find()
    }
    findById(ctx){}
    async create(ctx){
        console.log(2)
        ctx.verifyParams({
            name: { type: 'string', required: true }
        })
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
        console.log(1)
    }
    update(ctx){}
    delete(ctx){}
}

module.exports = new UsersCtl()