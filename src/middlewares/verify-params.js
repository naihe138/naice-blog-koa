'use strict'
// 参数校验中间件
const verifyParams = params => async (ctx, next) => {
  const { body } = ctx.request
  if (params && params.length > 0) {
    let errors = []
    for (let i = 0; i < params.length; i++) {
      let k = params[i]
      if (!body.hasOwnProperty(k)) {
        errors.push(k)
      }
    }
    if (errors.length > 0) {
      ctx.throw(412, `${errors.join(', ')} 参数缺失`)
    }
  }
  await next()
}

module.exports = verifyParams
