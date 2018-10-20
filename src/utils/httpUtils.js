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

export const encodeData = data => {
  if (data) {
    const arr = [];
    for (const x in data) {
      if (data[x]) {
        arr.push(`${encodeURIComponent(x)}=${encodeURIComponent(data[x])}`);
      }
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
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      })
    );
  }

  static post(url, data) {
    return makeCancelable(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      })
    );
  }
}
