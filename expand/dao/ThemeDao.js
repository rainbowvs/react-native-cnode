import { AsyncStorage } from 'react-native';

const THEME_KEY = 'theme_key';

export const ThemeData = {
  Default: '#9C27B0',
  Red: '#F44336',
  Pink: '#E91E63',
  Purple: '#9C27B0',
  DeepPurple: '#673AB7',
  Indigo: '#3F51B5',
  Blue: '#2196F3',
  LightBlue: '#03A9F4',
  Cyan: '#00BCD4',
  Teal: '#009688',
  Green: '#4CAF50',
  LightGreen: '#8BC34A',
  Lime: '#CDDC39',
  Amber: '#FFC107',
  Orange: '#FF9800',
  DeepOrange: '#FF5722',
  Brown: '#795548',
  Grey: '#9E9E9E',
  BlueGrey: '#607D8B'
};

export default class ThemeDao {
  getTheme = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (err, res) => {
        let themeColor = res;
        if (err) {
          reject(err);
          return;
        }
        if (!res) {
          themeColor = ThemeData.Default;
          this.saveTheme(themeColor);
        }
        resolve(themeColor);
      });
    });
  }

  saveTheme = (themeColor) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(THEME_KEY, themeColor, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }
}
