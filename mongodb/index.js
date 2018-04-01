'use strict'
// 数据库模块
import glob from 'glob'
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { resolve } from 'path'
import config	from '../config'
import initAdmin from './initAdmin'

// fs.readdirSync(models)
//   .filter(file => ~file.search(/^[^\.].*js$/))
//   .forEach(file => require(resolve(models, file)))

// mongoose设置
const url = process.env.NODE_ENV === 'production' ? config.MONGODB.prouri : config.MONGODB.uri
const debuger = process.env.NODE_ENV !== 'production'

mongoose.Promise = global.Promise
mongoose.set('debug', debuger)

// 数据模型引入
glob.sync(resolve(__dirname, '../models/*.js')).forEach(require)

// 数据库
export default function () {
	// 连接数据库
	mongoose.connect(url)

	// 连接错误
	mongoose.connection.on('error', error => {
		console.log('数据库连接失败!', error)
	})

	// 连接成功
	mongoose.connection.once('open', () => {
		console.log('数据库连接成功!')
		// 分页插件配置
		mongoosePaginate.paginate.options = {
			limit: config.APP.LIMIT
		}
		// 初始化管理员
		initAdmin()
	})

	return mongoose
}
