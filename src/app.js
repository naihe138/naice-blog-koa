'use strict'

const Koa = require('koa')
const config = require('./config')
const mongoConnect = require('./mongodb')
// const redis = require('./redis');
const middlewares = require('./middlewares')
const router = require('./routers2')

const app = new Koa()
// 链接数据库
mongoConnect()
// redis.connect();

// 使用各种中间件
middlewares(app)
app.use(router.routes())
app.use(router.allowedMethods())

// start server
app.listen(config.APP.PORT, () => {
	console.log(`node-Koa Run！port at ${config.APP.PORT}`)
})