'use strict'

import Tag from '../models/tag'
import Article from '../models/article'
/**
 * 标签添加
 * @param {传进来的添加字段} opts 
 */
export const putTag = async (opts) => {
	const {name} = opts
	// 添加前，先验证是否有相同 name
	const res = await Tag.find({ name })
	if (res && res.length !== 0) {
		throw new Error('标签名已经存在')
	} else {
		const tag = await new Tag(opts)
		return tag.save()
	}
}

/**
 * 标签获取
 * @param {传进来的获取限制字段} query 
 */
export const getTags = async (query = {}) => {
	
	const { current_page = 1, page_size = 50, keyword = '' } = query
	// 过滤条件
	const options = {
		sort: { sort: 1 },
		page: Number(current_page),
		limit: Number(page_size)
	}
	
	// 参数
	let querys = {}
	if (keyword) {
		querys.name = new RegExp(keyword)
	}
	let result = []
	const tag = await Tag.paginate(querys, options)
	if (tag) {

		let tagClone = JSON.parse(JSON.stringify(tag))

		// 查找文章中标签聚合
		let $match = {}

		// 前台请求时，只有已经发布的和公开
		// if(!authIsVerified(ctx.request)) $match = { state: 1, publish: 1 }

		const article = await Article.aggregate([
			{ $match },
			{ $unwind : "$tag" }, 
			{ $group: {
				_id: "$tag", 
				num_tutorial: { $sum : 1 }}
			}
		])
		if (article) {
			tagClone.docs.forEach(t => {
				const finded = article.find(c => String(c._id) === String(t._id))
				t.count = finded ? finded.num_tutorial : 0
			})
			result = {
				pagination: {
					total: tagClone.total,
					current_page: tagClone.page,
					total_page: tagClone.pages,
					page_size: tagClone.limit
				},
				list: tagClone.docs
			}
		}
	}

	return result
}

/**
 * 修改标签
 * @param {传进来的修改选项} opt 
 */
export const editTag = async (opt) => {
	const { _id, name, descript } = opt
	const tag = await Tag.findByIdAndUpdate(_id, { name, descript }, { new: true })
}

/**
 * 删除标签
 * @param {标签的id} _id 
 */
export const deleteTag = async (_id) => {
	return await Tag.findByIdAndRemove(_id)
}