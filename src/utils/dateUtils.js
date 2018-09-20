/**
 * 计算间隔时长
 * @param {string} startTime 起始时间
 * @param {string} [endTime=new Date()] 结束时间
 * @returns {string} 从起始时间到当前相隔的时间
 */
export const getTimeInterval = (startTime, endTime = new Date()) => {
  let result = null;
  const diffValue = +new Date(endTime) - +new Date(startTime);
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // const halfamonth = day * 15;
  const month = day * 30;
  const year = month * 12;

  const [_year, _month, _week, _day, _hour, _min] = [
    diffValue / year,
    diffValue / month,
    diffValue / (7 * day),
    diffValue / day,
    diffValue / hour,
    diffValue / minute
  ];
  if (_year >= 1) result = `${parseInt(_year, 10)}年前`;
  else if (_month >= 1) result = `${parseInt(_month, 10)}月前`;
  else if (_week >= 1) result = `${parseInt(_week, 10)}周前`;
  else if (_day >= 1) result = `${parseInt(_day, 10)}天前`;
  else if (_hour >= 1) result = `${parseInt(_hour, 10)}小时前`;
  else if (_min >= 1) result = `${parseInt(_min, 10)}分钟前`;
  else result = '刚刚';
  return result;
};

/**
 * 小于10在前补零
 * @param {number} num 补零前的数字
 * @returns {string} 补零后的值
 */
const addZero = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};

/**
 * 格式化日期
 * @param {string} dateStr 未经转换的日期字符串
 * @returns {string} Y-m-d H:m:s
 */
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());
  const second = addZero(date.getSeconds());
  return `${year} - ${month} - ${day}  ${hour} : ${minute} : ${second}`;
};
