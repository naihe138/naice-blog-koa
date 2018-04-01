'use strict'

import Koa from 'koa'
import http from 'http'
import config from './config'
import mongoConnect from './mongodb'
import { resolve } from 'path'
// const redis = require('./redis');
import middlewares from './middlewares'
import Route from './decorator/router'

const app = new Koa()
// 链接数据库
mongoConnect()
// redis.connect();

// 使用各种中间件
middlewares(app)

const router = new Route(app, resolve(__dirname, './routers'))
// 初始化路由
router.init()

// start server
app.listen(config.APP.PORT, () => {
	console.log(`node-Koa Run！port at ${config.APP.PORT}`)
})
