# react-native-cnode
cnode of react-native

基于ReactNative构建第三方cnode社区-移动端

## 体验
- [Android](http://rainbowvs.com/rnCnode/rnCnode.apk)
- IOS正在赶工，延迟推出

## 功能
> 以下功能均基于[社区API](https://cnodejs.org/api)实现, 近期转外国服务器, 访问可能会略慢

由于社区禁用收藏功能接口, 暂时无法实现
- [x] 话题首页
- [x] 话题详情
- [x] 新建话题
- [ ] 编辑话题
- [x] 分享话题(目前仅提供QQ平台, 微信和微博正在审核)
- [x] 新建评论
- [x] 为评论点赞
- [x] 用户详情
- [x] 登录(扫二维码和输入accesstoken均可)
- [ ] 收藏相关
- [ ] 消息相关

## 计划
> 暂时只做简单优化, 之后抽出空闲时间慢慢补上

* 将缺少的功能补全
* 兼容IOS
* 进一步完善APP, 网络请求优化
* CodePush
* 引入Redux
  
## 总结
作为RN的入门项目, 通过该项目基本掌握RN的开发流程, 积累一定的RN开发经验

开发过程较为曲折

* 缺少原生开发经验
  * 安卓Gradle版本存在冲突, 查找各方面文档
  * 友盟的分享SDK, 文档实在写的不怎么样, 多次踩坑上网搜解决办法
* 插件BUG多
  * 由于第三方插件缺少维护, 开放过程遇到不少阻碍, 如Markdown渲染(多级列表渲染报错、性能差), 无法正常使用, 不得不考虑用厚重的Webview渲染
* 官方组件存在问题
  * navigation2.x抽屉自定义导航并未提供开关回调, 开关与跳转导航同时进行会产生冲突, 导航会强制返回
  * FlatList快速滑动会产生瞬间空白, 即使根据文档进行优化, 使用getItemLayout

## 交流
:hammer: 欢迎提issue互相交流学习