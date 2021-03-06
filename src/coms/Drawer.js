import React, { Fragment } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import ListenerCom from './ListenerCom';
import UserDao from '../../expand/dao/UserDao';
import Toast from '../utils/toastUtils';
import XButton from './XButton';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignSelf: 'stretch',
    height: 230,
    backgroundColor: '#80bd01',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    marginVertical: 20,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 60,
    width: 100,
    height: 100
  },
  userName: {
    color: '#fff',
    fontSize: 24
  },
  credit: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  creditIcon: {
    marginRight: 5,
    color: '#fff',
    fontSize: 16
  },
  creditCount: {
    color: '#fff',
    fontSize: 16
  },
  list: {
    marginTop: 10
  },
  item: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50
  },
  itemIcon: {
    color: '#888',
    marginRight: 16,
    fontSize: 30
  },
  itemText: {
    color: '#333',
    fontSize: 22
  }
});

const defaultUserInfo = {
  id: null,
  loginname: '点击头像登录',
  avatar_url: null,
  accesstoken: null
};

export default class Drawer extends ListenerCom {
  constructor(props) {
    super(props);
    const { navOpts: { navigation } } = this.props;
    const themeColor = navigation.getParam('themeColor');
    const userInfo = (navigation.getParam('userInfo') && JSON.parse(navigation.getParam('userInfo'))) || defaultUserInfo;
    this.userDao = new UserDao();
    this.state = {
      themeColor,
      userInfo
    };
    this.loginListener = null;
    this.timer = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.loginListener = DeviceEventEmitter.addListener('CHANGE_LOGIN', params => {
      this.setState(() => ({
        userInfo: params
      }));
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.loginListener) this.loginListener.remove();
  }

  closeDrawerCb(navName, params) {
    const { navOpts: { navigation } } = this.props;
    clearTimeout(this.timer);
    navigation.closeDrawer();
    this.timer = setTimeout(() => {
      navigation.navigate(navName, params);
    }, 570);
  }

  renderItem(themeColor, navName, iconName, titleName) {
    const { userInfo } = this.state;
    const callback = () => {
      switch (navName) {
        case 'Logout':
          Alert.alert(
            '',
            '确定要退出登录吗？',
            [
              { text: '取消', style: 'cancel' },
              {
                text: '确定',
                onPress: () => {
                  this.userDao.removeUser()
                    .then(res => {
                      if (res.success) {
                        this.setState(({
                          userInfo: defaultUserInfo
                        }));
                        Toast('退出成功');
                      }
                    });
                }
              }
            ]
          );
          break;
        case 'XWebview':
          this.closeDrawerCb(navName, { themeColor, uri: 'https://github.com/rainbowvs/react-native-cnode', title: '项目Github地址' });
          break;
        case 'Publish':
          this.closeDrawerCb(navName, { themeColor, userInfo });
          break;
        default:
          this.closeDrawerCb(navName, { themeColor });
          break;
      }
    };
    if (!userInfo.accesstoken && navName === 'Logout') return null;
    return (
      <XButton
        key={navName}
        onPress={callback}
        buttonStyle={styles.item}
        textStyle={styles.itemText}
        iconStyle={[styles.itemIcon, { color: themeColor }]}
        iconName={iconName}
        text={titleName}
      />
    );
  }

  renderUser() {
    const { themeColor, userInfo } = this.state;
    let navName = 'Login';
    let navParams = {
      themeColor
    };
    let userAvatar = <Image style={styles.avatar} source={require('../../statics/imgs/bg_avatar_default.jpg')} />;
    if (userInfo.accesstoken) {
      navName = 'User';
      navParams = { ...navParams, userName: userInfo.loginname };
      userAvatar = <Image style={styles.avatar} source={{ uri: userInfo.avatar_url }} />;
    }
    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.closeDrawerCb(navName, navParams)}
        >
          {userAvatar}
        </TouchableOpacity>
        <Text style={styles.userName}>{userInfo.loginname}</Text>
      </Fragment>
    );
  }

  render() {
    const { themeColor } = this.state;
    const list = [
      { navName: 'Publish', iconName: 'edit-square', titleName: '发表主题' },
      { navName: 'Theme', iconName: 'bg-colors', titleName: '主题颜色' },
      { navName: 'XWebview', iconName: 'smile', titleName: '关于项目' },
      { navName: 'Logout', iconName: 'logout', titleName: '退出登录' }
    ];
    return (
      <View>
        <View style={[styles.header, { backgroundColor: themeColor }]}>
          {this.renderUser()}
        </View>
        <View style={styles.list}>
          {
            list.map(v => {
              return this.renderItem(themeColor, v.navName, v.iconName, v.titleName);
            })
          }
        </View>
      </View>
    );
  }
}

Drawer.propTypes = {
  navOpts: PropTypes.object.isRequired
};
