/**
 * Created by gean on 2018/8/9.
 * 关于钉钉的所有公用方法(除了 免登录?),目前主要是钉钉的分享
 */

import dd from 'dingtalk-jsapi';


/**
 * 钉钉分享
 * opt = { type:0 , url:'',  title:'',  content:'',  image:''}
 * sucCallBack = 分享成功后的回调函数,可以不写
 * errCallBack = 分享失败后的回调函数,可以不写
 * */
export function ddShare(opt,sucCallBack,errCallBack) {
  try {
    dd.biz.navigation.setRight({
      show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
      control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
      text: '',//控制显示文本，空字符串表示显示默认文本
      onSuccess: function (result) {
        console.log('ding navigation.setRight suc');
        console.log(result);
        dd.ready(function () {
          dd.biz.util.share({
            type: opt.type || 0,
            url: opt.url,
            title: opt.title,
            content: opt.content,
            image: opt.image,
            onSuccess: function () {
              console.log('ding share suc')
              if (sucCallBack) {
                sucCallBack();
              }
            },
            onFail: function (err) {
              console.log('ding share fail')
              if (errCallBack) {
                errCallBack();
              }
            }
          })
        })
      },
      onFail: function (err) {
        console.log('ding navigation.setRight err');
        console.log(err);
      }
    })
  }catch(e){
    console.log(e);
  }
}
