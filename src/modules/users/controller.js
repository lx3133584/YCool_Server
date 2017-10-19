import User from '../../models/users'
import passport from 'koa-passport'


/**
  @api {POST} /users/tourists 新增游客
  @apiDescription
  @apiVersion 1.0.0
  @apiName 新增游客
  @apiGroup Users
  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/users/tourists

  @apiParam {Object} user          用户对象 (必需)
  @apiParam {String} user.uuid     ios唯一标识.

  @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4Yzk0OTk3ZDE4ZTIwMjRiNjYzNjBmYiIsImlhdCI6MTQ4OTYzNjI5M30.OHd22AfwQaUZAuNC2A4w28THizwtf4UgRvWhc3lBuSI"
      }
  @apiErrorExample {json} Error-Response:
      HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
       }
 */
export async function createTourist (ctx) {
  const uuid = ctx.request.body.user.uuid
  //先查
  try {
    var user = await User.findOne({uuid: uuid})
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  if (user) {
    var token = user.generateToken()
  }
  else {
    user = new User(ctx.request.body.user)
    try {
      await user.save()
    } catch (err) {
      Handle.sendEmail(err.message)
      ctx.throw(422, err.message)
    }

    var token = user.generateToken()
  }

  ctx.body = {
    token
  }
}

// 注册
export async function createUser (ctx) {
  const {account, password, password2} = ctx.request.body
  if (password !== password2) {
    ctx.throw(422, '两次密码输入不一致')
  }
  if (password.length <= 8) {
    ctx.throw(403, '密码必须大于等于8位')
  }
  //先查
  try {
    var user = await User.findOne({account})
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  if (user) {
    ctx.throw(422, '账号已经注册')
  }
  else {
    user = new User(ctx.request.body)
    try {
      await user.save()
    } catch (err) {
      Handle.sendEmail(err.message)
      ctx.throw(422, err.message)
    }

    var token = user.generateToken()

    const response = user.toJSON()

    delete response.password
    delete response.password2

    ctx.body = {
      token,
      user: response
    }
  }

}

// 登录
export async function loginUser (ctx, next) {
  let {account, password} = ctx.request.body
  account = account.replace(/\s/g, "");
  try {
    var user = await User.findOne({account})
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  if (!user) {
    ctx.throw(403, '账号不存在')
  }
  try {
    var isMatch = await user.validatePassword(password)
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }
  if (!isMatch) {
    ctx.throw(403, '密码错误')
  }
  const token = user.generateToken()

  const response = user.toJSON()

  delete response.password
  delete response.password2

  ctx.body = {
    token,
    user: response
  }
}

// 修改密码
export async function modifyPassword (ctx, next) {
  let user = ctx.state.user
  const {oldPassword, newPassword, newPassword2} = ctx.request.body
  user.account = user.account.replace(/\s/g, "");
  try {
    user = await User.findOne({account: user.account})
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  try {
    var isMatch = await user.validatePassword(oldPassword)
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  if (!isMatch) {
    ctx.throw(403, '旧密码错误')
  }
  if (newPassword !== newPassword2) {
    ctx.throw(403, '两次输入密码不一致')
  }
  if (oldPassword === newPassword) {
    ctx.throw(403, '新密码与旧密码相同')
  }
  if (newPassword.length <= 8) {
    ctx.throw(403, '密码必须大于等于8位')
  }

  user.password = newPassword;
  user.password2 = newPassword2;

  try {
    await user.save()
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  ctx.body = {
    success: true
  }
}

// 编辑昵称
export async function editName (ctx, next) {
  let user = ctx.state.user
  const {name} = ctx.request.body
  if (!name) ctx.throw(422, '昵称不能为空')

  user.name = name

  try {
    await user.save()
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  ctx.body = {
    success: true
  }
}

// 获取用户信息
export async function getInfo (ctx) {
  const user = ctx.state.user
  ctx.body = {
    data: user
  }
}
