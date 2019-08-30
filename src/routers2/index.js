const Router = require('koa-router')
const article = require('./article')
const tags = require('./tag')
const router = new Router()

// article(router)
tags(router)

module.exports = router
