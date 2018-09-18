import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Header from './src/coms/Header';
import ViewUtils from './src/coms/ViewUtils';

const theme = {
  mainColor: '#80bd01',
  secondaryColor: 'mintcream'
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title="Cnode"
          statusBar={{ backgroundColor: theme.mainColor }}
          leftButton={ViewUtils.getIconButton('menu', { marginLeft: 10 }, () => {
            navigation.openDrawer();
          })}
          rightButton={ViewUtils.getIconButton('edit-square', { marginRight: 10 }, () => {
            //
          })}
        />
        <ScrollableTabView
          tabBarBackgroundColor={theme.mainColor}
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor={theme.secondaryColor}
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
          <Text tabLabel="Java">Java1</Text>
          <Text tabLabel="C">C</Text>
          <Text tabLabel="C++">C++</Text>
          <Text tabLabel="Ruby">Ruby</Text>
          <Text tabLabel="Ruby1">Ruby1</Text>
          <Text tabLabel="Ruby2">Ruby2</Text>
          <Text tabLabel="Ruby3">Ruby3</Text>
          <Text tabLabel="Ruby4">Ruby4</Text>
          <Text tabLabel="Ruby5">Ruby5</Text>
          <Text tabLabel="Ruby6">Ruby6</Text>
        </ScrollableTabView>
      </View>
    );
  }
}

App.propTypes = {
  navigation: PropTypes.object.isRequired
};
