import React from 'react';
import {
  View,
  StyleSheet,
  WebView
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Share from '../coms/Share';
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
      shareBoardVisible: false,
      topicId: navigation.getParam('topicId'),
      topicTitle: navigation.getParam('topicTitle')
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
    if (type === 'message') {
      Toast(msg);
      return false;
    }
    if (params) {
      if (params.name) {
        navigation.push('User', { themeColor, userName: params.name });
        return false;
      }
      if (params.uri) {
        this.openLink(params.uri, params.title);
        return false;
      }
    }
    return false;
  }

  openLink(uri, title) {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    navigation.navigate('XWebview', { themeColor, uri, title });
  }

  renderShareBoard(topicId, topicTitle) {
    // 分享面板
    const { shareBoardVisible } = this.state;
    return (
      <Share
        visible={shareBoardVisible}
        params={{
          url: `https://cnodejs.org/topic/${topicId}`,
          title: 'cnode社区',
          content: topicTitle,
          img: undefined
        }}
        onClose={() => {
          this.setState({
            shareBoardVisible: false
          });
        }}
      />
    );
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, topicId, topicTitle, userInfo } = this.state;
    const uri = `http://192.168.1.100:8082/rnwv/topic.html${encodeData({
      themeColor,
      topicId,
      accesstoken: userInfo.accesstoken,
      userName: userInfo.loginname
    })}`;
    return (
      <View style={styles.container}>
        <Header
          title={topicTitle}
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
          rightButton={ViewUtils.getIconButton('share', { marginRight: 10 }, () => {
            this.setState({
              shareBoardVisible: true
            });
          })}
        />
        <View style={styles.content}>
          <WebView
            onMessage={e => this.onMessage(e)}
            originWhitelist={['*']}
            source={{ uri }}
          />
        </View>
        {this.renderShareBoard(topicId, topicTitle)}
      </View>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.object.isRequired
};
