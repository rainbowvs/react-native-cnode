import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import IconFont from './IconFont';

const styles = StyleSheet.create({
  icon: {
    color: '#fff',
    fontSize: 26
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
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

  static getModalLoading(flag, style, themeColor) {
    return (
      flag
        ? (
          <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={() => {}}
          >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <ActivityIndicator color={themeColor} size="large" />
              </View>
            </View>
          </Modal>
        )
        : null
    );
  }
}
