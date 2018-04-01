'use strict'

import {argv} from 'yargs'

const MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/my_blog`,
	username: argv.db_username || 'DB_username123',
	password: argv.db_password || 'DB_password'
}

const QINIU = {
	accessKey: argv.qn_accessKey || 'your_qn_accessKey',
	secretKey: argv.qn_secretKey || 'your_qn_secretKey',
	bucket: argv.qn_bucket || 'blog',
	origin: argv.qn_origin || 'http://blog.u.qiniudn.com',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

const User = {
	jwtTokenSecret: argv.auth_key || 'naice_blog',
	defaultUsername: argv.auth_default_username || 'naice',
	defaultPassword: argv.auth_default_password || '123456'
}

const EMAIL = {
	account: argv.EMAIL_account || 'your_email_account',
	password: argv.EMAIL_password || 'your_email_password'
}

const BAIDU = {
	site: argv.baidu_site || 'your_baidu_site',
	token: argv.baidu_token || 'your_baidu_token'
}

const APP = {
	ROOT_PATH: '/api',
	LIMIT: 10,
	PORT: 8000
}

const INFO = {
	name: 'by_blog',
	version: '1.0.0',
	author: 'naice',
	site: 'https://blog.naice.me',
	powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}

export default {
	MONGODB,
	QINIU,
	User,
	EMAIL,
	BAIDU,
	APP,
	INFO
}