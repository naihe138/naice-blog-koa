'use strict'
const crypto = require('crypto')
const config = require('../config')
const User = require('../models/user')

// md5 编码
const md5Decode = pwd => crypto.createHash('md5').update(pwd).digest('hex')

// 初始化管理员账号中间件(当然这些中间件只有用户访问改网址才会执行)
const initAdmin = async () => {
  const username = config.User.defaultUsername
  const password = md5Decode(config.User.defaultPassword)
  let result = await User.find({ username }).exec().catch(err => {
    console.log(500, '服务器内部错误-查找admin错误！')
  })
  console.log(result)
  if (result.length === 0) {
    let user = new User({
      username,
      password,
      role: 100
    })
    await user.save().catch(err => {
      console.log(500, '服务器内部错误-存储admin错误！')
    })
  }
};

module.exports = initAdmin