import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../coms/Header';
import ViewUtils from '../coms/ViewUtils';
import XButton from '../coms/XButton';
import Toast from '../utils/toastUtils';
import httpUtils from '../utils/httpUtils';
import UserDao from '../../expand/dao/UserDao';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  textInput: {
    marginBottom: 30,
    fontSize: 20,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderBottomWidth: 2
  },
  button: {
    borderRadius: 0,
    borderWidth: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  }
});

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const themeColor = navigation.getParam('themeColor');
    this.userDao = new UserDao();
    this.state = {
      themeColor,
      token: 'aa1fdffa-c4d1-408b-b54a-27403f9b3a55',
      loading: false
    };
    this.cancelable = null;
  }

  componentWillUnmount() {
    if (this.cancelable) this.cancelable.cancel();
  }

  submit() {
    const { token } = this.state;
    const { navigation } = this.props;
    // if (token === '') {
    //   Toast('accesstoken不能为空');
    //   return;
    // }
    this.setState(() => ({
      loading: true
    }));
    this.cancelable = httpUtils.post('https://cnodejs.org/api/v1/accesstoken', {
      accesstoken: token
    });
    this.cancelable.promise
      .then(response => response.json())
      .then(res => {
        this.setState(() => ({
          loading: false
        }));
        if (res.success) {
          const userInfo = {
            accesstoken: token,
            id: res.id,
            loginname: res.loginname,
            avatar_url: res.avatar_url
          };
          Toast('登录成功');
          DeviceEventEmitter.emit('CHANGE_LOGIN', userInfo);
          this.userDao.saveUser(userInfo)
            .then(saveResult => {
              if (saveResult.success) navigation.goBack();
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
        this.setState(() => ({
          loading: false
        }));
      });
  }

  render() {
    const { navigation } = this.props;
    const { themeColor, loading } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="登录"
          themeColor={themeColor}
          leftButton={ViewUtils.getIconButton('arrowleft', { marginLeft: 10 }, () => {
            navigation.goBack();
          })}
          rightButton={ViewUtils.getIconButton('scan', { marginRight: 10 }, () => {
            navigation.navigate('Scan', { themeColor });
          })}
        />
        <View style={styles.form}>
          <TextInput
            style={[styles.textInput, { borderBottomColor: themeColor }]}
            placeholder="Access Token"
            selectionColor={themeColor}
            onChangeText={token => this.setState({ token })}
            underlineColorAndroid="transparent"
            placeholderTextColor="#aaa"
          />
          <XButton
            onPress={() => this.submit()}
            disabled={loading}
            fbType="opacity"
            activeOpacity={0.7}
            buttonStyle={[styles.button, { backgroundColor: themeColor }]}
            textStyle={styles.buttonText}
            iconName="login"
          />
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.object.isRequired
};
