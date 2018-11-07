import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
import BaseCom from '../coms/BaseCom';
import Header from '../coms/Header';
import ThemeDao, { ThemeData } from '../../expand/dao/ThemeDao';
import ViewUtils from '../coms/ViewUtils';

const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingVertical: 5
  },
  item: {
    marginRight: 5,
    width: WINDOW_WIDTH / 3 - (5 * 2),
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 20,
    color: '#fff'
  }
});

export default class Theme extends BaseCom {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
    const { navigation } = props;
    this.state = {
      themeColor: navigation.getParam('themeColor')
    };
  }

  onSelectTheme(newThemeColor) {
    const { themeColor } = this.state;
    if (themeColor === newThemeColor) return;
    this.themeDao.saveTheme(newThemeColor);
    DeviceEventEmitter.emit('CHANGE_THEME', newThemeColor);
    this.setState(() => ({
      themeColor: newThemeColor
    }));
  }

  renderItem = () => {
    const elems = [];
    for (let i = 0, keys = Object.keys(ThemeData); i < keys.length; i += 1) {
      const themeName = keys[i];
      elems.push(
        <TouchableOpacity
          key={themeName}
          activeOpacity={0.6}
          style={{ marginVertical: 5 }}
          onPress={() => this.onSelectTheme(ThemeData[themeName])}
        >
          <View style={[styles.item, { backgroundColor: ThemeData[themeName] }]}>
            <Text style={styles.itemText}>{themeName}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return elems;
  }

  render() {
    const { navigation } = this.props;
    const { themeColor } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="主题"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.list}>
            { this.renderItem() }
          </View>
        </ScrollView>
      </View>
    );
  }
}

Theme.propTypes = {
  navigation: PropTypes.object.isRequired
};
