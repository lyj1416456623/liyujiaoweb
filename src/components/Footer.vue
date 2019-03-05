<template>
  <div>
    <div class="ding-footer">
      <i class="iconfont icon-zhankaidaohang" @click="show = !show"></i>
    </div>
    <div class="footer-dialog" v-show="show">
      <div class="footer-mask"  @click="show = !show"></div>
      <transition name="menu-fade">
        <div class="footer-menu" v-show="show">
          <div class="footer-header">
            <img :src="userData.avatar||'//ts-dingup-onlinetest.oss-cn-beijing.aliyuncs.com/img/home/default.png'" alt="">
            <div class="user-name">{{userData.userName}}</div>
            <img src="//xiniao.oss-cn-beijing.aliyuncs.com/img/common/niaologo.png" alt="" class="logo-mb">
          </div>
          <div class="footer-menu-block">
            <el-menu :default-active="defaultActive" router class="menu">
              <!--:style="{width:menuWidth}"-->
              <template v-for="item in menuList">
                <template v-if="item.status">
                  <el-menu-item :index="item.path">
                    <i class="iconfont" v-bind:class="item.icon"></i>
                    <div class="label-name">{{item.menuName}}</div>
                  </el-menu-item>
                </template>
              </template>
              <li style="padding-left: 20px;" class="el-menu-item" @click="jumpUrl"><i class="iconfont icon-bangzhu"></i> <div class="label-name">帮助</div></li>
            </el-menu>
          </div>
          <div class="close-menu" @click="show = !show">
            <i class="iconfont icon-shouqidaohang"></i>
            <div class="version">顶上语文1.6</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
    export default {
      name: "BodyFooter",
      data(){
        return{
          show:false,
        }
      },
      props:[
        'menuList',
        'userData',
        'menuWidth'
      ],
      computed: {
        defaultActive: function(){
          this.show = false;
          console.log(this.$route.path);
          // if(this.$route.path == '/classManage/VIP'){
          //   return '/classManage/BANKE'
          // }else
//          if(this.$route.path == '/courseManage/VIP'){
//            return '/courseManage/BANKE'
//          }else{
            return this.$route.path;
//          }
        }
      },
      mounted(){
        // this.getUser();
      },
      methods:{
        jumpUrl(){
          location.href = "https://www.topschool.com/helpdowns.html";
        },
        //获取用户信息
        getUser(){
          var _this = this;
          _this.request({
            method:'post',
            url: '/user/get_user_message.do',
            param: {},
            success: function (result) {
              console.log(result);
              if(result.code == 200){
                var data = result.result;
                _this.userData = data;
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

<style scoped lang="scss">
  .ding-footer{
    width:100%;
    height:49px;
    background:rgba(255,255,255,1);
    box-shadow:0 5px 14px 0 rgba(0,0,0,0.25);
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    line-height:49px;
    z-index:2;
    i{
      font-size:24px;
      color:#000;
      margin-left:15px;
    }
  }
  .footer-dialog{
    .footer-mask{
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.45);
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      z-index:3;
    }
    .footer-menu{
      padding:0 28px;
      background:#fff;
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      z-index:130;
      .footer-header{
        width:100%;
        padding:24px 0;
        line-height:32px;
        border-bottom:1px solid #E8E8E8;
        position:relative;
        img{
          width:32px;
          float:left;
          display:block;
          border-radius:16px;
        }
        .user-name{
          float:left;
          margin-left:10px;
          font-size:16px;
        }
        .logo-mb{
          display:block;
          width:63px;
          position:absolute;
          bottom:0;
          right:0;
        }
      }
      .footer-header:after, .menu:after{
        clear:both;
        content:'';
        display:block;
        width:0;
        height:0;
        visibility:hidden;
      }
      .footer-menu-block{
        width:100%;
        padding-top:28px;
        overflow-x:scroll;
        .menu{
          border:none;
          li{
            float:left;
            text-align: center;
            width:25%;
            height:auto;
            line-height:inherit;
            padding:0!important;
            background:none;
            margin-bottom:28px;
            i{
              font-size:24px;
            }
            .label-name{
              font-size:10px;
              line-height:18px;
              margin-top:12px;
            }
          }
          .active-li{
            color:#DBD2FB;
          }
        }
      }
      .close-menu{
        width:100%;
        height:49px;
        line-height:49px;
        margin-left:-14px;
        i{
          font-size:24px;
        }
        .version{
          float:right;
          font-size:12px;
          color:#C0C0C0;
        }
      }
    }
  }
  .menu-fade-enter-active {
    transition: all .3s ease;
  }
  .menu-fade-leave-active {
    transition: all .3s ease;
  }
  .menu-fade-enter, .menu-fade-leave-to{
    transform: translateY(350px);
  }
</style>
