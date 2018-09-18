import React from 'react';
import {
  Easing,
  Animated
} from 'react-native';
import {
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import App from '../../App';
import Details from '../pages/Details';
import Theme from '../pages/Theme';
import Drawer from './Drawer';

export const DrawerNav = createDrawerNavigator({
  Home: {
    screen: App
  }
}, {
  contentComponent: props => (<Drawer items={props} />)
});

export const StackNav = createStackNavigator({
  Home: {
    screen: DrawerNav
  },
  Details: {
    screen: Details
  },
  Theme: {
    screen: Theme
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
