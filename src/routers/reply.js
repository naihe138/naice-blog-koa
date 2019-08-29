'use strict'
import xss from 'xss'
// 回复路由
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putReply, delectReply, 
				editeReply, getReplyById, 
        changeReplyStatus, likeReply } from '../controllers/reply'
import {resError, resSuccess} from '../utils/resHandle'
import { sendMail } from '../utils/email'

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

@controller(`${config.APP.ROOT_PATH}/reply`)
export class commentController {
	// 添加回复
	@put('add')
	@required({body: ['post_id', 'cid', 'content', 'from']})
	async addReply (ctx, next) {
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

	// 根据评论id获取回复
	@get('get/:id')
	async getReplyId (ctx, next) {
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
	// 删除回复
	@del('delect/:id')
	async removeReply (ctx, next) {
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
	// 编辑回复
	@post('edite/:id')
	@required({body: ['id']})
	async editeRepy (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeReply(ctx.request.body)
				resSuccess({ ctx, message: '修改回复成功'})
			} catch(err) {
				resError({ ctx, message: '修改回复失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改回复失败', err: '地址缺少参数id'})
		}
	}
	// 改变评论状态
	@post('status/:id')
	async changeReplyState (ctx, next) {
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
	// 改变评论状态
	@post('like/:id')
	async toLikeReply (ctx, next) {
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
}
