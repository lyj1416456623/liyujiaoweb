<template>
  <div class="authority-main">
    <div class="authority-role-name">
      <h3 v-if="!editStatus">{{authSliderCheckedName}}<i class="iconfont icon-bianjizhu" @click="editNameStatus"
                                                         v-if="authSliderData.type!='default'"></i></h3>
      <div class="authority-role-name-edit" v-if="editStatus">
        <input type="text" v-model="authSliderName">
        <button class="auth-button save-button" @click="saveRoleName(authSliderData)">保存</button>
        <button class="auth-button cancel-button" @click="cancelEdit">取消</button>
      </div>
    </div>
    <div class="authority-content">
      <el-container>
        <el-aside width="200px" class="authority-main-slider">
          <p class="authority-content-title">数据权限</p>
          <el-radio-group v-model="dataPermission.dataPermission" @change="updatePermission"
                          :disabled="!dataPermission.status">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">上级部门及其下属部门</el-radio>
            <el-radio :label="3">所在部门及下属部门</el-radio>
            <el-radio :label="4">个人</el-radio>
          </el-radio-group>
        </el-aside>
        <el-main class="authority-content-main" style="padding-top:0">
          <p class="authority-content-title">操作权限</p>
          <div class="authority-content-block" v-for="item in rolelist.resourcePermission">
            <h3>{{item.groupName}}</h3>
            <div class="authority-checkbox">
              <!-- `checked` 为 true 或 false -->
              <template v-for="opt in item.child">
                <el-checkbox v-model="opt.ifHasPermission" v-if="opt.status"
                             @change="handleCheckedChange(item,opt)">{{opt.groupName}}
                </el-checkbox>
                <el-tooltip content="你只能修改你拥有的权限哦" placement="top" v-else>
                  <el-checkbox v-model="opt.ifHasPermission" disabled>{{opt.groupName}}</el-checkbox>
                </el-tooltip>
              </template>
            </div>
            <!--<div class="authority-switch">-->
            <!--<template v-if="item.status">-->
            <!--<el-switch v-model="item.ifHasPermission" @change="handleCheckedChange(item)">-->
            <!--</el-switch>-->
            <!--</template>-->
            <!--<template v-else>-->
            <!--<el-tooltip content="你只能修改你拥有的权限哦" placement="top">-->
            <!--<el-switch-->
            <!--disabled-->
            <!--v-model="item.ifHasPermission"-->
            <!--&gt;-->
            <!--</el-switch>-->
            <!--</el-tooltip>-->
            <!--</template>-->

            <!--</div>-->
          </div>
        </el-main>
      </el-container>
    </div>
  </div>

</template>

<script>
  export default {
    name: "authorityMain",
    props: {
      rolelist: {
        type: Object,
        required: true
      },
      authSliderCheckedName: {
        type: String,
        required: true
      },
      authSliderCheckedId: {
        type: Number,
        required: true
      },
      authSliderData: {
        type: Object,
        required: true
      },
      dataPermission: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editStatus: false,//是否编辑身份
        authSliderName: this.authSliderCheckedName
      }
    },
    mounted() {
      console.log(this.authSliderCheckedName, "authSliderName");
    },
    methods: {
      //点击编辑身份名称
      editNameStatus() {
        this.editStatus = true;
        this.authSliderName = this.authSliderCheckedName;
      },
      //取消编辑身份
      cancelEdit() {
        this.editStatus = false;
      },
      //修改身份名
      saveRoleName(data) {
        console.log(data, "修改身份名");
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/role/role_update.do',
          param: {roleId: data.id, roleName: _this.authSliderName},
          success: function (result) {
            console.log(result.result);
            if (result.code == 200) {
              if (result.result) {
                _this.editStatus = false;
                // _this.authSliderCheckedName = _this.authSliderName;
                _this.$emit("refresh-authlist");
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error, location.hostname);
          }
        })
      },
      //修改数据权限
      updatePermission(val) {
        var _this = this;
        console.log(val, _this.authSliderCheckedId, "val");
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/permission/update_role_dataPermission.do',
          param: {roleId: _this.authSliderCheckedId, dataPermission: val},
          success: function (result) {
            console.log(result.result);
            if (result.code == 200) {
              if (result.result) {
                _this.$emit("refresh-permission");
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error, location.hostname);
          }
        })
      },
      //修改操作权限
      handleCheckedChange(data,opt){
        console.log(data,opt);
        var postArr = [];
        if(opt.id != data.child[0].id ){
          if(opt.ifHasPermission && !data.child[0].ifHasPermission){
            postArr.push({"id":data.child[0].id,"ifHasPermission":true},{"id":opt.id,"ifHasPermission":true});
            console.log(postArr,"logout");
          }else if(opt.ifHasPermission && data.child[0].ifHasPermission){
            postArr.push({"id":opt.id,"ifHasPermission":true});
          }else if(!opt.ifHasPermission){
            postArr.push({"id":opt.id,"ifHasPermission":false});
          }
        }else{
          console.log(opt.ifHasPermission);
          if(!opt.ifHasPermission){
            postArr.push({"id":opt.id,"ifHasPermission":false});
            for(var i = 0;i<data.child.length;i++){
              if(data.child[i].ifHasPermission){
                data.child[i].ifHasPermission = false;
                postArr.push({"id":data.child[i].id,"ifHasPermission":false});
              }
            }
          }else{
            postArr.push({"id":opt.id,"ifHasPermission":true})
          }
        }
        console.log(postArr,"发送的数据");
        this.$emit("edit-auth",postArr);
      },
    }
  }
</script>

<style lang="scss">
  .authority-main {
    height: 100%;
  }

  .authority-main-slider {
    border-right: 1px solid #e8e8e8;
  }

  .authority-role-name {
    h3 {
      font-size: 20px;
      /*font-weight: 500;*/
      line-height: 1.4;
      color: #262626;
      i {
        margin-left: 40px;
        color: #F08D00;
        cursor: pointer;
      }
    }

  }

  .authority-role-name-edit {
    input {
      width: 360px;
      background: none;
      outline: none;
      border: 0px;
      border-bottom: 2px solid #F08D00;
      padding-bottom: 6px;
      font-size: 16px;
    }
  }

  .auth-button {
    margin: 0;
    padding: 0;
    border: 1px solid transparent; //自定义边框
    outline: none; //消除默认点击蓝色边框效果
    width: 65px;
    height: 32px;
    border-radius: 4px;
    background-color: #F08D00;
    font-size: 14px;
    line-height: 1.57;
    color: #ffffff;
    cursor: pointer;
  }

  .cancel-button {
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    color: rgba(0, 0, 0, 0.65);
  }

  .authority-content {
    margin-top: 34px;
  }

  .authority-content-main {
    padding: 0 20px 169px;
  }

  .authority-content-title {
    font-size: 14px;
    line-height: 1.57;
    color: #909090;

  }

  .authority-content-block {
    position: relative;
    h3 {
      margin-top: 24px;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.75;
      color: #262626;
    }
    border-bottom: 1px solid #e8e8e8;
    .authority-checkbox {
      padding: 16px 0 7px;
    }
    .authority-switch {
      position: absolute;
      top: 32px;
      right: 20px;
    }
  }

</style>
<style>
  /*修改单选框样式*/
  .authority-main .el-radio {
    display: block;
    margin-top: 24px;
  }

  .authority-main .el-radio + .el-radio {
    margin-left: 0;
  }
  .authority-main .el-checkbox{
    margin-left:0;
    margin-right: 30px !important;
    margin-bottom:16px;
  }

</style>
