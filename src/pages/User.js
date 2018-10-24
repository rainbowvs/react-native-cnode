import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
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

const AVATAR_SIZE = 120;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stickySection: {
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
    top: 0,
    left: 0,
    paddingLeft: 10,
    height: STICKY_HEADER_HEIGHT,
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
  sectionSpeakerText: {
    color: '#fff',
    fontSize: 24,
    paddingVertical: 5
  },
  credits: {
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
    this.willBlurSubscription = null;
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
        Toast(err);
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
      <View key={type} style={{ flex: 1, alignSelf: 'stretch' }}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => this.tabClick(type, typeName)}
          style={{ flex: 1, height: 60, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
        >
          <Text style={{ fontSize: 20, textAlignVertical: 'center' }}>{label}</Text>
          <IconFont style={{ color: '#aaa' }} name={`${this.state[typeName] ? 'up' : 'down'}`} />
        </TouchableOpacity>
        {this.state[typeName] && this.renderList(userInfo, type)}
      </View>
    );
  }

  renderList(userInfo, type) {
    let list = null;
    if (userInfo) {
      if (type === 0) {
        list = userInfo.recent_replies.map(v => {
          return this.renderItem(v);
        });
      } else {
        list = userInfo.recent_topics.map(v => {
          return this.renderItem(v);
        });
      }
      list = list.length === 0 ? this.renderEmptyItem() : list;
    } else {
      list = this.renderEmptyItem();
    }
    return list;
  }

  renderEmptyItem() {
    return (
      <View style={{ paddingHorizontal: 10, flex: 1, height: 80, justifyContent: 'center', backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#fff' }}>
        <Text style={{ fontSize: 16, textAlign: 'center', textAlignVertical: 'center' }}>没有更多数据</Text>
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
        style={{ flex: 1, height: 80, justifyContent: 'center', backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#fff' }}
        onPress={() => {
          navigation.push('Details', { themeColor, topicId: item.id });
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
          <Image style={{ borderRadius: 20, width: 40, height: 40 }} source={{ uri: item.author.avatar_url }} />
          <View style={{ marginLeft: 10, flex: 1, alignSelf: 'stretch' }}>
            <Text style={{ fontSize: 18, color: '#333' }} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#666', textAlignVertical: 'center' }}>{item.author.loginname}</Text>
              <Text style={{ fontSize: 16, color: '#777', textAlignVertical: 'center' }}>{getTimeInterval(item.last_reply_at)}</Text>
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

          renderBackground={() => (
            <View key="background">
              {/* 背景 */}
              <Image
                style={styles.backgroundImg}
                source={require('../../statics/imgs/bg_user.jpg')}
              />
              <View style={styles.backgroundMask} />
            </View>
          )}

          renderForeground={() => {
            const avatarSource = userInfo === null ? require('../../statics/imgs/bg_avatar_default.jpg') : { uri: userInfo.avatar_url };
            return (
              <View key="parallax-header" style={styles.parallaxHeader}>
                {/* 头像, 用户名 */}
                <Image
                  style={styles.avatar}
                  source={avatarSource}
                />
                <Text style={styles.sectionSpeakerText}>
                  {userName}
                </Text>
                <Text style={{ fontSize: 18, color: '#fff' }}>
                  注册时间：
                  {userInfo === null ? 'loading' : userInfo.create_at.substring(0, 10)}
                </Text>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={0.2}
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <IconFont
                      name="github-fill"
                      style={{ marginRight: 10, fontSize: 26, color: '#fff' }}
                    />
                    <Text style={{ fontSize: 20, color: '#fff' }}>
                      {userInfo === null ? 'loading' : userInfo.githubUsername}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.credits}>
                    <IconFont
                      name="trophy"
                      style={styles.creditsIcon}
                    />
                    <Text style={styles.creditsCount}>
                      {userInfo === null ? 0 : userInfo.score}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}

          renderStickyHeader={() => (
            <View key="sticky-header" style={styles.stickySection}>
              {/* 标题 */}
              <Text style={styles.stickySectionText}>{userName}</Text>
            </View>
          )}

          renderFixedHeader={() => (
            <View key="fixed-header" style={styles.fixedSection}>
              {/* 返回键 */}
              {ViewUtils.getIconButton('arrowleft', {}, () => {
                navigation.goBack();
              })}
            </View>
          )}
        >
          {tabs.map(v => {
            return this.renderTab(userInfo, v.type, v.label);
          })}
        </ParallaxScrollView>
      </View>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.object.isRequired
};
