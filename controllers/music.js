'use strict'
import path from 'path'
import Music from '../models/music'
import { uploadFile, upToQiniu, removeTemFile } from '../utils/upload'
/**
 * 添加音乐
 * @param {*} opts 
 */
export const putMusic = async (ctx, obj) => {
	return await (new Music(obj)).save()
}

/**
 * 删除音乐
 * @param {音乐id} _id 
 */
export const delectMusic = async (_id) => {
  return await Music.findByIdAndRemove(_id)
}

/**
 * 修改音乐数据
 * @param {音乐id} _id 
 * @param {修改参数} opt 
 */
export const editeMusic = async (_id, opt) => {
  return await Music.findByIdAndUpdate(_id, opt)
}

/**
 * 获取所有音乐
 * @param {*} opts
 */
export const getMusic = async (opts = {} ) => {
	let { state = '', id ='' } = opts
  // 查询参数
	const querys = {}
	// 审核状态查询
	if (['0', '1', '2'].includes(state)) {
		querys.state = Number(state)
	}
	if (id) {
		querys._id = id
	}
	return await Music.find(querys)
}
/**
 * 上传海报
 */
export const upload = async (ctx) => {
	const serverPath = path.join(__dirname, '../uploadtemp/')
	// 获取上存图片
  const result = await uploadFile(ctx, {
    fileType: 'poster',
    path: serverPath
	})
	const imgPath = path.join(serverPath, result.imgPath)
  // 上传到七牛
	const qiniu = await upToQiniu(imgPath, result.imgKey)
  // 上存到七牛之后 删除原来的缓存文件
	removeTemFile(imgPath)
	return qiniu
}