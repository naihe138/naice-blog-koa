/* 输出公共解析器 */

export const resError = ({ ctx, message = '请求失败', err = null }) => {
	ctx.body = { code: 0, message, debug: err }
}

export const resSuccess = ({ ctx, message = '请求成功', result = null }) => {
	ctx.body = { code: 1, message, result }
}
