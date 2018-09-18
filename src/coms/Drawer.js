import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Iconfont from './IconFont';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignSelf: 'stretch',
    height: 200,
    backgroundColor: '#80bd01',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 60,
    width: 90,
    height: 90
  },
  userName: {
    color: '#fff',
    fontSize: 24
  },
  credit: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  creditIcon: {
    marginRight: 5,
    color: '#fff',
    fontSize: 22
  },
  creditCount: {
    color: '#fff',
    fontSize: 18
  },
  list: {
    marginTop: 10
  },
  item: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50
  },
  itemIcon: {
    color: '#888',
    marginRight: 16,
    fontSize: 30
  },
  itemText: {
    color: '#333',
    fontSize: 22
  }
});

export default class Drawer extends React.Component {
  componentDidMount() {
    return 1;
  }

  renderItem = (navigation, navName, iconName, titleName) => {
    return (
      <TouchableHighlight
        key={navName}
        underlayColor="#ddd"
        onPress={() => navigation.navigate(navName)}
      >
        <View style={styles.item}>
          <Iconfont style={styles.itemIcon} name={iconName} />
          <Text style={styles.itemText}>{titleName}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { items } = this.props;
    const list = [
      { navName: 'Profile', iconName: 'user', titleName: '我的资料' },
      { navName: 'Theme', iconName: 'bg-colors', titleName: '主题颜色' },
      { navName: 'About', iconName: 'smile', titleName: '关于项目' }
    ];
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Image style={styles.avatar} source={{ uri: 'https://static.hdslb.com/images/akari.jpg' }} />
            <Text style={styles.userName}>rainbowvs</Text>
            <View style={styles.credit}>
              <Iconfont style={styles.creditIcon} name="trophy" />
              <Text style={styles.creditCount}>40</Text>
            </View>
          </View>
          <View style={styles.list}>
            { list.map(v => this.renderItem(items.navigation, v.navName, v.iconName, v.titleName)) }
          </View>
        </ScrollView>
      </View>
    );
  }
}

Drawer.propTypes = {
  items: PropTypes.object.isRequired
};
