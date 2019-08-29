// 权限和用户数据模型
import mongoose from 'mongoose'
import crypto from 'crypto'
import config from '../config'

const userSchema = new mongoose.Schema({
	// 名字
	name: { type: String, default: 'naice' },

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

	// role
	role: { type: Number, default: 1 }
})

const User = mongoose.model('User', userSchema)

// export
export default User
