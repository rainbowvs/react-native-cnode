import { DeviceEventEmitter } from 'react-native';
import BaseCom from './BaseCom';

export default class ListenerCom extends BaseCom {
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('CHANGE_THEME', params => {
      this.setState(() => ({
        themeColor: params
      }));
    });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}
