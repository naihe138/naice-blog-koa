module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?:[ ]?(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 特性增加
        'fix', // 功能修复
        'docs', // 文档维护
        'style', // 样式维护
        'refactor', // 重构功能
        'test', // 增加测试用例
        'chore', // 其他事务
        'wip', // 待完成功能
      ],
    ],
  },
};
