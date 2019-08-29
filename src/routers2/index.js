const Router = require('koa-router')
const article = require('./article')
const router = new Router()

article(router)
console.log(router)
module.exports = router