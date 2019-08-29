'use strict'

import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putMusic, delectMusic, editeMusic, getMusic, upload } from '../controllers/music'

import {resError, resSuccess} from '../utils/resHandle'

@controller(`${config.APP.ROOT_PATH}/music`)
export class MusicController {
	// 添加音乐
	@put('add')
	@required({body: ['title', 'name', 'url']})
	async addMusic (ctx, next) {
		let opts = ctx.request.body
		try {
			await putMusic(ctx, opts)
			resSuccess({ ctx, message: '添加音乐成功'})
		} catch (err) {
			resError({ ctx, message: '添加音乐失败', err})
		}
	}
	// 获取音乐
	@get('get')
	async toGetMusic (ctx, next) {
		try {
			const res = await getMusic(ctx.query)
			resSuccess({ ctx, message: '获取音乐成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取音乐失败', err})
		}
	}
	// 删除评论
	@del('delect/:id')
	async removeMusic (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await delectMusic(id)
				resSuccess({ ctx, message: '删除音乐成功'})
			} catch(err) {
				resError({ ctx, message: '删除音乐失败', err})
			}
		} else {
			resError({ ctx, message: '删除音乐失败', err: '缺少参数id'})
		}
	}
	// 编辑评论
	@post('edite/:id')
	async toEditeReply (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeMusic(id, ctx.request.body)
				resSuccess({ ctx, message: '修改音乐成功'})
			} catch(err) {
				resError({ ctx, message: '修改音乐失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改音乐失败', err: '地址缺少参数id'})
		}
	}
	// 上传
	@post('upload')
	async toUpload (ctx, next) {
		try {
			const res = await upload(ctx)
			resSuccess({ ctx, message: '上传成功', result: `http://img.store.naice.me/${res.key}`})
		} catch(err) {
			resError({ ctx, message: '上传失败', err: err})
		}
	}
}
