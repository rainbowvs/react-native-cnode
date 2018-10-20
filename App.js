import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import ThemeDao from './expand/dao/ThemeDao';
import UserDao from './expand/dao/UserDao';

export default class App extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    Promise.all([new ThemeDao().getTheme(), new UserDao().getUser()]).then(res => {
      const [themeColor, userInfo] = res;
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            params: {
              themeColor,
              userInfo
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
