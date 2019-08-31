'use strict'
// 留言路由
const xss = require('xss')
const config = require('../config')
const { putHero, delectHero, editeHero, getHero} = require('../controllers/hero')
const {resError, resSuccess} = require('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/hero/`
const resolvePath = p => `${BASE_PATH}${p}`

function hero (router) {
	const ADD_HERO_PARAMS = ['content', 'author']
	async function ADD_HERO (ctx, next) {
		let opts = ctx.request.body
		opts.content = xss(opts.content)
		try {
			let article = await putHero(ctx, opts)
			resSuccess({ ctx, message: '添加留言成功'})
		} catch (err) {
			resError({ ctx, message: '添加留言失败', err})
		}
	}
	router.put(resolvePath('add'), verifyParams(ADD_HERO_PARAMS), ADD_HERO)

	// 获取留言
	async function GET_HERO (ctx, next) {
		try {
			const res = await getHero(ctx.query)
			resSuccess({ ctx, message: '获取留言成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取留言失败', err})
		}
	}
	router.get(resolvePath('get'), GET_HERO)

	// 删除评论
	async function REMOVE_HERO (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await delectHero(id)
				resSuccess({ ctx, message: '删除留言成功'})
			} catch(err) {
				resError({ ctx, message: '删除留言失败', err})
			}
		} else {
			resError({ ctx, message: '删除留言失败', err: '缺少参数id'})
		}
	}
	router.del(resolvePath('delect/:id'), REMOVE_HERO)
	
	// 编辑留言区
	async function ADITE_HERO (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeHero(id, ctx.request.body)
				resSuccess({ ctx, message: '修改留言成功'})
			} catch(err) {
				resError({ ctx, message: '修改留言失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改留言失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('edite/:id'), ADITE_HERO)
}

module.exports = hero
