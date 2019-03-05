<template>
  <div class="main-organ">
    <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" class="employee-table">
      <el-table-column label="员工姓名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
          <template v-if="userPermission.isEditAuthPermission && scope.row && scope.row.ifFromDingtalk == false">
            <el-popover placement="bottom" v-model="scope.row.visibleNameHsq" width="280" title="修改员工姓名"
                        trigger="click">
              <p>
                <el-input placeholder="请输入内容" clearable v-model="popModifyName"></el-input>
              </p>
              <div style="text-align: right; margin: 20px 0 0">
                <el-button size="mini" @click="clearPopModifyUserInfo(scope.row)">取消</el-button>
                <el-button type="primary" size="mini" @click="modifyUserName(scope.$index, scope.row)">确定</el-button>
              </div>
              <i class="iconfont icon-bianji_m employee-edit-icon" slot="reference"
                 @click="handleEditIconClick('name',scope.row)"></i>
            </el-popover>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
          <template v-if="userPermission.isEditAuthPermission && scope.row&& scope.row.ifFromDingtalk == false">
            <el-popover placement="bottom" v-model="scope.row.visibleMobileHsq" width="280" title="修改手机号"
                        trigger="click">
              <el-form :model="phoneForm" :rules="phoneFormRules" ref="phoneForm">
                <el-form-item label="" prop="phone">
                  <el-input v-model="phoneForm.phone"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right; margin: 20px 0 0">
                  <el-button size="mini" @click="cancelModifyUserPhoneForm('phoneForm',scope.row)">取消</el-button>
                  <el-button type="primary" size="mini" @click="modifyUserPhoneForm('phoneForm',scope.row)">确定
                  </el-button>
                </el-form-item>
              </el-form>
              <i class="iconfont icon-bianji_m employee-edit-icon" slot="reference"
                 @click="handleEditIconClick('mobile',scope.row)"></i>
            </el-popover>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" v-if="externalFlag">
      </el-table-column>
      <el-table-column prop="wechatName" label="微信昵称">
      </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <span>{{scope.row.nameList}}</span>
          <template v-if="userPermission.isEditAuthPermission">
            <el-popover placement="bottom" v-model="scope.row.visibleIdentifyHsq" width="280" title="修改身份"
                        trigger="click">
              <el-select v-model="popModifyIdentityIds" multiple placeholder="请选择">
                <el-option-group v-for="group in identifyListAll" :key="group.order" :label="group.label">
                  <el-option v-for="item in group.role" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-option-group>
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
        <p v-if="!externalFlag && menuChange!=''">没有你要找的员工，换个关键词试一试吧！</p>
        <p v-if="!externalFlag && menuChange==''">还没有员工哦~</p>
      </div>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "MainOrgan",
    data() {
      //手机格式验证
      var validateMobile = (rule, value, callback) => {
        var reg = 11 && /^1[3456789]\d{9}$/;
        if (value == '') {
          callback(new Error('请输入手机号码'));
        } else if (!reg.test(value)) {
          callback(new Error('手机号码格式不正确'));
        } else {
          callback();
        }
      };
      return {
        phoneForm: {
          phone: ''
        }, //编辑外部员工手机号码时,手机号码input的值
        phoneFormRules: {
          phone: [{required: true, validator: validateMobile, trigger: 'blur'}]
        },
        popModifyName: '', //编辑员工时,pop中的员工姓名
        popModifyIdentityIds: [], //编辑员工时,pop中的员工身份id集合
        popModifyKemuIds:[], //编辑员工科目时,pop中员工的授课科目集合
        delUser: '',  //删除的员工
        currpage:1,//当前页数
        pagesize: 10,//显示多少条

      }
    },
    props: {
      //身份列表
      identifyListAll: {
        type: Array,
        required: true
      },

      // 员工的数据表格
      tableData: {
        type: Array,
        required: true
      },

      //当前的员工表格对应的tree的refreshTable的参数
      treeData: {
        type: Object,
        required: true
      },

      //当前用户的权限
      userPermission: {
        type: Object,
        required: true
      },
//      //当前page
//      currentPage:{
//        type:Number,
//        required: true
//      },
//      //总共几条数据
//      totalNum:{
//        type:Number,
//        required: true
//      },
      //是否是外部员工
      externalFlag:{
        type: Boolean,
        required: true
      },
      // 判断搜索是否有值
      menuChange:{
        type:String,
        required:true
      }
    },
    watch: {
      //重置page
//      currentPage(val,oldval){
//        this.currpage = 1;
//      }
    },
    methods: {
      //编辑icon点击时的事件,把'即将要修改的值'传到popModify的对应的属性中
      handleEditIconClick(type, row) {
        console.log(row);
        if (type == 'mobile') { //外部员工手机号
          this.phoneForm.phone = row.mobile;
        } else if (type == 'name') {//外部员工姓名
          this.popModifyName = row.userName;
        } else if(type=='kemu'){ //授课科目
          this.popModifyKemuIds = row.subjectIdList;
        } else { //身份
          this.popModifyIdentityIds = row.roleIdList;
        }
      },

      // 员工table的pop中所有的属性都清空值,避免编辑其他员工的时候 混淆
      clearPopModifyUserInfo(row) {
        let _this = this;
        _this.phoneForm.phone = '';
        _this.popModifyName = '';
        _this.popModifyIdentityIds = '';
        _this.popModifyKemuIds = '';

        //控制编辑的popOver是否显示
        row["visibleNameHsq"] = false; //编辑员工姓名的pop是否显示
        row["visibleMobileHsq"] = false; //编辑手机号的pop是否显示
        row["visibleIdentifyHsq"] = false; //编辑身份的pop是否显示
        row["visibleKemuHsq"] = false; //编辑'授课科目'的pop是否显示
        row["visibleDelPopHsq"] = false; //删除外部员工的pop是否显示
        _this.delUser = {}; //要删除的员工的信息
      },

      //修改外部员工的姓名
      modifyUserName(idx, row) {
        let _this = this;

        let _name = _this.popModifyName;

        _this.request({
          method: 'post',
          url: '/p-innermgrweb/user/update_user_name.do',
          param: {userId: row.userId, userName: _name},
          success: function (result) {

            if (result.code == 200) {
              _this.$message({
                message: '成功修改员工姓名',
                type: 'success'
              });
              _this.$emit('refresh-main-organ', _this.treeData);
            } else {
              _this.$message.error('哦哦,修改员工姓名操作失败')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('修改员工姓名操作失败')
          }
        });

        _this.clearPopModifyUserInfo(row);
      },

      //修改外部员工的手机号
      modifyUserPhoneForm(formName, row) {
        let _this = this;

        _this.$refs[formName].validate((valid) => {
          if (valid) {

            let _mobile = this.phoneForm.phone;

            _this.$refs[formName].resetFields();

            _this.request({
              method: 'post',
              url: '/p-innermgrweb/user/update_user_mobile.do',
              param: {userId: row.userId, mobile: _mobile},
              success: function (result) {

                if (result.code == 200) {
                  _this.$message({
                    message: '成功修改员工手机号',
                    type: 'success'
                  });

                  _this.phoneForm.phone = '';
                  row["visibleMobileHsq"] = false;

                  _this.$emit('refresh-main-organ', _this.treeData);
                } else {
                  _this.$message.error('哦哦,修改员工手机号操作失败了');
                }
              },
              error: function (error) {
                //服务器异常
                _this.$message.error('修改员工手机号码操作失败');
              }
            });

          } else {
            _this.$message.error('手机号码格式不正确');
            return false;
          }
        });

      },

      //取消修改外部员工手机号
      cancelModifyUserPhoneForm(formName, row) {
        let _this = this;
        _this.phoneForm.phone = '';
        row["visibleMobileHsq"] = false;
        _this.$refs[formName].resetFields();
      },

      //修改员工的身份
      modifyUserIdentity(idx, row) {
        let _this = this;

        let _idt = _this.popModifyIdentityIds;

        _this.request({
          method: 'post',
          url: '/p-innermgrweb/role/update.do',
          param: {userId: row.userId, roleIds: _idt.join(',')},
          success: function (result) {

            if (result.code == 200) {
              _this.$message({
                message: '成功修改员工身份',
                type: 'success'
              });
              _this.$emit('refresh-main-organ', _this.treeData);
            } else {
              _this.$message.error('哦哦,修改员工身份操作失败了')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('修改员工身份操作失败')
          }
        });

        _this.clearPopModifyUserInfo(row);
      },

      //修改员工的授课科目
      modifyUserKemu(idx,row){
        console.log('修改授课科目。。。。do',idx,this.popModifyKemuIds)
        console.log(row);

        let _this = this;

        let _idt = _this.popModifyKemuIds;

        _this.request({
          method: 'post',
          url: '/p-innermgrweb/sys/subject/update_user_sys_subject.do',
          param: {userId: row.userId, sysSubjectIds: _idt.join(',')},
          success: function (result) {

            if (result.code == 200) {
              _this.$message({
                message: '成功修改员工授课科目',
                type: 'success'
              });
              _this.$emit('refresh-main-organ', _this.treeData);
            } else {
              _this.$message.error('哦哦,修改员工授课科目失败了')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('修改员工授课科目失败')
          }
        });

        _this.clearPopModifyUserInfo(row);
      },

      //删除员工图标点击
      delOutEmployeeTip(id, row) {
        let _this = this;
        row["visibleDelPopHsq"] = true; //删除外部员工的pop是否显示
        _this.delUser = row;
      },
      listenToMyBoy(currentSect){
        let self = this;
        self.currpage= currentSect;//页码
      },
      listenToMyBoy2(currentSect){
        let self = this;
        self.pagesize = currentSect;//一页显示多少条
      },

      //删除员工(仅针对外部员工)--确认删除
      delOutEmployeeConfirm(row) {
        let _this = this;

        let _tmp_del_user = _this.delUser.userName;

        _this.request({
          method: 'post',
          url: '/p-innermgrweb/user/delete.do',
          param: {userId: _this.delUser.userId},
          success: function (result) {

            if (result.code == 200) {

              _this.clearPopModifyUserInfo(row);
              _this.$message('成功删除外部员工 ' + _tmp_del_user);
              _this.$emit('refresh-main-organ', _this.treeData);

            } else {
              _this.$message.error('哦哦,删除员工失败了');
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('删除员工失败')
          }
        });
      }
    },

  }
</script>

<style scoped lang="scss">
  .employee-table {
    width: 100%;
    margin-top:10px;
    .el-table__body tr {
      .employee-edit-icon {
        display: none;
        color: #F08D00;
      }

      &:hover {
        .employee-edit-icon {
          display: inline-block;
          color: #F08D00;
          cursor: pointer;
        }
      }
    }
  }

  .el-select {
    width: 100%;
  }
</style>
<style lang="scss">
  /*样式放在scoped中无效,所以放在这里了*/
  .employee-table .el-table__body .employee-td-del,
  .employee-table .el-table__body tr td:last-child {
    .cell {
      text-align: right !important;
    }

  }
</style>
