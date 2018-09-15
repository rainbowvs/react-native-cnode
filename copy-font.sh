# 生成json文件
node statics/fonts/create-iconfont-json.js

# 包自带的字体10几套，占空间，如果你需要那些字体库，把下面这行注释
rm -rf node_modules/react-native-vector-icons/Fonts/*
cp -f statics/fonts/iconfont.ttf node_modules/react-native-vector-icons/Fonts/

# 链接到android和ios
react-native link react-native-vector-icons