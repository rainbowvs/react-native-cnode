import React from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Base from '../coms/Base';
import ViewUtils from '../coms/ViewUtils';

export default class Details extends Base {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const themeColor = navigation.getParam('themeColor');
    console.log(navigation);
    this.state = {
      themeColor,
      list: [],
      isLoading: false,
      topicMd: navigation.getParam('item').content
    };
  }

  componentDidMount() {
    super.componentDidMount();
    return 1;
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, topicMd } = this.state;
    return (
      <View>
        <Header
          title="详情"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <ScrollView>
          <View></View>
        </ScrollView>
      </View>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.object.isRequired
};
