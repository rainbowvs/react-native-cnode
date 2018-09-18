const fs = require('fs');
const generateIconSetFromCss = require('react-native-vector-icons/lib/generate-icon-set-from-css');
// 和你刚才保存的iconfont字体文件在一起，方便管理
const cssDir = __dirname + '/';
const iconSet = generateIconSetFromCss(cssDir + 'iconfont.css', 'icon-');

fs.writeFileSync(cssDir + 'iconfont.json', iconSet);