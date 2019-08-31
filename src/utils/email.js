'use strict'
const config = require('../config')
const nodemailer = require('nodemailer')
let clientIsValid = false

const transporter = nodemailer.createTransport({
  service: config.EMAIL.service,
  secure: true,
  secureConnection: true,
  port: 465,
  auth: {
    user: config.EMAIL.account,
    pass: config.EMAIL.password
  }
})

const verifyClient = () => {
  transporter.verify((error, success) => {
    if (error) {
      clientIsValid = false;
      console.warn('邮件客户端初始化连接失败，请检查代码')
    } else {
      clientIsValid = true;
      console.log('邮件客户端初始化连接成功，随时可发送邮件')
    }
  })
}

verifyClient()

const sendMail = mailOptions => {
  if (!clientIsValid) {
    console.warn('由于未初始化成功，邮件客户端发送被拒绝')
    return false;
  }
	mailOptions.from = '"何文林" <370215230@qq.com>'
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.warn('邮件发送失败', error)
    console.log('邮件发送成功', info.messageId, info.response)
  })
}

module.exports = {
  sendMail,
  nodemailer,
  transporter
}
