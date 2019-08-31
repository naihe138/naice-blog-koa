'use strict'
// 中间件集合
const bodyParser =require('koa-bodyparser') // post body 解析
const helmet =require('koa-helmet') // 安全相关
const cors =require('koa-cors')
const Interceptor =require('./interceptor')

const middlewares = (app) => {
	app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start
		console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
	})

	// middleware
	app.use(cors({
		origin: true
	}))
	app.use(Interceptor)
	app.use(helmet())
	app.use(bodyParser({
		jsoinLimit: '10mb',
		formLimit: '10mb',
		textLimit: '10mb'
	}))

	// 404 500
	app.use(async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			ctx.body = { error }
		}
		if (ctx.status === 404 || ctx.status === 405) {
			ctx.body = { code: 0, message: '无效的api请求'}
		}
	})
} 

module.exports = middlewares
