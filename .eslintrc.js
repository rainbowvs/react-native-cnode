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
    "react/jsx-filename-extension": [0], // 文件扩展名
    "comma-dangle": ["error", "never"], // 句末逗号
    'no-console': 'off', // console
    "react/forbid-prop-types": [0], // 类型验证
    "import/no-extraneous-dependencies": [0], // 依赖
    "arrow-body-style": [0], // 箭头函数括号
    "import/prefer-default-export": [0] // 默认导出
  },
  "globals": {
    "__DEV__": true,
    "fetch": true
  }
}