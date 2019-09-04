'use strict'

// 文章路由
// const request = require('request')
const config = require('../config')
const { putArticle, delectArticle, editeArticle, getArticleById,
  getArticles, changeArticleStatus, getAllArticles, likeArticle } = require('../controllers/article')

const {resError, resSuccess} = require('../utils/resHandle')
const verifyParams = require('../middlewares/verify-params')
const resolvePath = p => `${config.APP.ROOT_PATH}/article/${p}`


function articleRoute (router) {
  const ADD_ARTICLE_PARAMS = ['title', 'tag', 'content', 'editContent', 'keyword', 'descript']
  async function ADD_ARTICLE (ctx, next) {
    const opts = ctx.request.body
    let article = await putArticle(opts)
    // 百度推送 seo push
    // request.post({
    //   url: `http://data.zz.baidu.com/urls?site=${config.BAIDU.site}&token=${config.BAIDU.token}`, 
    //   headers: { 'Content-Type': 'text/plain' },
    //   body: `${config.INFO.site}/article/${article._id}`
    // }, (error, response, body) => {
    //   console.log('推送结果：', body)
    // })
    resSuccess({ ctx, message: '添加文章成功'})
  }
  router.put(resolvePath('add'), verifyParams(ADD_ARTICLE_PARAMS), ADD_ARTICLE)

  // 获取分页文章
  async function GET_ARTICLE (ctx, next) {
    const opts = ctx.query || {}
    const res = await getArticles(opts)
    resSuccess({ ctx, message: '查询文章成功', result: res})
  }
  router.get(resolvePath('get'), GET_ARTICLE)

  // 根据id获取文章1
  async function GET_ARTICLE_BY_ID (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await getArticleById(id)
        resSuccess({ ctx, message: '查询文章成功', result: res})
      } catch(err) {
        resError({ ctx, message: '查询文章失败', err})
      }
    } else {
      resError({ ctx, message: '查询文章失败', err: '缺少参数id'})
    }
  }
  router.get(resolvePath('get/:id'), GET_ARTICLE_BY_ID)

  // 删除文章
  async function REMOVE_ARTICLE (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await delectArticle(id)
        resSuccess({ ctx, message: '删除文章成功'})
      } catch(err) {
        resError({ ctx, message: '删除文章失败', err: err})
      }
    } else {
      resError({ ctx, message: '删除文章失败', err: '缺少参数id'})
    }
  }
  router.del(resolvePath('delect/:id'), REMOVE_ARTICLE)
  
  // 编辑文章
  async function EDITE_ARTICLE (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await editeArticle(id, ctx.request.body)
        resSuccess({ ctx, message: '修改文章成功'})
      } catch(err) {
        resError({ ctx, message: '修改文章失败', err: err})
      }
    } else {
      resError({ ctx, message: '修改文章失败', err: '地址缺少参数id'})
    }
  }
  router.post(resolvePath('edite/:id'), EDITE_ARTICLE)
  
  // 获取文章集合
  async function GET_ALL_ARTICLE (ctx, next) {
    const res = await getAllArticles()
    resSuccess({ ctx, message: '获取文章成功', result: res})
  }
  router.get(resolvePath('getAll'), GET_ALL_ARTICLE)

  // 改变文章状态
  async function CHANGE_ARTICLE_STATUS (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await changeArticleStatus(id, ctx.request.body)
        resSuccess({ ctx, message: '修改文章状态成功'})
      } catch(err) {
        resError({ ctx, message: '修改文章状态失败', err: err})
      }
    } else {
      resError({ ctx, message: '修改文章状态失败', err: '地址缺少参数id'})
    }
  }
  router.post(resolvePath('status/:id'), CHANGE_ARTICLE_STATUS)

  // 喜欢文章
  async function LICK_ARTICLE (ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        await likeArticle(id)
        resSuccess({ ctx, message: '修改成功'})
      } catch(err) {
        resError({ ctx, message: '修改失败', err: err})
      }
    } else {
      resError({ ctx, message: '修改失败', err: '地址缺少参数id'})
    }
  }
  router.post(resolvePath('like/:id'), LICK_ARTICLE)
}

module.exports = articleRoute
