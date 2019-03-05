<template>
  <el-container>
    <el-header class="auth-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/manage' }">身份与权限</router-link>
      </el-breadcrumb>
      <h4 class="auth-title">身份与权限</h4>
      <p class="auth-discript">身份决定了员工在语文系统中可以做的事情，而在这个页面你可以改变这些</p>
      <router-link class="del-record" :to="{path:'/delrecord'}" >
        <i class="iconfont icon-toview"></i>
        查看删除记录
      </router-link>
      <img src="//onlinetest-public.oss-cn-beijing.aliyuncs.com/xiniao/card.png" alt="">
    </el-header>
    <el-container style="padding:24px 0">
      <el-aside width="290px">
        <div class="authority-add" @click="newFormVisible=true">
          <i class="iconfont icon-add"></i>新建身份
        </div>
        <template v-for="item in authorityList">
          <p class="authority-silder-title">{{item.label}}</p>
          <authority-silder :authoritylist="item" @check-authority = "authSliderCheckedData" @del-authority="authSliderPop" @refresh-authlist="getRole"></authority-silder>
        </template>
      </el-aside>
      <el-main class="auth-main">
        <authority-main :rolelist = "roleList" :dataPermission = dataPermission :authSliderCheckedName = "authSliderCheckedName" :authSliderData = 'authSliderData' :authSliderCheckedId = 'authSliderCheckedId' @edit-auth="setRolePermission" @refresh-authlist="getRole" @refresh-permission="getRolePermission"></authority-main>
      </el-main>
    </el-container>
    <el-dialog title="新建身份" :visible.sync="newFormVisible"  :modal-append-to-body='false' width="528px">
      <el-form class="authority-silder-form" :model="nameValidateForm" ref="nameValidateForm">
        <el-form-item label="身份名：" prop="authName" :label-width="formLabelWidth" :rules="[{ required: true, message: '身份名不能为空'}]">
          <el-input type="authName" v-model="nameValidateForm.authName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNameForm" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('nameValidateForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>


</template>

<script>
  import AuthoritySilder from './AuthoritySilder'
  import AuthorityMain from './AuthorityMain'
  export default {
      name: "authority",
      components: { AuthoritySilder,AuthorityMain },
      data(){
        return{
          authSliderCheckedId:0,//侧边列表选中的id
          authSliderCheckedName:'',//侧边列表选中的name
          authSliderData:{},//侧边列表选中的data
          firstFlag:true,//判断是不是第一次进来或者是不是删除的选中的值
          // userPermission:{},//当前登录这的权限
          authorityList:[],
          roleList:{},
          dataPermission:{},//数据权限
          newFormVisible:false,
          nameValidateForm:{
            authName:'',
          },
          formLabelWidth: '100px',
        }
      },
      props:{
        userPermission:{
          type:Object,
          required:true
        }
      },
      watch:{
        //监听身份id的变化  用来改变数据权限和操作权限的值
        authSliderCheckedId(value,oldValue){
          console.log(value,oldValue,"ddddd=====");
        },
        authorityList(){
          console.log("变化")
          this.getRolePermission();
        }
      },
      mounted(){
        // var _this = this;
        // if(!_this.userPermission.isAuthPagePermission){ //没有员工管理页面的权限
        //   alert("您没有操作该页面的权限");
        //   _this.$router.replace('/')
        // }else {
        //
        // }
        this.getRole();
      },
      methods:{
        getRole(id){
          var _this = this;
          _this.request({
            method:'post',
            url: '/p-innermgrweb/role/get_role_except_student.do',
            param: {},
            success: function (result) {
              console.log(result.result);
              if(result.code == 200){
                var data = result.result;
                _this.authorityList = data;
                console.log(_this.firstFlag,"flag");
                if(id && id == _this.authSliderCheckedId){
                  _this.firstFlag = true;
                }
                if(_this.firstFlag){
                  _this.firstFlag = false;
                  _this.authSliderData = _this.authorityList[0].role[0];
                  _this.authSliderCheckedId = _this.authorityList[0].role[0].id;
                  _this.authSliderCheckedName = _this.authorityList[0].role[0].name;
                }
                _this.setRoleStatus();
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        },
        //新建身份提交表单
        submitForm(formName) {
          var _this = this;
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              // /role/role_save.do
              _this.request({
                method: 'post',
                url: '/p-innermgrweb/role/role_save.do',
                param: {roleName:_this.nameValidateForm.authName},
                success: function (result) {
                  console.log(result.result);
                  if (result.code == 200) {
                    if(result.result){
                      _this.newFormVisible = false;
                      _this.nameValidateForm.authName = '';
                      _this.getRole();
                      _this.$message({
                        message: '成功添加新身份',
                        type: 'success'
                      });
                    }
                  }
                },
                error: function (error) {
                  //服务器异常
                  console.log(error);
                  _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
                }
              })
            } else {
              return false;
            }
          });
        },
        //取消新建身份隐藏表单
        cancelNameForm(){
          this.newFormVisible = false;
          this.nameValidateForm.authName = '';
          this.$refs['nameValidateForm'].resetFields();
        },
        //设置身份选中默认值
        setRoleStatus(){
          var _this = this;
          //设置默认值
          for(var i = 0;i< _this.authorityList.length;i++){
            for(var j = 0;j<_this.authorityList[i].role.length;j++){
              _this.authorityList[i].role[j].status = false;//用户是否选中
              _this.authorityList[i].role[j].visible = false;//是否显示删除气泡
              if(_this.authSliderCheckedId == _this.authorityList[i].role[j].id){
                _this.authorityList[i].role[j].status = true;//用户是否选中
                _this.authSliderCheckedName = _this.authorityList[i].role[j].name;
              }
            }
          }
        },
        //获取该身份的数据权限和操作权限
        getRolePermission(){
          var _this = this;
          _this.request({
            method: 'post',
            url: '/p-innermgrweb/permission/get_role_permission.do',
            param: {roleId:_this.authSliderCheckedId},
            success: function (result) {
              console.log(result.result);
              if (result.code == 200) {
                var data = result.result;
                _this.roleList = data;
                _this.dataPermission = data.dataPermission;
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error, location.hostname);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        },
        //修改操作权限
        setRolePermission(dataList){
          console.log(dataList,"设置权限");
          var _this = this;
          _this.request({
            method: 'post',
            url: '/p-innermgrweb/permission/update_role_permission.do',
            param: {roleId:_this.authSliderCheckedId,permissionGroup:JSON.stringify(dataList)},
            success: function (result) {
              console.log(result);
              if (result.code == 200) {
                var data = result.result;
                _this.getRolePermission();
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error, location.hostname);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        },
        //删除身份气泡显示
        authSliderPop(data){
          console.log(data,"aaa==");
          var _this = this;
          for(var i = 0;i< _this.authorityList.length;i++){
            for(var j = 0;j<_this.authorityList[i].role.length;j++){
              _this.authorityList[i].role[j].visible = false;//是否显示删除气泡
            }
          }
          data.visible = true;
          _this.authorityList = JSON.parse(JSON.stringify(_this.authorityList));

        },
        //选中身份后传值
        authSliderCheckedData(data){
          console.log(data,"选中的值");
          var _this = this;
          for(var i = 0;i< _this.authorityList.length;i++){
            for(var j = 0;j<_this.authorityList[i].role.length;j++){
              _this.authorityList[i].role[j].status = false;//用户是否选中
              _this.authorityList[i].role[j].visible = false;//是否显示删除气泡
            }
          }
          data.status = true;
          _this.authorityList = JSON.parse(JSON.stringify(_this.authorityList));
          this.authSliderCheckedId = data.id;
          this.authSliderData = data;
          this.authSliderCheckedName = data.name;
        }
      }

  }
</script>

<style scoped lang="scss">
  .authority-add{
    width:240px;
    height:64px;
    border-radius: 4px;
    border: dashed 1px #d9d9d9;
    box-sizing: border-box;
    text-align: center;
    line-height:64px;
    font-size: 16px;
    color: #909090;
    margin-left:20px;
    cursor:pointer;
    i{
      margin-right:8px;
    }
  }
  .authority-add:hover{
    border: dashed 1px #F08D00;
    color: #F08D00;
  }
  .authority-silder-title{
    margin-top:24px;
    font-size: 14px;
    line-height: 1.57;
    color: #c0c0c0;
    margin-left:20px;
  }
  .auth-header{
    padding-left:0;
    height:auto!important;
    position:relative;
    padding:24px;
    background:#fff;
    img{
      width:135px;
      height:92px;
      position:absolute;
      top:38px;
      right:60px;
    }
  }

  .auth-title{
    font-size:20px;
    margin:12px 0;
    line-height: 1.4;
    color: #262626;
  }
  .auth-discript{
    font-size: 14px;
    line-height: 1.57;
    color: #606060;
    margin-bottom:13px;
  }
  .del-record{
    font-size: 14px;
    line-height: 1.57;
    color: #F08D00;
  }
  .el-breadcrumb__separator{
    margin: 0 32px;
  }
  /*.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{*/
    /*font-weight:300;*/
  /*}*/
  .auth-main{
    background:#fff;
    padding-bottom:0;
    border: solid 1px #e8e8e8;
    margin-right:20px;
    max-height:860px;
    overflow-y:auto;
  }
</style>
