const makeCancelable = promise => {
  let hasCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => {
      if (hasCanceled) {
        reject({ isCanceled: true });
      } else {
        resolve(val);
      }
    });
    promise.catch(error => {
      if (hasCanceled) {
        reject({ isCanceled: true });
      } else {
        resolve(error);
      }
    });
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
};

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
    return makeCancelable(
      fetch(`${url}${encodeData(data)}`, {
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    );
  }

  static post(url, data) {
    return makeCancelable(
      fetch(url, {
        method: 'POST',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    );
  }
}
