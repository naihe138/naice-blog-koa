'use strict'
// 音乐数据模型
const mongoose = require('mongoose')
const MusicSchema = new mongoose.Schema({
	// 歌曲名称
	title: { type: String },
	// 歌星
	name: { type: String },
	// 海报封面
	poster: { type: String },
	// 歌词
	lyrics: { type: String, required: true, validate: /\S+/ },
  // 状态  0 待审核，1 审核通过， 2 审核不通过
	state: { type: Number, default: 1 },
	// 链接
	url: { type: String },
	// 发布日期
	create_time: { type: Date, default: Date.now },
	// 更新时间
	update_at: { type: Date, default: Date.now }
})

// 时间更新
MusicSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

module.exports = mongoose.model('Music', MusicSchema)
