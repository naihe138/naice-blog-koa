'use strict'

// 用户路由
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'

import { putComment, findOne } from '../controllers/user'

import {resError, resSuccess} from '../utils/resHandle'

// md5 编码
const md5Decode = pwd => crypto.createHash('md5').update(pwd).digest('hex')

@controller(`${config.APP.ROOT_PATH}/user`)
export class userController {
	// 添加评论
	@put('signin')
	@required({body: ['username', 'password']})
	async addUser (ctx, next) {
		const opts = ctx.request.body
        try {
            let article = await putComment(ctx, opts)
		    		resSuccess({ ctx, message: '添加评论成功'})
        } catch (err) {
            resError({ ctx, message: '添加评论失败', err})
        }
	}
	// 登录
	@post('login')
	@required({body: ['username', 'password']})
	async Login (ctx, next) {
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
}
