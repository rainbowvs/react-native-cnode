import Toast from 'react-native-root-tips';

Toast.setDefaultOptions({
  duration: 3000,
  delay: 0,
  backgroundColor: 'black',
  opacity: 0.8,
  textColor: 'white',
  position: Toast.positions.BOTTOM
});

const toast = (text, opts) => {
  Toast.show(text, opts);
};

export default toast;
