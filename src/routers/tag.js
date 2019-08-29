'use strict'
// 文章路由
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putTag, getTags, editTag, deleteTag } from '../controllers/tag'
import {resError, resSuccess} from '../utils/resHandle'

@controller(`${config.APP.ROOT_PATH}/tag`)
export class tagController {
	@put('add')
	@required({body: ['name']})
	async addTag (ctx, next) {
		const { name, descript = ''} = ctx.request.body
		try {
			const tag = await putTag({name, descript})
			resSuccess({ ctx, message: '添加标签成功', result: tag })
		} catch (err) {
			resError({ ctx, message: '添加标签失败', err: err.message})
		}
	}
  
	@get('get')
	async fetchTags (ctx, next) {
		try{
			let tags = await getTags()
			resSuccess({ ctx, message: '获取标签成功', result: tags })
		} catch (err) {
			resError({ ctx, message: '获取标签失败', err})
		}
	}

	@del('delect/:id')
	async removeTag (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const tag = await deleteTag(id)
				resSuccess({ ctx, message: '删除标签成功'})
			} catch (err) {
				resError({ ctx, message: '删除标签失败', err})
			}
		} else {
			resError({ ctx, message: '删除标签失败', err: '缺少参数id'})
		}
	}

  	@post('edit')
  	@required({body: ['_id', 'name']})
  	async editeTag (ctx, next) {
		try {
			const tag = await editTag(ctx.request.body)
			resSuccess({ ctx, message: '修改标签成功'})
		} catch (err) {
			resError({ ctx, message: '修改标签失败', err})
		}
	}
}
