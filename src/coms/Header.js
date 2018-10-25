import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

const IOS = Platform.OS === 'ios';
const NAV_BAR_HEIGHT = 50;
const STATUSBAR_HEIGHT = IOS ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#80bd01'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: NAV_BAR_HEIGHT
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

const Header = props => {
  const {
    themeColor,
    leftButton,
    rightButton,
    title,
    titleView
  } = props;
  const titleElem = titleView !== undefined
    ? titleView
    : <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>{title}</Text>;
  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <View style={styles.navBar}>
        <View style={styles.navBarButton}>{leftButton}</View>
        <View style={styles.navBarTitleContainer}>{titleElem}</View>
        <View style={styles.navBarButton}>{rightButton}</View>
      </View>
    </View>
  );
};

Header.propTypes = {
  themeColor: PropTypes.string,
  title: PropTypes.string,
  titleView: PropTypes.element,
  rightButton: PropTypes.element,
  leftButton: PropTypes.element
};

Header.defaultProps = {
  themeColor: '#80bd01',
  title: '',
  titleView: undefined,
  rightButton: null,
  leftButton: null
};

export default Header;
