const encodeData = data => {
  if (data) {
    const arr = [];
    for (const x in data) {
      arr.push(`${encodeURIComponent(x)}=${encodeURIComponent(data[x])}`);
    }
    return `?${arr.join('&')}`;
  }
  return '';
};

export default class HttpUtils {
  static get(url, data) {
    return new Promise((resolve, reject) => {
      fetch(`${url}${encodeData(data)}`, {
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  static post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}
