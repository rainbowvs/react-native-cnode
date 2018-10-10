import React from 'react';
import { Easing, Animated } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import App from '../../App';
import Home from '../pages/Home';
import Details from '../pages/Details';
import Theme from '../pages/Theme';
import User from '../pages/User';
import Login from '../pages/Login';
import Scan from '../pages/Scan';
import Publish from '../pages/Publish';
import Drawer from './Drawer';

export const DrawerNav = createDrawerNavigator({
  Home: {
    screen: Home
  }
}, {
  contentComponent: props => (<Drawer navOpts={props} />)
});

export const StackNav = createStackNavigator({
  App: {
    screen: App
  },
  Home: {
    screen: DrawerNav
  },
  Details: {
    screen: Details
  },
  Theme: {
    screen: Theme
  },
  User: {
    screen: User
  },
  Login: {
    screen: Login
  },
  Scan: {
    screen: Scan
  },
  Publish: {
    screen: Publish
  }
}, {
  navigationOptions: {
    header: null
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.ease,
      timing: Animated.timing
    },
    screenInterpolator: StackViewStyleInterpolator.forHorizontal // android左右切换
  })
});
