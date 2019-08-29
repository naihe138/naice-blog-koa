'use strict'

// 项目路由
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putProject, delectProject, 
          editeProject, getProjectById, 
          getProjects } from '../controllers/project'

import {resError, resSuccess} from '../utils/resHandle'

@controller(`${config.APP.ROOT_PATH}/project`)
export class articleController {
  // 添加项目
  @put('add')
  @required({body: ['title', 'icon', 'view', 'github']})
  async addProject (ctx, next) {
    const opts = ctx.request.body
    let article = await putProject(opts)
    resSuccess({ ctx, message: '添加项目成功'})
  }
  // 获取分页项目
  @get('get')
  async getProject (ctx, next) {
    const opts = ctx.query || {}
    const res = await getProjects(opts)
    resSuccess({ ctx, message: '查询项目成功', result: res})
  }
  // 根据id获取项目
  @get('get/:id')
  async getProjectId (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await getProjectById(id)
        resSuccess({ ctx, message: '查询项目成功', result: res})
      } catch(err) {
        resError({ ctx, message: '查询项目失败', err})
      }
    } else {
      resError({ ctx, message: '查询项目失败', err: '缺少参数id'})
    }
  }
  // 删除项目
  @del('delect/:id')
  async removeProject (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await delectProject(id)
        resSuccess({ ctx, message: '删除项目成功'})
      } catch(err) {
        resError({ ctx, message: '删除项目失败', err: err})
      }
    } else {
      resError({ ctx, message: '删除项目失败', err: '缺少参数id'})
    }
  }
  // 编辑项目
  @post('edite/:id')
  async toEditeProject (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await editeProject(id, ctx.request.body)
        resSuccess({ ctx, message: '修改项目成功'})
      } catch(err) {
        resError({ ctx, message: '修改项目失败', err: err})
      }
    } else {
      resError({ ctx, message: '修改项目失败', err: '地址缺少参数id'})
    }
  }
}
