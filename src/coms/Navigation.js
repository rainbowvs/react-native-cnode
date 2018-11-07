import React from 'react';
import {
  Easing,
  Animated,
  ScrollView,
  BackHandler
} from 'react-native';
import {
  createStackNavigator,
  createDrawerNavigator,
  SafeAreaView,
  NavigationActions
} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import App from '../../App';
import Home from '../pages/Home';
import Details from '../pages/Details';
import Theme from '../pages/Theme';
import User from '../pages/User';
import Login from '../pages/Login';
import Scan from '../pages/Scan';
import Publish from '../pages/Publish';
import XWebview from '../pages/XWebview';
import Drawer from './Drawer';
import Toast from '../utils/toastUtils';


const DrawerNav = createDrawerNavigator({
  Home: {
    screen: Home
  }
}, {
  contentComponent: props => (
    <ScrollView>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Drawer navOpts={props} />
      </SafeAreaView>
    </ScrollView>
  )
});

const StackNav = createStackNavigator({
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
  },
  XWebview: {
    screen: XWebview
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

let lastBackPressed = false;
const defaultGetStateForAction = StackNav.router.getStateForAction;
StackNav.router.getStateForAction = (action, state) => {
  if (state) {
    if (action.type === NavigationActions.BACK) {
      if (state.routes[state.index].routeName === 'Home') {
        if (!state.routes[state.index].isDrawerOpen && lastBackPressed + 2000 < Date.now()) {
          Toast('再点击一次退出应用');
          lastBackPressed = Date.now();
          const routes = [...state.routes];
          return {
            ...state,
            ...state.routes,
            index: routes.length - 1
          };
        }
        BackHandler.exitApp();
      }
    }
  }
  return defaultGetStateForAction(action, state);
};

export default StackNav;
