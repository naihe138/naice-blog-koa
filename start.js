'use strict'
var Koa = require('koa')
var Router = require('koa-router')
// const middlewares = require('./src/middlewares')
var bodyParser = require('koa-bodyparser');
var app = new Koa()
var router = new Router()
// middlewares(app)
app.use(bodyParser())
router.get('/', (ctx, next) => {
  ctx.body = 'Hello World'
})

router.post('/test', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'Hello World11111'
})
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
