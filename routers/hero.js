'use strict'
import xss from 'xss'
// 留言路由
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putHero, delectHero, 
		editeHero, getHero} from '../controllers/hero'

import {resError, resSuccess} from '../utils/resHandle'

@controller(`${config.APP.ROOT_PATH}/hero`)
export class heroController {
	// 添加留言
	@put('add')
	@required({body: ['content', 'author']})
	async addHero (ctx, next) {
		let opts = ctx.request.body
		opts.content = xss(opts.content)
		try {
			let article = await putHero(ctx, opts)
		resSuccess({ ctx, message: '添加留言成功'})
		} catch (err) {
			resError({ ctx, message: '添加留言失败', err})
		}
	}
	// 获取留言
	@get('get')
	async toGetHero (ctx, next) {
		try {
			const res = await getHero(ctx.query)
			resSuccess({ ctx, message: '获取留言成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取留言失败', err})
		}
	}
	// 删除评论
	@del('delect/:id')
	async removeHero (ctx, next) {
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
	// 编辑评论
	@post('edite/:id')
	async toEditeReply (ctx, next) {
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
}
