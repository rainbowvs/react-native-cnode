import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import IconFont from './IconFont';

export default class XButton extends React.Component {
  static defaultProps = {
    disabled: false,
    buttonStyle: {},
    textStyle: {},
    iconStyle: { color: '#fff', fontSize: 26 },
    fbType: 'Highlight',
    activeOpacity: 0.2,
    underlayColor: '#eee',
    iconName: '',
    text: ''
  }

  renderButtonContent() {
    const {
      buttonStyle,
      textStyle,
      iconStyle,
      iconName,
      text
    } = this.props;
    return (
      <View style={buttonStyle}>
        {
          (iconName !== '') && (
            <IconFont
              name={iconName}
              style={iconStyle}
            />
          )
        }
        {(text !== '') && <Text style={textStyle}>{text}</Text>}
      </View>
    );
  }

  renderButton() {
    const {
      disabled,
      buttonStyle,
      onPress,
      fbType,
      activeOpacity,
      underlayColor
    } = this.props;
    if (!disabled) {
      if (fbType === 'Highlight') {
        return (
          <TouchableHighlight
            onPress={onPress}
            underlayColor={underlayColor}
          >
            {this.renderButtonContent()}
          </TouchableHighlight>
        );
      }
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={activeOpacity}
        >
          {this.renderButtonContent()}
        </TouchableOpacity>
      );
    }
    return (
      <View style={[buttonStyle, { opacity: 0.8 }]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  render() {
    return this.renderButton();
  }
}

XButton.propTypes = {
  disabled: PropTypes.bool,
  buttonStyle: Text.propTypes.style,
  textStyle: Text.propTypes.style,
  iconStyle: Text.propTypes.style,
  onPress: PropTypes.func.isRequired,
  fbType: PropTypes.string,
  activeOpacity: PropTypes.number,
  underlayColor: PropTypes.string,
  iconName: PropTypes.string,
  text: PropTypes.string
};
