import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Toast from '../utils/toastUtils';
import IconFont from '../coms/IconFont';
import ViewUtils from '../coms/ViewUtils';
import httpUtils from '../utils/httpUtils';
import { getTimeInterval } from '../utils/dateUtils';

const window = Dimensions.get('window');

const IOS = Platform.OS === 'ios';
const STATUSBAR_HEIGHT = IOS ? 20 : StatusBar.currentHeight;

const AVATAR_SIZE = 120;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 50 + STATUSBAR_HEIGHT;


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stickySection: {
    paddingTop: STATUSBAR_HEIGHT,
    height: STICKY_HEADER_HEIGHT,
    width: window.width,
    justifyContent: 'center'
  },
  stickySectionText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22
  },
  fixedSection: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT,
    left: 0,
    paddingLeft: 10,
    height: STICKY_HEADER_HEIGHT - STATUSBAR_HEIGHT,
    justifyContent: 'center'
  },
  backgroundMask: {
    position: 'absolute',
    top: 0,
    width: window.width,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: PARALLAX_HEADER_HEIGHT
  },
  backgroundImg: {
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  parallaxHeader: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    paddingVertical: 5
  },
  githubAndCredits: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  githubAndCreditsTouchAble: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  credits: {
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
  },
  creditsIcon: {
    color: '#fff',
    fontSize: 24
  },
  creditsCount: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 20
  },
  githubIcon: {
    marginRight: 10,
    fontSize: 26,
    color: '#fff'
  },
  githubName: {
    fontSize: 20,
    color: '#fff'
  },
  registerDate: {
    fontSize: 16,
    color: '#fff'
  },
  tab: {
    flex: 1,
    width: window.width
  },
  tabTouchable: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  tabLabel: {
    fontSize: 20,
    textAlignVertical: 'center'
  },
  tabIcon: {
    fontSize: 16,
    color: '#aaa'
  },
  itemTouchable: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  itemAvatar: {
    borderRadius: 20,
    width: 40,
    height: 40
  },
  itemTopic: {
    marginLeft: 10,
    flex: 1,
    width: window.width
  },
  itemTopicTitle: {
    fontSize: 18,
    color: '#333'
  },
  itemTopicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemAuthorName: {
    fontSize: 16,
    color: '#666',
    textAlignVertical: 'center'
  },
  itemTopicReplyDate: {
    fontSize: 16,
    color: '#777',
    textAlignVertical: 'center'
  },
  emptyItem: {
    flex: 1,
    paddingHorizontal: 10,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  emptyItemText: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default class User extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    const userName = navigation.getParam('userName');
    this.state = {
      themeColor,
      userName,
      userInfo: null,
      loading: false,
      showRecentReplies: false,
      showrecentTopics: false
    };
    this.cancelable = null;
    this.mounted = true;
  }

  componentDidMount() {
    this.getUserInfo();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.cancelable) this.cancelable.cancel();
  }

  getUserInfo() {
    const { userName } = this.state;
    if (this.mounted) {
      this.setState(() => ({
        loading: true
      }));
    }
    this.cancelable = httpUtils.get(`https://cnodejs.org/api/v1/user/${userName}`);
    this.cancelable.promise
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          this.setState(() => ({
            loading: false
          }));
        }
        if (this.mounted && res.success) {
          this.setState(() => ({
            userInfo: { ...res.data }
          }));
        } else if (!res.success) {
          Toast(res.error_msg);
        }
      })
      .catch(err => {
        if (!err.isCanceled) Toast(err);
        if (this.mounted) {
          this.setState(() => ({
            loading: false
          }));
        }
      });
  }

  tabClick(type, typeName) {
    switch (type) {
      case 0:
        this.setState(prevState => ({
          showRecentReplies: !prevState[typeName]
        }));
        break;
      case 1:
        this.setState(prevState => ({
          showrecentTopics: !prevState[typeName]
        }));
        break;
      default:
        break;
    }
  }

  renderTab(userInfo, type, label) {
    const typeName = type === 0 ? 'showRecentReplies' : 'showrecentTopics';
    return (
      <View key={type} style={styles.tab}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => this.tabClick(type, typeName)}
          style={styles.tabTouchable}
        >
          <Text style={styles.tabLabel}>{label}</Text>
          <IconFont style={styles.tabIcon} name={`${this.state[typeName] ? 'up' : 'down'}`} />
        </TouchableOpacity>
        {this.state[typeName] && this.renderList(userInfo, type)}
      </View>
    );
  }

  renderList(userInfo, type) {
    let list = null;
    if (userInfo) {
      if (type === 0) {
        list = userInfo.recent_replies.map(v => this.renderItem(v));
      } else {
        list = userInfo.recent_topics.map(v => this.renderItem(v));
      }
      list = list.length === 0 ? this.renderEmptyItem() : list;
    } else {
      list = this.renderEmptyItem();
    }
    return list;
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>没有更多数据</Text>
      </View>
    );
  }

  renderItem(item) {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.2}
        style={styles.itemTouchable}
        onPress={() => {
          navigation.push('Details', { themeColor, topicId: item.id });
        }}
      >
        <View style={styles.itemContainer}>
          <Image style={styles.itemAvatar} source={{ uri: item.author.avatar_url }} />
          <View style={styles.itemTopic}>
            <Text style={styles.itemTopicTitle} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
            <View style={styles.itemTopicInfo}>
              <Text style={styles.itemAuthorName}>{item.author.loginname}</Text>
              <Text style={styles.itemTopicReplyDate}>{getTimeInterval(item.last_reply_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, userName, userInfo } = this.state;
    const tabs = [
      {
        label: '最近回复',
        type: 0,
        typeName: 'showRecentReplies',
        listName: 'recent_replies'
      },
      {
        label: '最新发布',
        type: 1,
        typeName: 'showrecentTopics',
        listName: 'recent_topics'
      }
    ];
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          backgroundColor={themeColor}
          contentBackgroundColor="#fff"
          contentContainerStyle={{ flex: 1 }}
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundSpeed={10}
          renderBackground={() => {
            /* 背景 */
            return (
              <View key="background">
                <Image
                  style={styles.backgroundImg}
                  source={require('../../statics/imgs/bg_user.jpg')}
                />
                <View style={styles.backgroundMask} />
              </View>
            );
          }}
          renderForeground={() => {
            /* 头像 用户名 */
            const avatarSource = userInfo === null
              ? require('../../statics/imgs/bg_avatar_default.jpg')
              : { uri: userInfo.avatar_url };
            return (
              <View key="parallax-header" style={styles.parallaxHeader}>
                <Image
                  style={styles.avatar}
                  source={avatarSource}
                />
                <Text style={styles.userName}>
                  {userName}
                </Text>
                <View style={styles.githubAndCredits}>
                  <View style={styles.credits}>
                    <IconFont
                      name="trophy"
                      style={styles.creditsIcon}
                    />
                    <Text style={styles.creditsCount}>
                      {userInfo === null ? 0 : userInfo.score}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.2}
                    onPress={() => {
                      if (userInfo) {
                        navigation.navigate('XWebview', { themeColor, uri: `https://github.com/${userInfo.githubUsername}`, title: `Github / ${userInfo.githubUsername}` });
                      } else {
                        Toast('正在获取数据...');
                      }
                    }}
                    style={styles.githubAndCreditsTouchAble}
                  >
                    <IconFont
                      name="github-fill"
                      style={styles.githubIcon}
                    />
                    <Text style={styles.githubName}>
                      {userInfo === null ? 'loading' : userInfo.githubUsername}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.registerDate}>
                  注册时间：
                  {userInfo === null ? 'loading' : userInfo.create_at.substring(0, 10)}
                </Text>
              </View>
            );
          }}
          renderStickyHeader={() => {
            /* 标题名 */
            return (
              <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{userName}</Text>
              </View>
            );
          }}
          renderFixedHeader={() => {
            /* 返回键 */
            return (
              <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getIconButton('arrowleft', {}, () => {
                  navigation.goBack();
                })}
              </View>
            );
          }}
        >
          {tabs.map(v => this.renderTab(userInfo, v.type, v.label))}
        </ParallaxScrollView>
      </View>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.object.isRequired
};
