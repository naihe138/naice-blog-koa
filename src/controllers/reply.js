'use strict'
const geoip = require('geoip-lite')
const Reply = require('../models/reply')
const Comment = require('../models/comment')

// 添加评论回复
const putReply = async (ctx, reply) => {
	// 获取ip地址以及物理地理地址
	const ip = (ctx.req.headers['x-forwarded-for'] ||
		ctx.req.headers['x-real-ip'] ||
		ctx.req.connection.remoteAddress ||
		ctx.req.socket.remoteAddress ||
		ctx.req.connection.socket.remoteAddress ||
		ctx.req.ip ||
		ctx.req.ips[0]).replace('::ffff:', '');
	reply.ip = ip || '14.215.177.38'
	reply.agent = ctx.headers['user-agent'] || reply.agent

	const ip_location = geoip.lookup(reply.ip)

	if (ip_location) {
		reply.city = ip_location.city
		reply.range = ip_location.range
		reply.country = ip_location.country
		if (Array.isArray(reply.range)) {
      reply.range = reply.range.join(',')
    }
	}

	reply.likes = 0

	// 发布评论回复
	const res = await (new Reply(reply)).save()
	let permalink = 'https://blog.naice.me'
	if (reply.post_id) {
		permalink = `https://blog.naice.me/article/${reply.post_id}`
	}
	// 让原来评论数+1
	let comment = await Comment.findOne({ _id: reply.cid })
	if (comment) {
		// 每次评论，reply 都增加一次
		comment.reply += 1
		await comment.save()
	}
	res.permalink = permalink
	return res
}

// 删除评论的回复
const delectReply = async (_id) => {
	return await Reply.findByIdAndRemove(_id)
}

// 修改评论
const editeReply = async (_id, opt) => {
	return await Reply.findByIdAndUpdate(_id, opt)
}

// 喜欢回复
const likeReply = async (_id) => {
	let res = await Reply.findById(_id)
	if (res) {
		// 每次评论，reply 都增加一次
		res.likes += 1
		await res.save()
	}
}

// 根据评论id获取评论
const getReplyById = async (cid, opts = {}) => {
	let { sort = -1, current_page = 1, page_size = 20, keyword = '', post_id, state } = opts
	let result = {}
	sort = Number(sort)
	// 过滤条件
	const options = {
		sort: { _id: sort },
		page: Number(current_page),
		limit: Number(page_size)
	}

	// 排序字段
	if ([1, -1].includes(sort)) {
		options.sort = { _id: sort }
	} else if (Object.is(sort, 2)) {
		options.sort = { likes: -1 }
	};

	// 查询参数
	let querys = {
		cid
	}

	// 查询各种状态
	if (state && ['0', '1', '2'].includes(state)) {
		querys.state = state;
	};

	// 如果是前台请求，则重置公开状态和发布状态
	// if (!authIsVerified(ctx.request)) {
	// 	querys.state = 1
	// };

	// 关键词查询
	if (keyword) {
		const keywordReg = new RegExp(keyword);
		querys['$or'] = [
			{ 'content': keywordReg },
			{ 'to.name': keywordReg },
			{ 'to.email': keywordReg }
		]
	}

	// 请求评论
	const reply = await Reply.paginate(querys, options)

	if (reply) {
		result = {
			pagination: {
				total: reply.total,
				current_page: reply.page,
				total_page: reply.pages,
				per_page: reply.limit
			},
			data: reply.docs
		}
	}
	return result
}

// 更新评论状态
const changeReplyStatus = async (_id, state) => {
	return await Reply.findByIdAndUpdate(_id, { state })
}

module.exports = {
	putReply,
	delectReply,
	editeReply,
	likeReply,
	getReplyById,
	changeReplyStatus
}
