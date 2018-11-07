import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { getTimeInterval } from '../utils/dateUtils';
import ListenerCom from './ListenerCom';
import ViewUtils from './ViewUtils';
import httpUtils from '../utils/httpUtils';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topic: {
    height: 150,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'center'
  },
  topicTitle: {
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    height: 50,
    fontSize: 18,
    color: '#333',
    lineHeight: 35
  },
  topicBottom: {
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  author: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15
  },
  authorName: {
    color: '#333',
    fontSize: 16
  },
  toTop: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  }
});

export default class Tab extends ListenerCom {
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
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => {
          navigation.navigate('Details', { themeColor, topicId: item.id, topicTitle: item.title });
        }}
      >
        <View style={styles.topic}>
          <View style={styles.topicBottom}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.author}>
                <Image style={styles.avatar} source={{ uri: item.author.avatar_url }} />
                <Text style={styles.authorName}>{item.author.loginname}</Text>
              </View>
              <View>{this.renderTag(item.top, item.good, item.tab)}</View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: themeColor }}>{item.reply_count}</Text>
              <Text>{`  / ${item.visit_count} · ${getTimeInterval(item.last_reply_at)}`}</Text>
            </View>
          </View>
          <Text style={styles.topicTitle} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderTag(top, good, tab) {
    const { themeColor } = this.state;
    const { tabText } = this.fetchParams;
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
    const topLabel = top ? <Text style={{ color: '#80bd01' }}>置顶 </Text> : null;
    const goodLabel = good ? <Text style={{ color: 'red' }}> 精华 </Text> : null;
    return (
      <View style={{ flexDirection: 'row', marginLeft: 15 }}>
        {topLabel}
        {goodLabel}
        { tabText === 'all' && <Text style={{ color: themeColor }}>{` ${tabLabel} `}</Text> }
      </View>
    );
  }

  renderFooter() {
    const { themeColor, isLoaded, isRefreshing } = this.state;
    const { page } = this.fetchParams;
    if (isRefreshing) {
      return null;
    }
    if (page !== 1 || isLoaded) {
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
          ref={f => { this.fl = f; }}
          removeClippedSubviews
          initialNumToRender={8}
          data={list}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() => this.renderFooter()}
          onEndReached={() => this.fetchMoreData()}
          onEndReachedThreshold={0.1}
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
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
        {
          list.length > 0
            && (
              <View style={[styles.toTop, { backgroundColor: themeColor }]}>
                {ViewUtils.getIconButton('totop', {}, () => {
                  this.fl.scrollToIndex({ viewPosition: 0, index: 0 });
                })}
              </View>
            )
        }
      </View>
    );
  }
}

Tab.propTypes = {
  navigation: PropTypes.object.isRequired,
  tabText: PropTypes.string.isRequired
};
