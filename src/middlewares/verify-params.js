'use strict'
// 参数校验中间件
const verifyParams = params => async (ctx, next) => {
  console.log(params)
  console.log(11, ctx.request.body)
  // if (errors.length) ctx.throw(412, `${errors.join(', ')} 参数缺失`)
  // await next()
  next()
}

module.exports = verifyParams
