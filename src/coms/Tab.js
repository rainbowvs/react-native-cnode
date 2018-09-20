import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import DataRepository from '../../expand/dao/DataRepository';
import { getTimeInterval, formatDateTime } from '../utils/dateUtils';
import Base from './Base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e1e1'
  },
  topic: {
    backgroundColor: '#fff',
    marginBottom: 10
  },
  topicTop: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  topicHeader: {
    height: 20,
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
    width: Dimensions.get('window').width * 0.2916,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topicContent: {
    paddingTop: 5
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
    const { themeColor, tabText } = this.props;
    this.state = {
      list: [],
      tabText,
      themeColor
    };
    this.dataRepository = new DataRepository();
  }

  componentDidMount() {
    super.componentDidMount();
    const { tabText } = this.state;
    this.dataRepository.fetNetRepository(`https://cnodejs.org/api/v1/topics?tab=${tabText}&mdrender=false`).then((res) => {
      if (res.success) {
        this.setState(() => ({
          list: res.data
        }));
      }
    });
  }

  renderItem = (item) => {
    const { themeColor } = this.state;
    return (
      <View style={styles.topic}>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            //
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
            //
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

  renderTag = (top, good, tab) => {
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

  render() {
    const { list } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={list}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </View>
    );
  }
}

Tab.propTypes = {
  themeColor: PropTypes.string.isRequired,
  tabText: PropTypes.string.isRequired
};
