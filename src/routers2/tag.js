'use strict'
// 标签路由
const config = require('../config')
const { putTag, getTags, editTag, deleteTag } = require('../controllers/tag')
const {resError, resSuccess} = require('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const resolvePath = p => `${config.APP.ROOT_PATH}/tag/${p}`

function tags (router) {
	// 新增标签
	const ADD_TAG_PARAMS = ['name']
	const ADD_TAG = async (ctx) => {
		console.log('aaa')
		const { name, descript = ''} = ctx.request.body
		try {
			const tag = await putTag({name, descript})
			resSuccess({ ctx, message: '添加标签成功', result: tag })
		} catch (err) {
			resError({ ctx, message: '添加标签失败', err: err.message})
		}
	}
	console.log(111, resolvePath('add'))
	router.put(resolvePath('add'), verifyParams(ADD_TAG_PARAMS), ADD_TAG)

	// 获取所有标签
	const GET_TAGS = async (ctx) => {
		try{
			let tags = await getTags()
			resSuccess({ ctx, message: '获取标签成功', result: tags })
		} catch (err) {
			resError({ ctx, message: '获取标签失败', err})
		}
	}
	router.get(resolvePath('get'), GET_TAGS)

	// 根据id删除标签

	const REMOVE_TAG = async (ctx) => {
		const { id } = ctx.params
		if (id) {
			try {
				await deleteTag(id)
				resSuccess({ ctx, message: '删除标签成功'})
			} catch (err) {
				resError({ ctx, message: '删除标签失败', err})
			}
		} else {
			resError({ ctx, message: '删除标签失败', err: '缺少参数id'})
		}
	}
	router.del(resolvePath('delect/:id'), REMOVE_TAG)

	// 编辑标签
	const EDIT_TAG_PRAMS = ['_id', 'name']
	const EDIT_TAG = async (ctx) => {
		try {
			const tag = await editTag(ctx.request.body)
			resSuccess({ ctx, message: '修改标签成功'})
		} catch (err) {
			resError({ ctx, message: '修改标签失败', err})
		}
	}
	router.post(resolvePath('edit'), verifyParams(EDIT_TAG_PRAMS), EDIT_TAG)
}

module.exports = tags
