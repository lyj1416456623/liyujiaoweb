<template>
  <div class="management-index-box">
    <el-container>
      <el-header class="auth-header">
        <el-breadcrumb class="ziyue-breadcrumb">
          <router-link :to="{ path: '/manageIndex' }">首页</router-link>
          <span>/</span>
          <a href="javascript:void(0)">员工管理</a>
        </el-breadcrumb>
        <h4 class="auth-title">员工管理</h4>
        <p class="auth-discript">员工信息从钉钉导入。如需修改，可以在钉钉修改后同步到当前系统中</p>
        <template>
          <el-dialog
            :modal-append-to-body='false'
            :visible.sync="dialogSyncDingVisible"
            width="33%" :show-close='false' :close-on-click-modal="false">
            <div class="sync-box">
              <img src="//onlinetest-public.oss-cn-beijing.aliyuncs.com/xiniao/sync-ding.png" alt="" class="sync-img">
              <p class="sync-txt">正在与钉钉同步员工信息 …</p>
            </div>
          </el-dialog>
          <el-button plain class="dingding" @click="syncDingTalk"><i class="iconfont icon-dingding"></i>与钉钉同步</el-button>
        </template>
      </el-header>
      <el-container class="management-content">
        <el-main>
          <div class="header-tool">
            <div></div>
            <el-input
              debounce
              @keyup.13.native="searchEmployee"
              placeholder="搜索员工姓名/手机号"
              v-model="query">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="main-organ">
            <el-table :data="tableData" class="employee-table">
              <el-table-column label="员工姓名">
                <template slot-scope="scope">
                  <span>{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号">
                <template slot-scope="scope">
                  <span>{{scope.row.userAccount}}</span>
                </template>
              </el-table-column>
              <el-table-column label="身份">
                <template slot-scope="scope">
                  <span>{{scope.row.roleNames}}</span>
                  <template>
                    <el-popover placement="bottom" v-model="scope.row.ifEdit" width="280" title="修改身份"
                                trigger="click">
                      <el-select v-model="popModifyIdentityIds" multiple placeholder="请选择">
                        <el-option
                          v-for="item in identifyListAll"
                          :key="item.id"
                          :label="item.roleName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <div style="text-align: right; margin: 20px 0 0">
                        <el-button size="mini" @click="clearPopModifyUserInfo(scope.row)">取消</el-button>
                        <el-button type="primary" size="mini" @click="modifyUserIdentity(scope.$index, scope.row)">确定
                        </el-button>
                      </div>
                      <i class="iconfont icon-bianji_m icon-bianji" slot="reference"
                         @click="handleEditIconClick('role',scope.row)"></i>
                    </el-popover>
                  </template>
                </template>
              </el-table-column>
              <div slot="empty">
                <p>没有你要找的员工，换个关键词试一试吧！</p>
              </div>
            </el-table>
            <div class="block" v-if="totalNum>0">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="rows"
                layout="prev, pager, next"
                :total="totalNum">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  export default {
    name: "management",
    data() {
      return {
        dialogSyncDingVisible: false, //同步钉钉时的弹窗dialog是否显示
        syncDingFlag: false, // 当前登录者是否有同步钉钉的权限
        syncDingCacheId: '', // 同步钉钉的cacheid
        query: '',//员工搜索条件
        identifyListAll: [],  //所有的身份列表
        popModifyIdentityIds: [],//当前编辑的身份id
        tableData: [], //员工列表中显示的数据(搜索后,只显示符合条件的员工)
        rows: 10, //每页10条数据
        page: 1, //总共几页
        totalNum: 0, //总共几条数据
      }
    },
    props: {
      userPermission: {
        type: Object,
        required: true
      }
    },
    mounted() {
      let _this = this;
      this.getTableData();//获取员工列表
      this.getAllIdentify(); //身份列表
    },
    methods: {
      //编辑icon点击时的事件,把'即将要修改的值'传到popModify的对应的属性中
      handleEditIconClick(type, row) {
        console.log(row);
        var roleList = row.roles;
        this.popModifyIdentityIds = [];
        roleList.map(v => {
          this.popModifyIdentityIds.push(v.id);
        })
      },
      handleCurrentChange(val) {
        console.log(val,"dddd");
        this.page = val;
        this.getTableData();
      },
      //获取符合条件的员工列表--调用接口
      getTableData() {
        let _this = this;
        let param = {
          page: _this.page,
          rows: _this.rows,
          query: _this.query,
        };
        _this.request({
          method: 'post',
          url: '/user/get_sys_user.do',
          param: param,
          success: function (result) {
            if (result.code == 200) {
              let data = result.result;
              _this.tableData = data.data;
              _this.totalNum = data.total;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取员工失败,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },

      //搜索员工
      searchEmployee(inputVal) {
        var _this = this;
        console.log('搜索', this.query);
        _this.page = 1;
        _this.getTableData();
      },

      //获得所有的身份
      getAllIdentify() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/role/get_all_role.do',
          param: {},
          success: function (result) {
            if (result.code == 200) {
              console.log(result, "身份");
              var data = result.result;
              _this.identifyListAll = data;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      // 员工table的pop中所有的属性都清空值
      clearPopModifyUserInfo(row) {
        let _this = this;
        //控制编辑的popOver是否显示
        row["ifEdit"] = false; //编辑员工姓名的pop是否显示
      },
      //修改员工的身份
      modifyUserIdentity(idx, row) {
        let _this = this;
        let _idt = _this.popModifyIdentityIds;
        _this.request({
          method: 'post',
          url: '/user/role/update_user_role.do',
          param: {userAccount: row.userAccount, roleIds: _idt.join(',')},
          success: function (result) {
            if (result.code == 200) {
              _this.$message({
                message: '成功修改员工身份',
                type: 'success'
              });
              _this.clearPopModifyUserInfo(row);
              _this.getTableData();
            } else {
              _this.$message.error('哦哦,修改员工身份操作失败了')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('修改员工身份操作失败')
          }
        });
      },
      //与钉钉同步
      syncDingTalk(){
        var _this = this;
        _this.dialogSyncDingVisible = true;
        _this.request({
          method: 'post',
          url: '/user/sync_ding_talk.do',
          param: {},
          success: function (result) {
            if (result.code == 200) {
              if(result.result){
                _this.dialogSyncDingVisible = false;
                _this.page = 1;
                _this.getTableData();
                _this.$message({
                  message: '同步钉钉成功',
                  type: 'success'
                });
              }
            }else{
              _this.dialogSyncDingVisible = false;
              _this.$message.error('同步钉钉员工失败')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('同步钉钉员工失败')
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
  }

  .auth-header {
    height: auto !important;
    position: relative;
    padding: 24px;
    background: #fff;

    .dingding {
      position: absolute;
      top: 46px;
      right: 64px;
      border-color: #F08D00;
      color: #F08D00;
      background: #fff;

      .icon-dingding {
        margin-right: 10px;
        display: inline-block;
      }

      &:hover {
        background: #FEF6EB;
        color: #F08D00;
        border-color: #F08D00;
      }
    }
  }

  .auth-title {
    font-size: 20px;
    margin-bottom: 12px;
    line-height: 1.4;
    color: #262626;
  }

  .auth-discript {
    font-size: 14px;
    line-height: 1.57;
    color: #606060;
  }

  .sync-box {
    width: 100%;
    .sync-img {
      display: block;
      width: 90%;
      margin: 0 auto 50px;

    }
    .sync-txt {
      text-align: center;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: rgba(96, 96, 96, 1);
      line-height: 24px;
      padding: 0 0 50px 0;
    }
  }

  /*content*/
  .management-content {
    margin: 24px;
    background: #fff;
  }
  .main-organ{
    margin-top:20px;
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
</style>
<style>
  .management-index-box .el-select {
    display: block !important;
  }
</style>

