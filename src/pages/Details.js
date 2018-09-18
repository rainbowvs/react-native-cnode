import React from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';
import PropTypes from 'prop-types';

export default class Details extends React.Component {
  componentDidMount() {
    return 1;
  }

  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Text>Details</Text>
        <Button
          title="Home"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.object.isRequired
};
