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
    const { navigation } = this.props;
    this.state = {
      themeColor: navigation.getParam('themeColor')
    };
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
          rightButton={ViewUtils.getIconButton('edit-square', { marginRight: 10 }, () => {
            //
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
            />)
          }
        >
          <Tab tabLabel="全部" tabText="all" navigation={navigation} />
          <Tab tabLabel="精华" tabText="good" navigation={navigation} />
          <Tab tabLabel="分享" tabText="share" navigation={navigation} />
          <Tab tabLabel="问答" tabText="ask" navigation={navigation} />
          <Tab tabLabel="招聘" tabText="job" navigation={navigation} />
          <Tab tabLabel="测试" tabText="dev" navigation={navigation} />
        </ScrollableTabView>
      </View>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired
};
