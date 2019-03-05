/**
 * Created by liyujiao on 2019/2/25.
 */

// 格式化时间 1. 日期为年月日
//           2. 当年的不显示年
export function dateFormate(timestamp) {
  if(typeof timestamp == "number"){
    timestamp = timestamp/1000;
  }else{
    timestamp = Date.parse(timestamp)/1000;
  }
  function zeroize( num ) {
    return (String(num).length == 1 ? '0' : '') + num;
  }
  var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear();
  if ( tmDate.getFullYear() == Y ) {
    return tmDate.getMonth()+1 +'月'+ tmDate.getDate()+'日';
  } else {
    return tmDate.getFullYear()+'年'+tmDate.getMonth()+1 +'月'+ tmDate.getDate()+'日'
  }
}
