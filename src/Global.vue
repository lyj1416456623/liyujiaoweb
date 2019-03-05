<template>

</template>

<script>
  import wx from 'weixin-js-sdk'
  import dd from 'dingtalk-jsapi';
  import axios from 'axios'
  export default {
    name: "Global",
    methods: {
      //钉钉鉴权
      dingdingConfig(opt){
        var url = location.href;
        console.log(url);
        let self = this;
        axios.post('/p-innermgrweb/dingtalk/get_dingtalk_config.do', {url:url}).then(function (response) {
          console.log(response,"res");
          if (response.data.code == 200 && response.data.result) {
            console.log(response.data.result);
            opt.success(response.data.result)
          }
        })
      },
      //判断是否是微信浏览器   true--是;  false--不是微信里的浏览器
      checkWeiXinBrowser(callback){
        let _this = this;
        let ua = window.navigator.userAgent.toLowerCase();
        let newTime = new Date().getTime();
        let curUrl = window.location.href;
        console.log(curUrl,"Global url");
        if(curUrl.indexOf('//wx.ziyueyuwen')==-1) { //本地和预发的代码
          /*  本地测试代码 本地测试时,隐藏_checkWxCookieFlag相关内容,
          先手机号登录  http://192.168.1.90:8080/wx/wx_test?key=17310428574 */
          if (callback) {
            callback();
          }
        }else { //线上代码
          //通过正则表达式匹配ua中是否含有MicroMessenger字符串
          axios.post('/api/wx/check_login.do', {}).then(function (response) {
            console.log(response, "res");
            if (response.data.code == 200 && response.data.result) {
              if (response.data.result.isWxLogin) {
                if (callback) {
                  callback();
                }
              } else {
                console.log('http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl, "jjjjjjjjjj");
                window.location.href = 'http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl;
              }
            } else {
              console.log('http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl, "jjjjjjjjjj");
              window.location.href = 'http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl;
            }
          })
        }
      },
      request(opt) {
        let self = this;
        //添加请求token
        switch (opt.method) {
          case 'post':
            self.$http.post('/api'+opt.url, opt.param).then(function (response) {
                  opt.success(response.data)
              }).catch(function (error) {
                opt.error(error);
            });
            break;
          case 'get':
            console.log('尚未添加');
            self.$http.get('/api'+opt.url)
              .then(function (response) {
                  opt.success(response.data)
              }).catch(function (error) {
              opt.error(error);
            });
            break;
        }

      },

      //微信jssdk的配置,
      wxConfigZiYue(callback){

        axios.post('/api/wx/get_config.do', {
          url:window.location.href.split('#')[0]}).then(function (response) {

          if(response.data.code == 200 && response.data.result){
            let _wxDataConfig = response.data.result;
            console.log(_wxDataConfig);
            wx.config({
              debug: false, //不开启,否则在微信中一直弹出config 结果  debugger
              appId: _wxDataConfig.appId,
              timestamp: _wxDataConfig.timestamp,
              nonceStr: _wxDataConfig.nonceStr,
              signature: _wxDataConfig.signature,
              jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','startRecord', 'stopRecord', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'downloadVoice',
                'chooseImage','previewImage','uploadImage','downloadImage','getLocalImgData']
            });

            wx.ready(function () {
              console.log('wx.ready global')
              if(callback){
                callback();
              }
            });
          }else{
            console.log('get_config.do not 200 else')
            console.log(response.data)
          }
        }).catch(function (error) {
          console.log('axios catch')
          console.log(error)
        });

      },

    }
  }
</script>
