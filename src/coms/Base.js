import React from 'react';
import { DeviceEventEmitter } from 'react-native';

export default class Base extends React.Component {
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
