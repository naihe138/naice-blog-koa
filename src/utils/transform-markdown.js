const markdownItContainer = require('markdown-it-container')
const vuepress = require('@vuepress/markdown')
const tipsMap = {
  info: {
    className: 'info',
    text: 'INFO'
  },
  tip: {
    className: 'tip',
    text: 'TIP'
  },
  warning: {
    className: 'warning',
    text: 'WARNONG'
  },
  danger: {
    className: 'danger',
    text: 'DANGER'
  }
}
const vueMd = vuepress({
  lineNumbers: true,
  toc: {},
  afterInstantiate: function (md) {
    md.use(markdownItContainer, 'tips', {
      validate(params) {
        return params.trim().match(/^warning|info|tip|danger$/)
      },
      render (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^warning|info|tip|danger$/)
        
        if (tokens[idx].nesting === 1) {
          let tips = {}
          if (m) {
            tips = tipsMap[m[0]]
          }
          return `<div class="custom-block ${tips.className}">
            <p class="custom-block-title">${tips.text}</p>
            ${md.utils.escapeHtml(m[1]) || ''}`;
        } else {
          // closing tag
          return '</div>\n';
        }
      }
    })
  }
})

module.exports = function transformMarkdown(mdString) {
  return vueMd.render(mdString)
}
