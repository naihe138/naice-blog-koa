'use strict'

const xss = require('xss')
// 评论路由
const config = require('../config')
const { putComment, delectComment, editeComment, getComment, likeComment } = require('../controllers/comment')
const {resError, resSuccess} = require('../utils/resHandle')
const { sendMail } = require('../utils/email')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/comment/`
const resolvePath = p => `${BASE_PATH}${p}`

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (comment) => {
	sendMail({
		to: `hewenlin1991@gmail.com, ${comment.author.email}`,
		subject: '博客有新的留言',
		text: `来自 ${comment.author.name} 的留言：${comment.content}`,
		html: `<p> 来自 ${comment.author.name} 的留言：${comment.content}</p><br><a href="${comment.permalink}" target="_blank">[ 点击查看 ]</a>`
	})
}

function comments (router) {
	// 添加评论
	const ADD_COMMENT_PARAMS = ['post_id', 'content', 'author']
	async function ADD_COMMENT (ctx, next) {
		let opts = ctx.request.body
		opts.content= xss(opts.content);
		try {
			let comment = await putComment(ctx, opts)
			sendMailToAdminAndTargetUser(comment)
			resSuccess({ ctx, message: '添加评论成功'})
		} catch (err) {
			resError({ ctx, message: '添加评论失败', err})
		}
	}
	router.put(resolvePath('add'), verifyParams(ADD_COMMENT_PARAMS), ADD_COMMENT)

	// 获取评论
	async function GET_COMMENTS (ctx, next) {
		try {
			const res = await getComment(ctx.query)
			resSuccess({ ctx, message: '获取评论成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取评论失败', err})
		}
	}
	router.get(resolvePath('get'), GET_COMMENTS)

	// 删除评论
	async function REMOVE_COMMENT (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				await delectComment(id)
				resSuccess({ ctx, message: '删除评论成功'})
			} catch(err) {
				resError({ ctx, message: '删除评论失败', err: err})
			}
		} else {
			resError({ ctx, message: '删除评论失败', err: '缺少参数id'})
		}
	}
	router.del(resolvePath('delect/:id'), REMOVE_COMMENT)

	// 编辑评论
	async function EDIT_COMMENT (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				await editeComment(id, ctx.request.body)
				resSuccess({ ctx, message: '修改评论成功'})
			} catch(err) {
				resError({ ctx, message: '修改评论失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改评论失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('edite/:id'), EDIT_COMMENT)

	// 喜欢评论
	async function LIKE_COMMENT (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await likeComment(id)
				resSuccess({ ctx, message: '修改成功'})
			} catch(err) {
				resError({ ctx, message: '修改失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('like/:id'), LIKE_COMMENT)
}

module.exports = comments
