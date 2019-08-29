'use strict'

// 留言墙模型
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const heroSchema = new mongoose.Schema({
	// 名称
	name: { type: String },
	// 内容
	content: { type: String, required: true, validate: /\S+/ },
	// 评论产生者
	author: {
		// 头像
		gravatar: { type: String, default: 0 },
		// 用户名
		name: { type: String, required: true, validate: /\S+/ },
		// 邮箱
		email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
		// 网站
		site: { type: String }
	},
  // 状态  0 待审核，1 审核通过， 2 审核不通过
	state: { type: Number, default: 1 },
	// ip
	ip: { type: String },
	// ip 物理地址
	city: { type: String },
	range: { type: String },
	country: { type: String },
	// 用户ua
	agent: { type: String, validate: /\S+/ },
	// 发布日期
	create_time: { type: Date, default: Date.now }
})

// 翻页插件配置
heroSchema.plugin(mongoosePaginate)

// 标签模型
module.exports = mongoose.model('Hero', heroSchema)
