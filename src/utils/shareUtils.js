/**
 * 原生桥接, 暴露分享方法
 * -----------------------------------------------------
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {string} url 链接
 * @param {string|resource} img 图片
 * @param {number} platform 平台
 * @callback cb(msg) 回调(分享成功, 分享失败, 取消分享)
 * share(title, content, url, img, platform, cb)
 * -----------------------------------------------------
 * @param {number} platform 平台
 * @callback cb(res) 回调[res.code: 0成功、1失败、2取消]
 * authLogin(platform, res)
 */

import { NativeModules } from 'react-native';

export const SHARE_PLATFORM = {
  QQ: 0,
  SINA: 1,
  WECHAT: 2,
  WECHATMOMENT: 3,
  QQZONE: 4,
  FACEBOOK: 5
};


export default NativeModules.sharemodule;
