'use strict'

const MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/blogapi',
	prouri: 'mongodb://xxxxx@xxxxx/blogapi'
}

const QINIU = {
	accessKey: 'your_qn_accessKey',
	secretKey: 'your_qn_secretKey',
	bucket: 'naice',
	origin: 'xxxxxx',
	uploadURL: 'your_qn_uploadURL'
}

const User = {
	jwtTokenSecret: 'naice_blog',
	defaultUsername: 'naice',
	defaultPassword: '123456'
}

const EMAIL = {
	service: 'QQ',
	account: 'xxxxx@xx.com',
	password: 'xxxx' // IMAP/SMTP授权码，需要从qq邮箱获取
}

const BAIDU = {
	site: 'blog.naice.me',
	token: 'xxxxxxx'
}

const APP = {
	ROOT_PATH: '/api',
	LIMIT: 10,
	PORT: 3009
}

const INFO = {
	name: 'by_blog',
	version: '1.0.0',
	author: 'naice',
	site: 'https://blog.naice.me',
	powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}

module.exports = {
	MONGODB,
	QINIU,
	User,
	EMAIL,
	BAIDU,
	APP,
	INFO
}
