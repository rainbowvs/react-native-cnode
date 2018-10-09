import Toast from 'react-native-root-tips';

Toast.setDefaultOptions({
  delay: 0,
  backgroundColor: 'black',
  opacity: 0.8,
  textColor: 'white',
  position: Toast.positions.BOTTOM
});

const toast = text => {
  Toast.show(text);
};

export default toast;
