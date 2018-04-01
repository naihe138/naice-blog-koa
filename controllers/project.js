'use strict'
import Project from '../models/project'

/**
 * 添加项目
 * @param {*} opts 
 */
export const putProject = async (opts) => {
	let project = null
	if (opts) {
		project = await (new Project(opts)).save()
	}
  	return project
}

/**
 * 删除项目
 * @param {项目id} _id 
 */
export const delectProject = async (_id) => {
    return await Project.findByIdAndRemove(_id)
}

/**
 * 修改文章
 * @param {项目id} _id 
 * @param {修改参数} opt 
 */
export const editeProject = async (_id, opt) => {
    return await Project.findByIdAndUpdate(_id, opt)
}

/**
 * 根据id获取项目
 * @param {项目id} _id 
 */
export const getProjectById = async (_id) => {
	return await Project.findById(_id)
}

/**
 * 分页获取项目
 * @param {*} opts 
 */
export const getProjects = async (opts) => {
    const {
		current_page = 1,
		page_size = 50 } = opts
	
	// 过滤条件
	const options = {
		sort: { create_at: -1 },
		page: Number(current_page),
		limit: Number(page_size)
	}

	// 参数
	const querys = {}
	// 查询
	const result = await Project.paginate(querys, options)
	if (result) {
		return {
			pagination: {
				total: result.total,
				current_page: result.page,
				total_page: result.pages,
				page_size: result.limit
			},
			list: result.docs
		}
	} else {
		return false
	}
}
