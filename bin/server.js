import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import mount from 'koa-mount'
import cors from 'koa-cors'
import serve from 'koa-static'

import config from '../config'
import handle from '../src/utils/handle'
import { errorMiddleware } from '../src/middleware'

global.Handle =  handle

const app = new Koa()
app.keys = [config.session]

mongoose.Promise = global.Promise
mongoose.connect(config.database)

app.use(convert(logger()))
app.use(bodyParser())
app.use(convert(session()))
app.use(errorMiddleware())
app.use(cors({origin: config.origin}))

app.use(convert(mount('/docs', serve(`${process.cwd()}/docs`))))

require('../config/passport')
app.use(passport.initialize())
app.use(passport.session())

const modules = require('../src/modules')
modules(app)

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`)
})

//更新小说爬虫
const UpdateNovel = require('../src/utils/updateNovel')
if (app.env !== 'development') {
  UpdateNovel.start()
}

export default app
