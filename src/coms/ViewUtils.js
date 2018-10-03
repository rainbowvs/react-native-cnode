import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import IconFont from './IconFont';

const styles = StyleSheet.create({
  icon: {
    color: '#fff',
    fontSize: 26
  }
});

export default class ViewUtils {
  static getIconButton(name, style, callBack) {
    return (
      <TouchableOpacity
        onPress={callBack}
      >
        <IconFont
          name={name}
          style={[styles.icon, style]}
        />
      </TouchableOpacity>
    );
  }

  static getLoading(flag, style, themeColor) {
    return (
      flag
        ? (
          <View style={style}>
            <ActivityIndicator color={themeColor} size="large" />
          </View>
        )
        : null
    );
  }
}
