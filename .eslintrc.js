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
    'no-console': 'off' // console
  },
  "globals": {
    "__DEV__": true,
    "fetch": true
  }
}