import React, { Fragment } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Base from './Base';
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
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 60,
    width: 90,
    height: 90
  },
  userName: {
    color: '#fff',
    fontSize: 20
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
  avatar_url: 'https://static.hdslb.com/images/akari.jpg',
  accesstoken: null
};

export default class Drawer extends Base {
  constructor(props) {
    super(props);
    const { navOpts: { navigation } } = this.props;
    const userInfo = (navigation.getParam('userInfo') && JSON.parse(navigation.getParam('userInfo'))) || defaultUserInfo;
    this.userDao = new UserDao();
    this.state = {
      themeColor: navigation.getParam('themeColor'),
      userInfo
    };
    this.loginListener = null;
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

  renderItem(themeColor, navName, iconName, titleName) {
    const { navOpts: { navigation } } = this.props;
    const { userInfo } = this.state;
    const callback = () => {
      if (navName === 'Logout') {
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
      } else if (navName === 'Publish') {
        if (!userInfo.accesstoken) {
          Alert.alert(
            '',
            '发表主题需要登录账户',
            [
              { text: '取消', style: 'cancel' },
              {
                text: '马上登录',
                onPress: () => {
                  navigation.navigate('Login', { themeColor });
                }
              }
            ]
          );
        } else {
          navigation.navigate(navName, { themeColor, userInfo });
        }
      } else {
        navigation.navigate(navName, { themeColor });
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
    const { navOpts: { navigation } } = this.props;
    const { themeColor, userInfo } = this.state;
    let navName = 'Login';
    if (userInfo.accesstoken) {
      navName = 'User';
    }
    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate(navName, { themeColor })}
        >
          <Image style={styles.avatar} source={{ uri: userInfo.avatar_url }} />
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
      { navName: 'About', iconName: 'smile', titleName: '关于项目' },
      { navName: 'Logout', iconName: 'logout', titleName: '退出登录' }
    ];
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={[styles.header, { backgroundColor: themeColor }]}>
            {this.renderUser()}
            {/* <View style={styles.credit}>
              <Iconfont style={styles.creditIcon} name="trophy" />
              <Text style={styles.creditCount}>40</Text>
            </View> */}
          </View>
          <View style={styles.list}>
            {
              list.map(v => {
                return this.renderItem(themeColor, v.navName, v.iconName, v.titleName);
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

Drawer.propTypes = {
  navOpts: PropTypes.object.isRequired
};
