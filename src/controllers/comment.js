'use strict'
const Article = require('../models/article')
const Comment = require('../models/comment')
const geoip = require('geoip-lite')

// 添加评论
const putComment = async (ctx, comment) => {
  // 获取ip地址以及物理地理地址
  const ip = (
    ctx.req.headers['x-forwarded-for'] ||
    ctx.req.headers['x-real-ip'] ||
    ctx.req.connection.remoteAddress ||
    ctx.req.socket.remoteAddress ||
    ctx.req.connection.socket.remoteAddress ||
    ctx.req.ip ||
    ctx.req.ips[0]).replace('::ffff:', '')

  comment.ip = ip || '14.215.177.38'
  comment.agent = ctx.headers['user-agent'] || comment.agent

  const ip_location = geoip.lookup(comment.ip)

  if (ip_location) {
    comment.city = ip_location.city,
      comment.range = ip_location.range,
      comment.country = ip_location.country
  }

  let permalink = 'https://blog.naice.me/about'
  let article = await Article.findById({ _id: comment.post_id })
  article.meta.comments += 1
  permalink = `https://blog.naice.me/article/${article._id}`
  // 发布评论
  const res = await (new Comment(comment)).save()
  await article.save()
  res.permalink = permalink
  return res
}

// 删除评论
const delectComment = async (_id) => {
  return await Comment.findByIdAndRemove(_id)
}

// 修改评论
const editeComment = async (_id, opt) => {
  return await Comment.findByIdAndUpdate(_id, opt)
}

// 喜欢评论
const likeComment = async (_id) => {
  let res = await Comment.findById(_id)
  if (res) {
    // 每次请求，views 都增加一次
    res.likes += 1
    res = await res.save()
  }
  return res
}

// 根据文章id获取评论
const getComment = async (opts = {}) => {
  let { sort = -1, current_page = 1, page_size = 10, keyword = '', post_id, state } = opts
  let result = {}
  sort = Number(sort)

  // 过滤条件
  const options = {
    sort: { _id: sort },
    page: Number(current_page),
    limit: Number(page_size)
  }

  // 排序字段
  if ([1, -1].includes(sort)) {
    options.sort = { _id: sort }
  } else if (Object.is(sort, 2)) {
    options.sort = { likes: -1 }
  };

  // 查询参数
  let querys = {}

  // 查询各种状态
  if (state && ['0', '1', '2'].includes(state)) {
    querys.state = state;
  };

  // 如果是前台请求，则重置公开状态和发布状态
  // if (!authIsVerified(ctx.request)) {
  // 	querys.state = 1
  // };

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword);
    querys['$or'] = [
      { 'content': keywordReg },
      { 'author.name': keywordReg },
      { 'author.email': keywordReg }
    ]
  }

  // 通过post-id过滤
  if (!Object.is(post_id, undefined)) {
    querys.post_id = post_id
  }
  // 请求评论
  const comments = await Comment.paginate(querys, options)

  if (comments) {
    result = {
      pagination: {
        total: comments.total,
        current_page: options.page,
        total_page: comments.pages,
        per_page: options.limit
      },
      data: comments.docs
    }
  }
  return result
}

module.exports = {
  putComment,
  delectComment,
  editeComment,
  likeComment,
  getComment
}
