import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import iconfontJson from '../../statics/fonts/iconfont.json';

const Icon = createIconSet(iconfontJson, 'iconfont', 'iconfont.ttf');

export default class IconFont extends Icon {
  static defaultProps = Object.assign({}, Icon.defaultProps, {
    size: 25
  });
}
