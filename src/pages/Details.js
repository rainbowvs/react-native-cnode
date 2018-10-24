import React from 'react';
import {
  View,
  StyleSheet,
  WebView,
  Linking
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Toast from '../utils/toastUtils';
import UserDao from '../../expand/dao/UserDao';
import ViewUtils from '../coms/ViewUtils';
import { encodeData } from '../utils/httpUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.userDao = new UserDao();
    this.state = {
      themeColor,
      userInfo: {
        id: null,
        loginname: null,
        avatar_url: null,
        accesstoken: null
      },
      topicId: navigation.getParam('topicId')
    };
    this.mounted = true;
  }

  componentDidMount() {
    this.userDao.getUser()
      .then(res => {
        if (this.mounted && res) {
          const userInfo = JSON.parse(res);
          this.setState(() => ({
            userInfo
          }));
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onMessage(e) {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    const { data } = e.nativeEvent;
    const { type, msg, params } = JSON.parse(data);
    console.log(type, msg, params);
    if (type === 'message') {
      Toast(msg);
      return false;
    }
    if (params) {
      if (params.name) {
        navigation.push('User', { themeColor, userName: params.name });
        return false;
      }
      if (params.url) {
        this.openLink(params.url);
        return false;
      }
    }
    return false;
  }

  openLink(data) {
    Linking.canOpenURL(data)
      .then(supported => {
        if (!supported) {
          Toast('不支持打开该链接!');
        } else {
          Linking.openURL(data).catch(() => {
            Toast('链接打开失败, 请稍后重试!');
          });
        }
      });
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, topicId, userInfo } = this.state;
    const uri = `http://192.168.1.100:8082/rnwv/topic.html${encodeData({
      themeColor,
      topicId,
      accesstoken: userInfo.accesstoken,
      userName: userInfo.loginname,
      timeStamp: +new Date()
    })}`;
    return (
      <View style={styles.container}>
        <Header
          title="详情"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <View style={styles.content}>
          <WebView
            onMessage={e => this.onMessage(e)}
            originWhitelist={['*']}
            source={{ uri }}
          />
        </View>
      </View>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.object.isRequired
};
