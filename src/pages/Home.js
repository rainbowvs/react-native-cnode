import React from 'react';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import {
  View,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Base from '../coms/Base';
import Header from '../coms/Header';
import ViewUtils from '../coms/ViewUtils';
import Tab from '../coms/Tab';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class Home extends Base {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      themeColor: navigation.getParam('themeColor')
    };
    this.tabList = [
      { label: '全部', text: 'all' },
      { label: '精华', text: 'good' },
      { label: '分享', text: 'share' },
      { label: '问答', text: 'ask' },
      { label: '招聘', text: 'job' },
      { label: '测试', text: 'dev' }
    ];
  }

  render() {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="Cnode"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('menu', { marginLeft: 10 }, () => {
            navigation.openDrawer();
          })}
        />
        <ScrollableTabView
          tabBarBackgroundColor={themeColor}
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor="mintcream"
          tabBarUnderlineStyle={{
            backgroundColor: 'white',
            height: 3
          }}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{ height: 44 }}
              tabStyle={{ height: 44 }}
              textStyle={{ fontSize: 16 }}
            />)
          }
        >
          {
            this.tabList.map(v => {
              return (
                <Tab
                  key={v.text}
                  tabLabel={v.label}
                  tabText={v.text}
                  navigation={navigation}
                  themeColor={themeColor}
                />
              );
            })
          }
        </ScrollableTabView>
      </View>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired
};
