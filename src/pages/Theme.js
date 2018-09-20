import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
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

export default class Theme extends React.Component {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
    const { navigation } = this.props;
    this.state = {
      themeColor: navigation.getParam('themeColor')
    };
  }

  onSelectTheme(themeColor) {
    this.themeDao.saveTheme(themeColor);
    DeviceEventEmitter.emit('CHANGE_THEME', themeColor);
    this.setState(() => ({
      themeColor
    }));
  }

  renderItem = () => {
    const elems = [];
    for (let i = 0, keys = Object.keys(ThemeData); i < keys.length; i += 1) {
      const themeName = keys[i];
      elems.push(
        <TouchableHighlight
          key={themeName}
          underlayColor="white"
          style={{ marginVertical: 5 }}
          onPress={() => this.onSelectTheme(ThemeData[themeName])}
        >
          <View style={[styles.item, { backgroundColor: ThemeData[themeName] }]}>
            <Text style={styles.itemText}>{themeName}</Text>
          </View>
        </TouchableHighlight>
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
