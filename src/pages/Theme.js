import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
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

const ThemeData = {
  Red: '#F44336',
  Pink: '#E91E63',
  Purple: '#9C27B0',
  DeepPurple: '#673AB7',
  Indigo: '#3F51B5',
  Blue: '#2196F3',
  LightBlue: '#03A9F4',
  Cyan: '#00BCD4',
  Teal: '#009688',
  Green: '#4CAF50',
  LightGreen: '#8BC34A',
  Lime: '#CDDC39',
  Amber: '#FFC107',
  Orange: '#FF9800',
  DeepOrange: '#FF5722',
  Brown: '#795548',
  Grey: '#9E9E9E',
  BlueGrey: '#607D8B'
};

export default class Theme extends React.Component {
  componentDidMount() {
    return 1;
  }

  renderItem = () => {
    const elems = [];
    for (let i = 0, keys = Object.keys(ThemeData); i < keys.length; i += 1) {
      elems.push(
        <TouchableHighlight
          key={keys[i]}
          underlayColor="white"
          style={{ marginTop: 5 }}
          onPress={() => {
            //
          }}
        >
          <View style={[styles.item, { backgroundColor: ThemeData[keys[i]] }]}>
            <Text style={styles.itemText}>{keys[i]}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    return elems;
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title="主题"
          statusBar={{ backgroundColor: '#80bd01' }}
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
