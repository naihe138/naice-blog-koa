'use strict'
// 用户路由
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config')
const { findOne } = require('../controllers/user')
const {resError, resSuccess} = require('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/user/`
const resolvePath = p => `${BASE_PATH}${p}`
// md5 编码
const md5Decode = pwd => crypto.createHash('md5').update(pwd).digest('hex')

function user (router) {
	// 登录
	const LOGIN_PARAMS = ['username', 'password']
	async function LOGIN (ctx, next) {
		const { username, password } = ctx.request.body
		try {
			const user = await findOne(username)
			if (user) {
				if (user.password === md5Decode(password)) {
					const token = jwt.sign({
						name: user.name,
						password: user.password,
						exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
					}, config.User.jwtTokenSecret)
					resSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, message: "登陆成功" })
				} else {
					resError({ ctx, message: "密码错误!" })
				}
			} else {
				resError({ ctx, message: "账户不存在" })
			}
		} catch (err) {
			resError({ ctx, message: '查询内部失败', err})
		}
	}
	router.post(resolvePath('login'), verifyParams(LOGIN_PARAMS), LOGIN)
}

module.exports = user
