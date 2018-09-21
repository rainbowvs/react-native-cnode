module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {},
  "plugins": [
    "react",
    "react-native"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "linebreak-style": ["off", "windows"], // 换行
    "react/jsx-filename-extension": 0, // 文件扩展名
    "comma-dangle": ["error", "never"], // 句末逗号
    'no-console': 0, // console
    "react/forbid-prop-types": 0, // 类型验证
    "import/no-extraneous-dependencies": 0, // 依赖
    "arrow-body-style": 0, // 箭头函数返回值格式
    "arrow-parens": ["error", "as-needed"], // 箭头函数参数格式
    "import/prefer-default-export": 0, // 默认导出
    "no-restricted-syntax": 0, //不允许指定（即用户定义）语法。
    "guard-for-in": 0 // for in 遍历
  },
  "globals": {
    "__DEV__": true,
    "fetch": true
  }
}