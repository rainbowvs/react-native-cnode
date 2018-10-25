import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  WebView
} from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import Header from '../coms/Header';
// import Toast from '../utils/toastUtils';
import ViewUtils from '../coms/ViewUtils';
import IconFont from '../coms/IconFont';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
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
      title: navigation.getParam('title')
    };
  }

  dropdownClick(idx, value) {
    if (value.name === 'reload') {
      this.webview.reload();
    } else {
      //
    }
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => {}}
        style={{ width: 100, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
        <IconFont
          name={rowData.name}
          style={{ marginRight: 10, fontSize: 26, color: '#333' }}
        />
        <Text style={{ fontSize: 20, color: '#333' }}>{rowData.label}</Text>
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
        dropdownStyle={{ height: 103, borderRadius: 0, borderTopWidth: 0, borderRightWidth: 0 }}
        onSelect={(idx, value) => this.dropdownClick(idx, value)}
        showsVerticalScrollIndicator={false}
        adjustFrame={style => ({ ...style, top: style.top - 12 })}
      >
        <IconFont
          name="ellipsis"
          style={{ fontSize: 26, color: '#fff', marginRight: 10 }}
        />
      </ModalDropdown>
    );
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, uri, title } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title={title}
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
          rightButton={this.renderDropdownButton()}
        />
        <View style={styles.content}>
          
          <WebView
            ref={wv => { this.webview = wv; }}
            onMessage={e => this.onMessage(e)}
            originWhitelist={['*']}
            source={{ uri }}
          />
        </View>
      </View>
    );
  }
}

XWebview.propTypes = {
  navigation: PropTypes.object.isRequired
};
