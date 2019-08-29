'use strict'

// 评论数据模型
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

// 标签模型
const commentSchema = new mongoose.Schema({

	// 评论所在的文章_id，0代表系统留言板
	post_id: { type: String, required: true },

	// pid，0代表默认留言
	pid: { type: Number, default: 0 },

	// content
	content: { type: String, required: true, validate: /\S+/ },

	// 被赞数
	likes: { type: Number, default: 0 },

	// ip
	ip: { type: String },
	// ip 物理地址
	city: { type: String },
	range: { type: String },
	country: { type: String },

	// 用户ua
	agent: { type: String, validate: /\S+/ },

	// 评论产生者
	author: {
		// 头像
		gravatar: { type: String, default: 0 },
		// 用户名
		name: { type: String, required: true, validate: /\S+/ },
		// 邮箱
		email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
		// 网站
		site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
	},

  	// 状态 0待审核 1通过正常 2不通过
	state: { type: Number, default: 1 },
	
	// 评论数
	reply: { type: Number, default: 0 },

	// 发布日期
	create_at: { type: Date, default: Date.now },

	// 最后修改日期
	update_at: { type: Date, default: Date.now }
})

// 翻页配置
commentSchema.plugin(mongoosePaginate)

// 时间更新
commentSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 标签模型
const Comment = mongoose.model('Comment', commentSchema)

// export
export default Comment
