<template>
  <div class="header">
    <div class="header-photo">
      <span class="el-dropdown-link">
          <img :src="userData.avatar||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png'">
          <div class="header-name">{{userData.dingTalkNickName}}</div>
        </span>
      <!--暂时不需要退出登录-->
      <!--<el-dropdown :hide-on-click="false" @command="handleCommand">-->
        <!--<el-dropdown-menu slot="dropdown">-->
          <!--<el-dropdown-item>修改密码</el-dropdown-item>-->
          <!--<el-dropdown-item command="logout">退出登录</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
      <!--</el-dropdown>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "BodyHeader",
    data() {
      return {
      }
    },
    props:{
      userData:{
        type:Object,
        required:true
      }
    },
    methods: {
      //退出登录
      handleCommand(command) {
        console.log(command);
        if(command == 'logout'){
          console.log(this.$router,"退出登录");
          localStorage.removeItem("token");
          this.$router.push({path:'/managelogin',query:{redirect:location.hostname}});
        }
      },
    }
  }
</script>
<style scoped lang="scss">

  .header {
    height: 64px;
    line-height: 64px;
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    padding: 0 24px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    left: 240px;
  }

  .header-slider-button {
    font-size: 24px;
    cursor: pointer;
    opacity: 0.65;
  }

  .header-photo {
    float: right;
    cursor: pointer;
    img {
      width: 32px;
      height: 32px;
      float: left;
      border-radius: 16px;
      display: block;
      margin-top: 16px;
      margin-right: 8px;
    }
    .header-name {
      float: left;
    }
  }
  .help-doc-all{
    float:right;
    height:100%;
    border:none;
    width:48px;
    padding:0;
    line-height:64px;
    border-radius: 0;
    margin-right:24px;
    text-align: center;
    a{
      display:block;

      i{
        font-size:24px;
        color:#606060;
      }
    }
  }
</style>


