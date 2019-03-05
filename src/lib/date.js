/**
 * Created by gean on 2018/11/16.
 */

// 格式化时间 1. 日期为当日，直接显示时间，20:59
//          2. 时间为昨天，显示昨天 20:59
//          3. 时间为昨天以前今年以内，显示1-22 20:59
//          4. 时间为去年，显17-1-22 20:59
export function timeFormate(timestamp) {
  if(typeof timestamp == "number"){
    timestamp = timestamp/1000;
  }else{
    timestamp = Date.parse(timestamp)/1000;
  }
  function zeroize( num ) {
    return (String(num).length == 1 ? '0' : '') + num;
  }
  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
  var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
    return zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
    if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if ( curDate.getFullYear() == Y ) {
      return  zeroize(m) + '-' + zeroize(d) + " "+zeroize(H) + ':' + zeroize(i);
    } else {
      return  Y.toString().substr(2, 2) + '-' + zeroize(m) + '-' + zeroize(d)+" "+ zeroize(H) + ':' + zeroize(i);
    }
  }
}
