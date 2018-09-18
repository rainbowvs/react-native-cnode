import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUSBAR_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    marginTop: STATUSBAR_HEIGHT,
    backgroundColor: '#80bd01'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    top: 0,
    right: 40,
    bottom: 0
  },
  title: {
    fontSize: 22,
    textAlignVertical: 'center',
    color: '#fff'
  },
  navBarButton: {
    alignItems: 'center'
  }
});

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['default', 'light-content']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
  translucent: PropTypes.bool
};

export default class Header extends React.Component {
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
      backgroundColor: '#80bd01',
      translucent: true
    },
    title: '',
    titleView: undefined,
    rightButton: null,
    leftButton: null
  }

  componentDidMount() {
    return true;
  }

  render() {
    const {
      statusBar,
      leftButton,
      rightButton,
      title,
      titleView
    } = this.props;
    const titleElem = titleView !== undefined
      ? titleView
      : <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{title}</Text>;
    return (
      <View style={styles.container}>
        {<StatusBar {...statusBar} />}
        <View style={styles.navBar}>
          <View style={styles.navBarButton}>{leftButton}</View>
          <View style={styles.navBarTitleContainer}>{titleElem}</View>
          <View style={styles.navBarButton}>{rightButton}</View>
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  statusBar: PropTypes.shape(StatusBarShape),
  title: PropTypes.string,
  titleView: PropTypes.element,
  rightButton: PropTypes.element,
  leftButton: PropTypes.element
};
