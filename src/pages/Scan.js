import React from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import Toast from '../utils/toastUtils';
import httpUtils from '../utils/httpUtils';
import ViewUtils from '../coms/ViewUtils';
import UserDao from '../../expand/dao/UserDao';

const OPACITY = 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraView: {
    flex: 1
  },
  box: {
    flex: 1
  },
  topRow: {
    flex: 1,
    backgroundColor: 'black',
    opacity: OPACITY
  },
  midRow: {
    flexDirection: 'row'
  },
  midleftCol: {
    flex: 1,
    backgroundColor: 'black',
    opacity: OPACITY
  },
  scanView: {
    height: 200,
    width: 200,
    borderWidth: 0.5,
    borderColor: '#fff'
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    opacity: OPACITY
  },
  midrightCol: {
    flex: 1,
    backgroundColor: 'black',
    opacity: OPACITY
  },
  bottomRow: {
    flex: 1,
    backgroundColor: 'black',
    opacity: OPACITY
  },
  tipsView: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0
  },
  tipsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff'
  }
});

export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.userDao = new UserDao();
    this.state = {
      themeColor,
      moveAnim: new Animated.Value(0)
    };
    this.token = null;
    this.loading = false;
    this.cancelable = null;
  }

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    if (this.cancelable) this.cancelable.cancel();
  }

  onBarCodeRead(responseData) {
    if (this.loading) return;
    const { navigation } = this.props;
    const { type, data } = responseData;
    if (type === 'QR_CODE') {
      this.loading = true;
      this.token = data;
      this.cancelable = httpUtils.post('https://cnodejs.org/api/v1/accesstoken', {
        accesstoken: this.token
      });
      this.cancelable.promise
        .then(response => response.json())
        .then(res => {
          this.loading = false;
          if (res.success) {
            const userInfo = {
              accesstoken: this.token,
              id: res.id,
              loginname: res.loginname,
              avatar_url: res.avatar_url
            };
            Toast('登录成功');
            DeviceEventEmitter.emit('CHANGE_LOGIN', userInfo);
            this.userDao.saveUser(userInfo)
              .then(saveResult => {
                if (saveResult.success) navigation.navigate('Home');
              })
              .catch(saveError => {
                Toast(saveError);
              });
          } else {
            Toast(res.error_msg);
          }
        })
        .catch(err => {
          Toast(err);
          this.loading = false;
        });
    } else {
      Toast('扫描二维码不正确');
    }
  }

  startAnimation() {
    const { moveAnim } = this.state;
    moveAnim.setValue(0);
    Animated.timing(moveAnim, {
      toValue: 200,
      duration: 2200,
      easing: Easing.linear
    }).start(() => this.startAnimation());
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, moveAnim } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="扫码登录"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
        />
        <RNCamera
          style={styles.cameraView}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={res => this.onBarCodeRead(res)}
        >
          <View style={styles.box}>
            <View style={styles.topRow}>
              <View />
            </View>
            <View style={styles.midRow}>
              <View style={styles.midleftCol} />
              <View style={styles.scanView}>
                <Animated.View
                  style={[
                    styles.border,
                    { transform: [{ translateY: moveAnim }], backgroundColor: themeColor }
                  ]}
                />
              </View>
              <View style={styles.midrightCol} />
            </View>
            <View style={styles.bottomRow}>
              <View />
            </View>
          </View>
        </RNCamera>
        <View style={styles.tipsView}>
          <Text style={styles.tipsText}>将二维码放入框内</Text>
        </View>
      </View>
    );
  }
}

Scan.propTypes = {
  navigation: PropTypes.object.isRequired
};
