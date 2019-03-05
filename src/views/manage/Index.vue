<template>
  <el-container class="manage-container">
    <el-aside class="manage-aside">
      <body-slider :menuList="menuList"></body-slider>
      <div class="version">版本号1.3</div>
    </el-aside>
    <el-container>
      <el-header style="height:64px;">
        <body-header class="manage-header" :userPermission="userPermission" :userData="userData"></body-header>
      </el-header>
      <el-main class="manage-main">
        <router-view :userPermission="userPermission" :userData="userData"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import BodyHeader from "@/components/BodyHeader";
  import BodySlider from "@/components/BodySlider";
  import dd from 'dingtalk-jsapi';
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return '';
  }
  export default {
    name: "Index",
    components: {BodyHeader,BodySlider},
    data(){
      return{
        sliderWidthFlag:false, //true--显示完整;false--显示迷你侧边栏
        userPermission:{},
        menuList:[],
        userData:{}
      }
    },
    created(){
      //判断链接里是否带有token  保存本地
      if(getQueryString('token')){
        var token = getQueryString('token');
        localStorage.setItem("token",token);
      }
      this.getuserData();
      this.getCurrentPermission();
    },
    mounted: function () {

    },
    methods: {
      getuserData(){
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
      },
      //获取当前登录者的权限
      getCurrentPermission() {
        let _this = this;
        _this.menuList = [
          {
            "menuName":"首页",
            "path":"/manageIndex",
            "icon":"icon-home_pho",
            "status":true
          },
          {
            "menuName":"我的班级",
            "path":"/classManage",
            "icon":"icon-banji",
            "status":true
          },
          {
            "menuName":"课程管理",
            "path":"/courseManage",
            "icon":"icon-kecheng_m",
            "status":true
          },
          {
            "menuName":"套题",
            "path":"/library",
            "icon":"icon-tiku1",
            "status":true
          },
          {
            "menuName":"题库",
            "path":"/warehouse",
            "icon":"icon-tiku",
            "status":true
          },
          {
            "menuName":"商品管理",
            "path":"/productManage",
            "icon":"icon-shangpin",
            "status":true
          },
          {
            "menuName":"订单",
            "path":"/orderManage",
            "icon":"icon-dingdan",
            "status":true
          },
          {
            "menuName":"优惠券",
            "path":"/couponManage",
            "icon":"icon-youhuiquan",
            "status":true
          },
          {
            "menuName":"学生管理",
            "path":"/studentManage",
            "icon":"icon-xueshengguanli",
            "status":true
          },
          {
            "menuName":"员工管理",
            "path":"/management",
            "icon":"icon-yuangongguanli",
            "status":true
          }];
        return false;
        //暂时没有权限列表
        _this.request({
          method:'post',
          url: '/user/role/get_all_role.do',
          param: {},
          success: function (result) {
            console.log(result);
            if(result.code == 200){
              var data = result.result;
              _this.userPermission = data;
              _this.menuList = [
                {
                  "menuName":"首页",
                  "path":"/manageIndex",
                  "icon":"icon-home_pho",
                  "status":true
                },
                {
                  "menuName":"我的班级",
                  "path":"/classManage",
                  "icon":"icon-banji",
                  "status":true
                },
                {
                  "menuName":"课程管理",
                  "path":"/courseManage",
                  "icon":"icon-kecheng_m",
                  "status":true
                },
                {
                  "menuName":"学生管理",
                  "path":"/studentManage",
                  "icon":"icon-xueshengguanli",
                  "status":true
                },
                {
                  "menuName":"员工管理",
                  "path":"/management",
                  "icon":"icon-yuangongguanli",
                  "status":true
                }];
              console.log(_this.$route,"path");
              if(!_this.userPermission.isAuthPagePermission && _this.$route.path == "/manage"){
                  alert("您没有当前页面的权限");
                _this.$router.replace('/')
              }
              if(!_this.userPermission.isPeoplePagePermission && _this.$route.path == "/management"){
                alert("您没有当前页面的权限");
                _this.$router.replace('/')
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .manage-header{
    background-color: #B3C0D1;
    color: #333;
    line-height: 64px;
    height:64px!important;
    padding:0;
    text-align:left;
  }
  .manage-aside {
    position: relative;
    background-color: #fff;
    color: #333;
    height:100%;
    width: 240px !important;
    border-right:1px solid #eee;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
    overflow-y: auto;
  }
  .slider-list-width{
    width:80px!important;
  }
  .manage-main {
    color: #333;
    padding:0;
    width:100%;
  }
  .manage-container{
    height:100%;
  }

  .version{
    position: absolute;
    bottom:0;
    left:0;
    right:0;
    text-align: center;
    font-size:12px;
    color:#c0c0c0;
    line-height: 18px;
    padding:12px 0;
    transform:scale(0.85);
  }
</style>
