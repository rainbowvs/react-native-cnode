import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import ThemeDao from './expand/dao/ThemeDao';

export default class App extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    new ThemeDao().getTheme().then((res) => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            params: {
              themeColor: res
            }
          })
        ]
      });
      navigation.dispatch(resetAction);
      SplashScreen.hide();
    });
  }

  render() {
    return null;
  }
}

App.propTypes = {
  navigation: PropTypes.object.isRequired
};
