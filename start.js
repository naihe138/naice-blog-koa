'use strict'
var Koa = require('koa')
// var Router = require('koa-router')
const middlewares = require('./src/middlewares')
const router2 = require('./src/routers2')
var app = new Koa()
// var router = new Router()
middlewares(app)
// router.get('/', (ctx, next) => {
//   ctx.body = 'Hello World'
// })

// router.post('/test', (ctx, next) => {
//   console.log(ctx.request.body)
//   ctx.body = 'Hello World11111'
// })
app.use(router2.routes())
app.use(router2.allowedMethods())

app.listen(3000)
