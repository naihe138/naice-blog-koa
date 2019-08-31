'use strict'
// 音乐路由
const config = require('../config')
const { putMusic, delectMusic, editeMusic, getMusic, upload } = require('../controllers/music')
const {resError, resSuccess} = require('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/music/`
const resolvePath = p => `${BASE_PATH}${p}`

function music (router) {
	// 添加音乐
	const ADD_MUSIC_PARAMS = ['title', 'name', 'url']
	async function ADD_MUSIC (ctx, next) {
		let opts = ctx.request.body
		try {
			await putMusic(ctx, opts)
			resSuccess({ ctx, message: '添加音乐成功'})
		} catch (err) {
			resError({ ctx, message: '添加音乐失败', err})
		}
	}
	router.put(resolvePath('add'), verifyParams(ADD_MUSIC_PARAMS), ADD_MUSIC)

	// 获取音乐
	async function GET_MUSIC (ctx, next) {
		try {
			const res = await getMusic(ctx.query)
			resSuccess({ ctx, message: '获取音乐成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取音乐失败', err})
		}
	}
	router.get(resolvePath('get'), GET_MUSIC)
	
	// 删除音乐
	async function REMOVE_MOSIC (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				await delectMusic(id)
				resSuccess({ ctx, message: '删除音乐成功'})
			} catch(err) {Í
				resError({ ctx, message: '删除音乐失败', err})
			}
		} else {
			resError({ ctx, message: '删除音乐失败', err: '缺少参数id'})
		}
	}
	router.del(resolvePath('delect/:id'), REMOVE_MOSIC)

	// 编辑音乐
	async function EDITE_MUSIC (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeMusic(id, ctx.request.body)
				resSuccess({ ctx, result: res, message: '修改音乐成功'})
			} catch(err) {
				resError({ ctx, message: '修改音乐失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改音乐失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('edite/:id'), EDITE_MUSIC)

	// 上传
	async function UPLOAD (ctx, next) {
		try {
			const res = await upload(ctx)
			resSuccess({ ctx, message: '上传成功', result: `http://img.store.naice.me/${res.key}`})
		} catch(err) {
			resError({ ctx, message: '上传失败', err: err})
		}
	}
	router.post(resolvePath('upload'), UPLOAD)
}

module.exports = music
