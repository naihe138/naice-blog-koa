'use strict'

import xss from 'xss'
// 评论路由
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putComment, delectComment, 
				editeComment, getComment, 
        changeCommentStates, likeComment } from '../controllers/comment'
import {resError, resSuccess} from '../utils/resHandle'
import { sendMail } from '../utils/email'

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (comment) => {
	sendMail({
		to: `hewenlin1991@gmail.com, ${comment.author.email}`,
		subject: '博客有新的留言',
		text: `来自 ${comment.author.name} 的留言：${comment.content}`,
		html: `<p> 来自 ${comment.author.name} 的留言：${comment.content}</p><br><a href="${comment.permalink}" target="_blank">[ 点击查看 ]</a>`
	});
}

@controller(`${config.APP.ROOT_PATH}/comment`)
export class commentController {
	// 添加评论
	@put('add')
	@required({body: ['post_id', 'content', 'author']})
	async addComment (ctx, next) {
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
	// 获取评论
	@get('get')
	async getCommentId (ctx, next) {
		try {
			const res = await getComment(ctx.query)
			resSuccess({ ctx, message: '获取评论成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取评论失败', err})
		}
	}
	// 删除评论
	@del('delect/:id')
	async removeComment (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await delectComment(id)
				resSuccess({ ctx, message: '删除评论成功'})
			} catch(err) {
				resError({ ctx, message: '删除评论失败', err: err})
			}
		} else {
			resError({ ctx, message: '删除评论失败', err: '缺少参数id'})
		}
	}
	// 编辑评论
	@post('edite/:id')
	async toEditeComment (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeComment(id, ctx.request.body)
				resSuccess({ ctx, message: '修改评论成功'})
			} catch(err) {
				resError({ ctx, message: '修改评论失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改评论失败', err: '地址缺少参数id'})
		}
	}
	// 喜欢评论
	@post('like/:id')
	async toLikeComment (ctx, next) {
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
}
