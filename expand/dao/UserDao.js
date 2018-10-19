import { AsyncStorage } from 'react-native';

const USER_KEY = 'user_key';

export default class UserDao {
  getUser = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USER_KEY, (err, res) => {
        if (err) reject(err);
        if (res) resolve(res);
      });
    });
  }

  saveUser = userInfo => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo), err => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  removeUser = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(USER_KEY, err => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }
}
