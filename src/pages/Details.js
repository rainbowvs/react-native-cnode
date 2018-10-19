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
  content: {
    padding: 15
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
        avatar_url: null
      },
      topic: navigation.getParam('topic')
    };
  }

  componentDidMount() {
    this.userDao.getUser()
      .then(res => {
        const userInfo = JSON.parse(res);
        this.setState(() => ({
          userInfo
        }));
      });
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
        navigation.navigate('User', { themeColor, authorName: params.name });
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
    Linking.canOpenURL(data).then(supported => {
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
    const { themeColor, topic, userInfo } = this.state;
    const uri = `http://192.168.1.100:8082/rnwv/topic.html${encodeData({
      themeColor,
      topicId: topic.id,
      accesstoken: userInfo.accesstoken,
      userName: userInfo.loginname
    })}`;
    console.log(uri);
    console.log(userInfo);
    return (
      <View style={{ flex: 1 }}>
        <Header
          title="详情"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <View style={{ flex: 1 }}>
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
