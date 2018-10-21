import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  WebView,
  DeviceEventEmitter,
  ScrollView,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Toast from '../utils/toastUtils';
import ViewUtils from '../coms/ViewUtils';
import { encodeData } from '../utils/httpUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  unlogined: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reminder: {
    fontSize: 18,
    color: '#606775',
    marginBottom: 15
  },
  loginButton: {
    borderRadius: 5
  },
  loginButtonText: {
    width: 150,
    height: 50,
    fontSize: 20,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});

export default class Publish extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    const userInfo = navigation.getParam('userInfo');
    this.state = {
      themeColor,
      userInfo
    };
    this.loginListener = null;
  }

  componentDidMount() {
    this.loginListener = DeviceEventEmitter.addListener('CHANGE_LOGIN', params => {
      this.setState(() => ({
        userInfo: params
      }));
    });
  }

  componentWillUnmount() {
    if (this.loginListener) this.loginListener.remove();
  }

  renderContent() {
    const { navigation } = this.props;
    const { themeColor, userInfo } = this.state;
    const uri = `http://192.168.1.100:8082/rnwv/publish.html${encodeData({
      themeColor
    })}`;
    if (!userInfo.accesstoken) {
      return (
        <View style={styles.unlogined}>
          <Text style={styles.reminder}>发表主题需要登录账户</Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: themeColor }]}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Login', { themeColor })}
          >
            <Text style={styles.loginButtonText}>立即登录</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ width: 100, height: 500, backgroundColor: '#000' }} />
          <WebView
            style={{ flex: 1, height: 500 }}
            onMessage={e => this.onMessage(e)}
            originWhitelist={['*']}
            source={{ uri }}
          />
        </ScrollView>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="发表主题"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        {this.renderContent()}
      </View>
    );
  }
}

Publish.propTypes = {
  navigation: PropTypes.object.isRequired
};
