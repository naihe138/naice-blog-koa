'use strict'

import User from '../models/user'

/**
 * 注册用户
 * @param {*} opts 
 */
export const signUp = async (opts) => {
  	return await (new User(opts)).save()
}

/**
 * 登录接口
 * @param {用户名} username 
 */
export const findOne = async (username) => {
	return await User.findOne({ username }).exec()
}

/**
 * 获取用户信息
 * @param {用户名} username 
 */
export const getUserInfo = async (username) => {
    return await User.findOne({username}, 'name username slogan gravatar role')
}


/**
 * 编辑用户
 * @param {*} opts 
 */
export const edite = async (opts = {}) => {

	const { _id, name, username, slogan, gravatar, oldPassword, newPassword } = opts
	const user = await User.findOne({username}, '_id name slogan gravatar password role')
	
	if (user) {
		if (user.password !== md5Decode(oldPassword)) {
			return new Error('密码不正确')
		} else {
		  const password = newPassword === '' ? oldPassword : newPassword
		  let editeUser = await Auth.findByIdAndUpdate(_id, {_id, name, username, slogan, gravatar, password: md5Decode(password) }, { new: true })
		  if (auth) {
			return editeUser
		  } else {
			return new Error('修改用户资料失败')
		  }
		}
	} else {
		return new Error('修改用户资料失败')
	}
}
