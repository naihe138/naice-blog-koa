// 权限和用户数据模型
const mongoose = require('mongoose')
const crypto = require('crypto')
const config = require('../config')

const userSchema = new mongoose.Schema({
	// 名字
	name: { type: String, default: 'naice' },
	// 用户名
	username: {
		type: String,
		default: config.User.defaultUsername
	},
	// 签名
	slogan: { type: String, default: '' },
	// 头像
	gravatar: { type: String, default: '' },
	// 密码
	password: { 
		type: String,
		default: crypto.createHash('md5').update(config.User.defaultPassword).digest('hex')
	},
	// 角色权限
	role: { type: Number, default: 1 }
})

const User = mongoose.model('User', userSchema)

module.exports = User
