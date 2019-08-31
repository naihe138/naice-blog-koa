'use strict'
// 项目路由
const config = requir('../config')
const { putProject, delectProject, editeProject, getProjectById, getProjects } = requir('../controllers/project')
const {resError, resSuccess} = requir('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const BASE_PATH = `${config.APP.ROOT_PATH}/project/`
const resolvePath = p => `${BASE_PATH}${p}`

function project (router) {
  // 添加项目
  const ADD_PROJECT_PARAMS = ['title', 'icon', 'view', 'github']
  async function ADD_PROJECT (ctx, next) {
    const opts = ctx.request.body
    await putProject(opts)
    resSuccess({ ctx, message: '添加项目成功'})
  }
  router.put(resolvePath('add'), verifyParams(ADD_PROJECT_PARAMS), ADD_PROJECT)

  // 获取分页项目
  async function GET_PROJECT (ctx, next) {
    const opts = ctx.query || {}
    const res = await getProjects(opts)
    resSuccess({ ctx, message: '查询项目成功', result: res})
  }
  router.get(resolvePath('get'), GET_PROJECT)

  // 根据id获取项目
  async function GET_PROJECT_BY_ID (ctx, next) {
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
  router.get(resolvePath('get/id'), GET_PROJECT_BY_ID)

  // 删除项目
  async function REMOVE_PROJECT (ctx, next) {
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
  router.del(resolvePath('delect/:id'), REMOVE_PROJECT)

  // 编辑项目
  async function EDITE_PROJECT (ctx, next) {
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
  router.post(resolvePath('edite/:id'), EDITE_PROJECT)
}

module.exports = project
