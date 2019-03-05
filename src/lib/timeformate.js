/**
 * Created by liyujiao on 2019/2/25.
 */

// 格式化时间 时:分
export function hourFormate(timestamp) {
  if(typeof timestamp == "number"){
    timestamp = timestamp/1000;
  }else{
    timestamp = Date.parse(timestamp)/1000;
  }
  var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
  var H = tmDate.getHours(), i = tmDate.getMinutes();
  if(i<10){
    i='0'+i;
  }
  return H+':'+i;
}
