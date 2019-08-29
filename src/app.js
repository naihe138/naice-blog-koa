'use strict'


const Koa = require('koa')
const config = require('./config')
const mongoConnect = require('./mongodb')
const { resolve } = require('path')
// const redis = require('./redis');
const middlewares = require('./middlewares')
// const Route = require('./decorator/router')

const app = new Koa()
// 链接数据库
mongoConnect()
// redis.connect();

// 使用各种中间件
middlewares(app)

// const router = new Route(app, resolve(__dirname, './routers'))
// // 初始化路由
// router.init()

// start server
app.listen(config.APP.PORT, () => {
	console.log(`node-Koa Run！port at ${config.APP.PORT}`)
})