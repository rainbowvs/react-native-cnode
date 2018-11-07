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

const renderButtonContent = props => {
  const {
    buttonStyle,
    textStyle,
    iconStyle,
    iconName,
    text
  } = props;
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
};

const XButton = props => {
  const {
    disabled,
    buttonStyle,
    onPress,
    fbType,
    activeOpacity,
    underlayColor
  } = props;

  if (!disabled) {
    if (fbType === 'Highlight') {
      return (
        <TouchableHighlight
          onPress={onPress}
          underlayColor={underlayColor}
        >
          {renderButtonContent(props)}
        </TouchableHighlight>
      );
    }
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {renderButtonContent(props)}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[buttonStyle, { opacity: 0.8 }]}>
      <ActivityIndicator color="#fff" />
    </View>
  );
};

export default XButton;

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

XButton.defaultProps = {
  disabled: false,
  buttonStyle: {},
  textStyle: {},
  iconStyle: { color: '#fff', fontSize: 26 },
  fbType: 'Highlight',
  activeOpacity: 0.2,
  underlayColor: '#eee',
  iconName: '',
  text: ''
};
