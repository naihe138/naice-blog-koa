'use strict'
// 回复评论路由
const xss = require('xss')
const config = require('../config')
const { putReply, delectReply, editeReply, getReplyById, changeReplyStatus, likeReply } = require('../controllers/reply')
const {resError, resSuccess} = require('../utils/resHandle')
const { sendMail } = require('../utils/email')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/reply/`
const resolvePath = p => `${BASE_PATH}${p}`

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (reply) => {
	let str = 'hewenlin1991@gmail.com';
	if (reply.to && reply.to.email) {
		str += `, ${reply.from.email}, ${reply.to.email}`
	} else {
		str += `, ${reply.from.email}`
	}
	sendMail({
		to: str,
		subject: '你在blog.naice.me有新的评论回复',
		text: `来自 ${reply.from.name} 的评论回复：${reply.content}`,
		html: `<p> 来自${reply.from.name} 的评论回复：${reply.content}</p><br><a href="${reply.permalink}" target="_blank">[ 点击查看 ]</a>`
	})
}

function reply(router) {
	// 添加回复
	const ADD_REPLY_PARAMS = ['post_id', 'cid', 'content', 'from']
	async function ADD_REPLY (ctx, next) {
		let opts = ctx.request.body
		opts.content = xss(opts.content)
		try {
			let reply = await putReply(ctx, ctx.request.body)
			sendMailToAdminAndTargetUser(reply)
			resSuccess({ ctx, message: '添加评论成功'})
		} catch (err) {
			resError({ ctx, message: '添加评论失败', err})
		}
	}
	router.put(resolvePath('add'), verifyParams(ADD_REPLY_PARAMS), ADD_REPLY)

	// 根据评论id获取回复
	async function GET_REPLY_BY_COMMENT_ID (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await getReplyById(id, ctx.query)
				resSuccess({ ctx, message: '获取回复成功', result: res})
			} catch(err) {
				resError({ ctx, message: '获取回复失败', err})
			}
		} else {
			resError({ ctx, message: '获取回复失败', err: '缺少参数id'})
		}
	}
	router.get(resolvePath('get/:id'), GET_REPLY_BY_COMMENT_ID)

	// 删除回复
	async function REMOVE_REPLY (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await delectReply(id)
				resSuccess({ ctx, message: '删除成功'})
			} catch(err) {
				resError({ ctx, message: '删除失败', err: err})
			}
		} else {
			resError({ ctx, message: '删除失败', err: '缺少参数id'})
		}
	}
	router.del(resolvePath('delect/:id'), REMOVE_REPLY)

	// 编辑回复
	async function EDITE_REPLY (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				await editeReply(id, ctx.request.body)
				resSuccess({ ctx, message: '修改回复成功'})
			} catch(err) {
				resError({ ctx, message: '修改回复失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改回复失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('edite/:id'), EDITE_REPLY)

	// 改变评论状态
	async function CHANGE_REPLY_STATUS (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await changeReplyStatus(id, ctx.request.body)
				resSuccess({ ctx, message: '修改回复态成功'})
			} catch(err) {
				resError({ ctx, message: '修改回复状态失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改评回复态失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('status/:id'), CHANGE_REPLY_STATUS)


	// 喜欢回复
	async function LICK_REPLAY (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await likeReply(id)
				resSuccess({ ctx, message: '修改成功'})
			} catch(err) {
				resError({ ctx, message: '修改状态失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改失败', err: '地址缺少参数id'})
		}
	}
	router.post(resolvePath('like/:id'), LICK_REPLAY)
}

module.exports = reply
