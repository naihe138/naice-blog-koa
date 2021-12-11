// import vuepress from '@vuepress/markdown';
// import markdownItContainer from 'markdown-it-container';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vuepress = require('@vuepress/markdown');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdownItContainer = require('markdown-it-container');
export type TTipItem = {
  className: string;
  text: string;
};
export type TTipsMap = {
  info: TTipItem;
  tip: TTipItem;
  warning: TTipItem;
  danger: TTipItem;
};

const tipsMap: TTipsMap = {
  info: {
    className: 'info',
    text: 'INFO',
  },
  tip: {
    className: 'tip',
    text: 'TIP',
  },
  warning: {
    className: 'warning',
    text: 'WARNONG',
  },
  danger: {
    className: 'danger',
    text: 'DANGER',
  },
};
const vueMd = vuepress({
  lineNumbers: true,
  toc: {},
  afterInstantiate(md) {
    md.use(markdownItContainer, 'tips', {
      validate(params) {
        return params.trim().match(/^warning|info|tip|danger$/);
      },
      render(tokens, idx) {
        const m = tokens[idx].info.trim().match(/^warning|info|tip|danger$/);

        if (tokens[idx].nesting === 1) {
          let tips: TTipItem = {
            className: '',
            text: '',
          };
          if (m) {
            tips = tipsMap[m[0]];
          }
          return `<div class="custom-block ${tips.className}">
            <p class="custom-block-title">${tips.text}</p>
            ${md.utils.escapeHtml(m[1]) || ''}`;
        } else {
          return '</div>\n';
        }
      },
    });
  },
});

export default function transformMarkdown(mdString) {
  return vueMd.render(mdString);
}
