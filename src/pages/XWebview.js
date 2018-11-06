import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  WebView,
  BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import Header from '../coms/Header';
import ViewUtils from '../coms/ViewUtils';
import IconFont from '../coms/IconFont';
import Share from '../coms/Share';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  dropdownButton: {
    fontSize: 26,
    color: '#fff',
    marginRight: 10
  },
  dropdownList: {
    height: 103,
    borderRadius: 0,
    borderTopWidth: 0,
    borderRightWidth: 0
  },
  dropdownItem: {
    width: 100,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownItemIcon: {
    marginRight: 10,
    fontSize: 26,
    color: '#333'
  },
  dropdownItemText: {
    fontSize: 20,
    color: '#333'
  }
});

export default class XWebview extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.state = {
      themeColor,
      uri: navigation.getParam('uri'),
      title: navigation.getParam('title'),
      wvNavState: null,
      shareBoardVisible: false
    };
    this.backHandler = null;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackPressed());
  }

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  onBackPressed() {
    // 安卓物理返回键监听
    const { navigation } = this.props;
    const { wvNavState } = this.state;
    if (wvNavState && wvNavState.canGoBack) {
      this.webview.goBack();
      return true;
    }
    navigation.goBack();
    return true;
  }

  dropdownClick(idx, value) {
    if (value.name === 'reload') {
      this.webview.reload();
    } else {
      this.setState({
        shareBoardVisible: true
      });
    }
  }

  renderShareBoard() {
    // 分享面板
    const {
      shareBoardVisible,
      uri,
      title,
      wvNavState
    } = this.state;
    const headerTitle = wvNavState === null ? title : wvNavState.title;
    return (
      <Share
        visible={shareBoardVisible}
        params={{
          url: uri,
          title: '来自rnCnode的分享',
          content: headerTitle || title,
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

  renderRow(rowData) {
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => {}}
        style={styles.dropdownItem}
      >
        <IconFont
          name={rowData.name}
          style={styles.dropdownItemIcon}
        />
        <Text style={styles.dropdownItemText}>{rowData.label}</Text>
      </TouchableOpacity>
    );
  }

  renderDropdownButton() {
    const opts = [
      { label: '刷新', name: 'reload' },
      { label: '分享', name: 'share' }
    ];
    return (
      <ModalDropdown
        options={opts}
        renderRow={rowData => this.renderRow(rowData)}
        renderSeparator={() => <View />}
        dropdownStyle={styles.dropdownList}
        onSelect={(idx, value) => this.dropdownClick(idx, value)}
        showsVerticalScrollIndicator={false}
        adjustFrame={style => ({ ...style, top: style.top - 12 })}
      >
        <IconFont
          name="ellipsis"
          style={styles.dropdownButton}
        />
      </ModalDropdown>
    );
  }

  render() {
    const { navigation } = this.props;
    const {
      themeColor,
      uri,
      title,
      wvNavState
    } = this.state;
    const headerTitle = wvNavState === null ? '' : wvNavState.title;
    console.log('f5');
    return (
      <View style={styles.container}>
        <Header
          title={headerTitle || title}
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => this.onBackPressed())}
          expandButton={ViewUtils.getIconButton('close', { marginLeft: 10, fontSize: 22 }, () => {
            navigation.goBack();
          })}
          rightButton={this.renderDropdownButton()}
        />
        <View style={styles.content}>
          <WebView
            startInLoadingState
            ref={wv => { this.webview = wv; }}
            onMessage={e => this.onMessage(e)}
            onNavigationStateChange={navState => {
              this.setState({
                wvNavState: navState
              });
            }}
            originWhitelist={['*']}
            source={{ uri }}
            renderLoading={() => ViewUtils.getLoading(true, { marginTop: 10 }, themeColor)}
          />
        </View>
        {this.renderShareBoard()}
      </View>
    );
  }
}

XWebview.propTypes = {
  navigation: PropTypes.object.isRequired
};
