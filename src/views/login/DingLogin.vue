<template>
  <div class="container" v-if="!isUserAgent">
    <section class="acitve-box active-not-wx">
      <div class="active-main">
        <p class="not-icon-box"><i class="iconfont icon-warning-circle-fill"></i></p>
        <h2 class="not-txt">请在钉钉pc客户端打开</h2>
      </div>
    </section>
  </div>
</template>

<script>
  import dd from 'dingtalk-jsapi';
  export default {
    name: "DingLogin",
    data(){
      return{
        isUserAgent:true
      }
    },
    created(){
      var _this = this;
      console.log(navigator.userAgent,"浏览器");
      var userAgent = navigator.userAgent;
      console.log(userAgent.match(/DingTalk/i),'--dingLogin--',userAgent.match(/Chrome/i),"ddddd-----");
      if (userAgent.match(/DingTalk/i)!=null && userAgent.match(/Chrome/i)!=null
        && userAgent.match(/DingTalk/i).length>0 && userAgent.match(/Chrome/i).length>0) {
        _this.isUserAgent = true;
        dd.ready(function () {
          console.log("Chrome2");
          dd.runtime.permission.requestAuthCode({
            corpId: "dingf5893cc2a5eff4bb35c2f4657eb6378f", // 企业id
            onSuccess: function (info) {
              console.log(info, "info钉钉manage"); // 通过该免登授权码可以获取用户身份
              _this.dingdingLogin(info.code);
            }
          });
        });
      }else{
        _this.isUserAgent = false;
      }
    },
    methods:{
      //钉钉无痕登录
      dingdingLogin(code){
        var _this = this;
        _this.request({
          method:'post',
          url: '/login/ding_talk/e_login.do',
          param: {code:code},
          success: function (result) {
            console.log(result);
            if(result.code == 200){
              var data = result.token;
              // localStorage.setItem("token",data);
              // console.log(_this.$router,"router");
              _this.$router.replace('/manageIndex');
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      }
    }
  }
</script>

<style scoped>
  /*不是微信客户端的提示*/
  .active-not-wx .not-icon-box{
    text-align: center;
  }
  .active-not-wx .not-icon-box i{
    font-size:104px;
    color: #F08D00;
  }
  .active-main{
    margin-top:100px;
  }
  .active-not-wx .not-txt{
    text-align: center;
    margin-bottom: 5px;
    font-weight: 400;
    font-size: 20px;
  }
</style>
