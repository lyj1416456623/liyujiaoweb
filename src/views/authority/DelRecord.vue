<template>
  <el-container>
    <el-header class="auth-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manage' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/manage' }">身份与权限</router-link>
        <span>/</span>
        <router-link :to="{ path: '/delrecord' }">删除记录</router-link>
      </el-breadcrumb>
      <h4 class="auth-title">删除记录</h4>
    </el-header>
    <div class="del-record-content">
      <div class="time-height" v-for="item in recordList">
        <time-line :recordList="item" :recordType="'max-width:850px'"></time-line>
      </div>
    </div>
  </el-container>
</template>

<script>
  import TimeLine from "./TimeLine";

  export default {
    name: "delRecord",
    data() {
      return {
        recordList: []
      }
    },
    mounted() {
      this.getRoleDelRecord()
    },
    components: {TimeLine},
    methods: {
      getRoleDelRecord() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/log/get_role_delete_log.do',
          param: {},
          success: function (result) {
            console.log(result.result);
            if (result.code == 200) {
              if (result.result) {
                _this.recordList = result.result;
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .auth-header {
    padding-left: 0;
    height: auto !important;
    position: relative;
    padding: 24px;
    background: #fff;
  }

  .ziyue-breadcrumb {
    font-size: 14px;
    line-height: 1.57;
    color: #909090;
    .active {
      color: #c099ff;
    }
    .active:hover {
      color: #F08D00;
      text-decoration: underline;
    }
    span {
      margin: 0 32px;
    }
  }

  .auth-title {
    font-size: 20px;
    margin-top: 12px;
    font-weight: 500;
    line-height: 1.4;
    color: #262626;
  }

  .del-record-content {
    padding: 37px 40px;
  }
</style>
