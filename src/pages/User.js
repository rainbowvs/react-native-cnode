import React from 'react';
import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Base from '../coms/Base';
import ViewUtils from '../coms/ViewUtils';

export default class User extends Base {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    const authorName = navigation.getParam('authorName');
    this.state = {
      themeColor,
      authorName
    };
  }

  componentDidMount() {
    //
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, authorName } = this.state;
    return (
      <View>
        <Header
          title="用户"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <Text>{authorName}</Text>
      </View>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.object.isRequired
};
