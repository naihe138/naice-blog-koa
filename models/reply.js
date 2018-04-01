'use strict'

// 评论回复数据模型
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import mongoosePaginate from 'mongoose-paginate'

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 标签模型
const replySchema = new mongoose.Schema({

	// 评论所在的文章_id
	post_id: { type: String, required: true },

	// cid，评论id
	cid: { type: String, required: true },
	from: {
		// 头像
		gravatar: { type: String, default: '' },
		// 用户名
		name: { type: String, required: true, validate: /\S+/ },
		// 邮箱
		email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
		// 网站
		site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
	},
	to: {
		// 头像
		gravatar: { type: String, default: '' },
		// 用户名
		name: { type: String, validate: /\S+/ },
		// 邮箱
		email: { type: String, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
		// 网站
		site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
	},
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

  	// 状态 0待审核 1通过正常 2不通过
  	state: { type: Number, default: 1 },

	// 发布日期
	create_at: { type: Date, default: Date.now },

	// 最后修改日期
	update_at: { type: Date }
})

// 翻页 + 自增ID插件配置
replySchema.plugin(mongoosePaginate)
replySchema.plugin(autoIncrement.plugin, {
	model: 'Reply',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新
replySchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 标签模型
const Reply = mongoose.model('Reply', replySchema)

// export
export default Reply
