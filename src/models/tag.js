/*
*
* 标签数据模型
*
*/

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

// 标签模型
const tagSchema = new mongoose.Schema({

	// 标签名称
	name: { type: String, required: true, validate: /\S+/ },

	// 标签描述
	descript: String,

	// 发布日期
	create_at: { type: Date, default: Date.now },

	// 最后修改日期
	update_at: { type: Date },

	// 排序
	sort: { type: Number, default: 0 }

})

// 翻页
tagSchema.plugin(mongoosePaginate)

// 时间更新
tagSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 标签模型
const Tag = mongoose.model('Tag', tagSchema)

// export
export default Tag
