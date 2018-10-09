import React from 'react';
import {
  View,
  StyleSheet,
  WebView,
  Linking
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Base from '../coms/Base';
import ViewUtils from '../coms/ViewUtils';
import mdstyle from '../../statics/styles/md-style';
import { getTimeInterval } from '../utils/dateUtils';

const styles = StyleSheet.create({
  content: {
    padding: 15,
    backgroundColor: 'white'
  },
  comment: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10
  }
});

export default class Details extends Base {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.state = {
      themeColor,
      list: [],
      isLoading: false,
      topic: navigation.getParam('topic')
    };
  }

  onMessage(e) {
    const { data } = e.nativeEvent;
    const { method, params } = JSON.parse(data);
    if (typeof this[method] === 'function') {
      this[method](params);
    }
  }

  openLink(data) {
    Linking.canOpenURL(data).then(supported => {
      if (!supported) {
        console.log('不支持打开该链接!');
      } else {
        Linking.openURL(data).catch(() => {
          console.error('链接打开失败,请稍后重试!');
        });
      }
    });
  }

  authorNav(data) {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    navigation.navigate('User', { themeColor, authorName: data });
  }

  renderHtml() {
    const { topic } = this.state;
    const meta = '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />';
    const title = `
      <div class="webview-topic-title">
        <h1>${topic.title}</h1>
        <div id="webview-author" style="height: 50px;overflow: hidden;">
          <div style="float: left;">
            <img style="margin-right: 15px;width: 40px;border-radius: 50%;" src="${topic.author.avatar_url}" alt="${topic.author.loginname}" />
          </div>
          <div style="float: left;">
            <p style="margin: 0;">${topic.author.loginname}</p>
            <p style="margin: 0;color: #666;">创建于：${getTimeInterval(topic.create_at)} · ${topic.visit_count}次浏览</p>
          </div>
        </div>
      </div>
    `;
    const scripts = `<script>
      function addHttps() {
        var img = document.getElementsByTagName('img');
        for (var i = 0; i < img.length; i++) {
          var src = img[i].getAttribute("src");
          src = (/^https:|^http:/.test(src)) ? src : ("https:" + src);
          img[i].setAttribute("src", src);
        }
      }
      function postMsg(method, param) {
        window.postMessage(JSON.stringify({params: param, method: method}));
      }
      function authorEvents() {
        var authorEle = document.getElementById('webview-author');
        authorEle.onclick = function() {
          postMsg('authorNav', '${topic.author.loginname}');
        }
      }
      function each(arr, callback) {
        for (var i=0;i<arr.length;i++) {
          callback(arr[i],i);
        }
      }
      function openLink(node, link) {
        var url = node.getAttribute(link);
        node.onclick = function(event) {
          event.preventDefault();
          postMsg('openLink', url);
        };
      }
      function linkEvents() {
        var a = document.getElementsByTagName('a');
        each(a, function(v) {
          openLink(v, 'href');
        });
      }
      addHttps();
      authorEvents();
      linkEvents();
    </script>`;
    return `${meta}${mdstyle}${title}${topic.content}${scripts}`;
  }

  render() {
    const { navigation } = this.props;
    const { themeColor } = this.state;
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
            startInLoadingState
            onMessage={e => this.onMessage(e)}
            renderLoading={() => ViewUtils.getLoading(true, { marginTop: 10 }, themeColor)}
            originWhitelist={['*']}
            source={{ html: this.renderHtml(), baseUrl: '' }}
          />
        </View>
        <View style={[styles.comment, { backgroundColor: themeColor }]}>
          {ViewUtils.getIconButton('comment', {}, () => {
            navigation.navigate('User', { themeColor });
          })}
        </View>
      </View>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.object.isRequired
};
