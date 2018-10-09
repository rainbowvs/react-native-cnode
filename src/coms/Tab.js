import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { getTimeInterval, formatDateTime } from '../utils/dateUtils';
import Base from './Base';
import ViewUtils from './ViewUtils';
import httpUtils from '../utils/httpUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e1e1'
  },
  topic: {
    backgroundColor: '#fff'
  },
  topicTop: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  topicHeader: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topicTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topicTag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 5
  },
  topicTagText: {
    color: '#fff'
  },
  topicInfo: {
    width: Dimensions.get('window').width * 0.3333,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topicContent: {
    height: 115
  },
  topicTitle: {
    fontSize: 18,
    color: '#333',
    lineHeight: 35
  },
  topicDetail: {
    lineHeight: 20
  },
  topicBottom: {
    padding: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  author: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  authorName: {
    color: '#333'
  }
});

export default class Tab extends Base {
  constructor(props) {
    super(props);
    const { tabText, themeColor } = props;
    this.fetchParams = {
      url: 'https://cnodejs.org/api/v1/topics',
      page: 1,
      limit: 8,
      mdrender: true,
      isLoading: false,
      tabText
    };
    this.state = {
      themeColor,
      list: [],
      isLoaded: false,
      isRefreshing: false
    };
    this.cancelable = null;
  }

  fetchData() {
    this.fetchParams.isLoading = true;
    const {
      url,
      page,
      tabText,
      limit,
      mdrender
    } = this.fetchParams;
    return httpUtils.get(url, {
      tab: tabText,
      page,
      limit,
      mdrender
    });
  }

  freshData() {
    if (this.fetchParams.isLoading || this.state.isRefreshing) {
      return;
    }
    this.fetchParams.page = 1;
    this.setState(() => ({
      isRefreshing: true
    }));
    this.cancelable = this.fetchData();
    this.cancelable.promise
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          this.setState(() => ({
            list: res.data,
            isRefreshing: false
          }));
          this.fetchParams.page += 1;
          this.fetchParams.isLoading = false;
        }
      })
      .catch(err => {
        this.setState(() => ({
          isRefreshing: false
        }));
        this.fetchParams.isLoading = false;
      });
  }

  fetchMoreData() {
    if (this.fetchParams.isLoading || this.state.isRefreshing) {
      return;
    }
    this.cancelable = this.fetchData();
    this.cancelable.promise
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          this.setState(prevState => ({
            list: prevState.list.concat(res.data),
            isLoaded: true
          }), () => {
            this.fetchParams.page += 1;
            this.fetchParams.isLoading = false;
          });
        }
      })
      .catch(err => {
        this.setState(() => ({
          isLoaded: false
        }));
        this.fetchParams.isLoading = false;
      });
  }

  componentDidMount() {
    super.componentDidMount();
    this.freshData();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.cancelable) this.cancelable.cancel();
  }

  renderItem(item) {
    const { themeColor } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.topic}>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            navigation.navigate('Details', { themeColor, topic: item });
          }}
        >
          <View style={styles.topicTop}>
            <View style={styles.topicHeader}>
              {this.renderTag(item.top, item.good, item.tab)}
              <View style={styles.topicInfo}>
                <Text style={{ color: themeColor }}>
                  {item.reply_count}
                </Text>
                <Text>/</Text>
                <Text>{item.visit_count}</Text>
                <Text>·</Text>
                <Text>{getTimeInterval(item.last_reply_at)}</Text>
              </View>
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
              <Text style={styles.topicDetail} ellipsizeMode="tail" numberOfLines={4}>{item.content}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            // navigation.navigate('User');
          }}
        >
          <View style={styles.topicBottom}>
            <View style={styles.author}>
              <Image style={styles.avatar} source={{ uri: item.author.avatar_url }} />
              <Text style={styles.authorName}>{item.author.loginname}</Text>
            </View>
            <View>
              <Text>
                创建于：
                {formatDateTime(item.create_at)}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderTag(top, good, tab) {
    const { themeColor } = this.state;
    let tabLabel = null;
    switch (tab) {
      case 'share':
        tabLabel = '分享';
        break;
      case 'ask':
        tabLabel = '问答';
        break;
      case 'job':
        tabLabel = '招聘';
        break;
      default:
        tabLabel = null;
        break;
    }
    const topLabel = top === true ? '置顶' : tabLabel;
    const goodView = good === true ? <Text style={styles.topicTagText}>精华</Text> : null;
    return (
      <View style={styles.topicTagContainer}>
        {
          topLabel
          && (
            <View
              style={[styles.topicTag, { backgroundColor: themeColor }]}
            >
              <Text style={styles.topicTagText}>{topLabel}</Text>
            </View>
          )
        }
        {
          goodView
          && <View style={[styles.topicTag, { backgroundColor: themeColor }]}>{goodView}</View>
        }
      </View>
    );
  }

  renderSeCom() {
    return (
      <View style={{ alignSelf: 'stretch', height: 10 }} />
    );
  }

  renderFooter() {
    const { themeColor, isLoaded } = this.state;
    const { page } = this.fetchParams;
    if (page !== 1) {
      return (
        ViewUtils.getLoading(true, {}, themeColor)
      );
    }
    if (isLoaded) {
      return (
        ViewUtils.getLoading(true, {}, themeColor)
      );
    }
    return null;
  }

  render() {
    const {
      list,
      isRefreshing,
      themeColor
    } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={list}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={({ item }) => this.renderItem(item)}
          onEndReached={() => this.fetchMoreData()}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={this.renderSeCom}
          ListFooterComponent={() => this.renderFooter()}
          getItemLayout={(data, index) => ({
            length: 216,
            offset: 226 * index,
            index
          })}
          refreshControl={(
            <RefreshControl
              tintColor={themeColor}
              colors={[themeColor]}
              refreshing={isRefreshing}
              onRefresh={() => this.freshData()}
            />
          )}
        />
      </View>
    );
  }
}

Tab.propTypes = {
  navigation: PropTypes.object.isRequired,
  tabText: PropTypes.string.isRequired
};
