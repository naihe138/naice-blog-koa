'use strict'
// 文章数据模型

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const articleSchema = new mongoose.Schema({
  
  // 文章标题
  title: { type: String, required: true },

  // 关键字
  keyword: { type: String, required: true },

  // 描述
  descript: { type: String, required: true },

  // 标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],

  // 内容
  content: { type: String, required: true },

  // 编辑内容
  editContent: { type: String, required: true },

  // 状态 1 发布 2 草稿
  state: { type: Number, default: 1 },

  // 文章公开状态 1 公开 2 私密
  publish: { type: Number, default: 1 },

	// 缩略图
  thumb: String,

  // 文章分类 1 code 2 think 3 民谣
  type: { type: Number, default: 1 },
  
	// 发布日期
  create_at: { type: Date, default: Date.now },

	// 最后修改日期
	update_at: { type: Date, default: Date.now },
  
	// 其他元信息
	meta: {
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		comments: { type: Number, default: 0 }
	}
})

// 翻页插件配置
articleSchema.plugin(mongoosePaginate)

// 时间更新
articleSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 文章模型
const Article = mongoose.model('Article', articleSchema)

// export
export default Article