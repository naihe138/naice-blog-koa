'use strict'

// 项目数据模型
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const projectSchema = new mongoose.Schema({
	// 项目标题
	title: { type: String, required: true },
	// 描述
	descript: { type: String, required: true },
	// icon图
	icon: String,
	view: String,
	github: String,
	// 发布日期
	create_at: { type: Date, default: Date.now },
	// 最后修改日期
	update_at: { type: Date, default: Date.now }
})

// 翻页插件配置
projectSchema.plugin(mongoosePaginate)

// 时间更新
projectSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 文章模型
module.exports = mongoose.model('Project', projectSchema)
