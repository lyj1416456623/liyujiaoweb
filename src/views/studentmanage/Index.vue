<template>
  <el-container>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">学生管理</a>
      </el-breadcrumb>
      <h4 class="common-title">学生管理</h4>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <el-button type="primary" plain @click="addStudent">添加学生</el-button>
          <div class="select-block">
            <el-checkbox v-model="ifBindWx" class="wx-checkbox">只看微信未绑定</el-checkbox>
            <span>搜索条件</span>：
            <el-select v-model="queryType" placeholder="请选择" style="width:92px;float:right">
              <el-option
                v-for="item in options"
                :key="item.queryValue"
                :label="item.queryName"
                :value="item.queryValue">
              </el-option>
            </el-select>
          </div>
          <el-input
            debounce
            @change="searchEmployee"
            :placeholder="placeholderText"
            v-model="searchText"
            v-if="queryType != 'STUDENT_ACCOUNT'">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-input
            debounce
            @change="searchEmployee"
            placeholder="搜索学生手机号"
            v-model="searchTextPhone"
            type="number"
            v-if="queryType == 'STUDENT_ACCOUNT'">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="main-organ">
          <el-table :data="studentTableData" style="width: 100%">
            <el-table-column label="学生名" min-width="10%">
              <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="账号" min-width="15%">
              <template slot-scope="scope">
                <span>{{scope.row.userAccount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="微信昵称" min-width="20%">
              <template slot-scope="scope">
                <span>{{scope.row.wxNickName?scope.row.wxNickName:'未绑定'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程" min-width="35%">
              <template slot-scope="scope">
                <span v-if="scope.row.zyClass.length>0">{{scope.row.zyClass[0].courseName}}</span>
                <el-popover placement="bottom" width="212" height="268" trigger="hover"
                            v-if="scope.row.zyClass.length>0">
                  <div class="popover-detail-block">
                    <div class="popover-detail" v-for="item in scope.row.zyClass">
                      <h2><span class="popover-detail-title">{{item.courseName}}</span></h2>
                      <p>班级：<span>{{item.className}}</span></p>
                      <p>班主任：<span>{{item.masterName?item.masterName:'--'}}</span></p>
                      <p>老师：<span>{{item.teacherName}}</span></p>
                    </div>
                  </div>
                  <span class="student-option student-detail" slot="reference">详情</span>
                </el-popover>
                <span v-if="scope.row.zyClass.length==0">--</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <span class="student-option edit-option" @click="editStudent(scope.row)">编辑</span>
                <el-popover placement="bottom" v-model="scope.row.ifbind" width="280"
                            trigger="click" v-if="scope.row.wxNickName">
                  <p class="popover-option"><i class="iconfont icon-warning-circle-fill"></i>确定要解除微信绑定嘛？</p>
                  <div style="text-align: right; margin: 20px 0 0">
                    <el-button size="mini" @click="cancelUnbindWechat(scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="unbindWechat(scope.row)">确定</el-button>
                  </div>
                  <span class="student-option" slot="reference">解除微信绑定</span>
                </el-popover>
              </template>
            </el-table-column>
            <div slot="empty" v-if="searchText==''">
              <p>还没有学生哦！</p>
            </div>
            <div slot="empty" v-if="searchText!=''">
              <p>没有你要找的学生哦！</p>
            </div>
          </el-table>
          <div class="block" v-if="studentTotal!=0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="studentTotal">
            </el-pagination>
          </div>
        </div>
      </el-main>
      <!--微信绑定-->
      <el-dialog
        title="如何绑定微信"
        :modal-append-to-body='false'
        :visible.sync="wechatFlag"
        :close-on-click-modal="false"
        width="40%">
        <div class="dialog-img">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/ziyuec.jpeg" alt="">
        </div>
      </el-dialog>
      <!--添加编辑学生-->
      <el-dialog
        :title="studentFormTitle"
        :modal-append-to-body='false'
        :visible.sync="addStudentFormFlag"
        width="40%">
        <el-form ref="studentForm" :rules="studentFormRules" :model="studentForm" label-width="100px">
          <el-form-item label="手机号：" prop="studentAccount">
            <el-input v-model.number="studentForm.studentAccount" placeholder="请输入家长手机号码" :disabled="ifEdit"></el-input>
          </el-form-item>
          <el-form-item label="学生名：" prop="studentName">
            <el-input v-model="studentForm.studentName" placeholder="请输入学生名"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetAddStudent('studentForm')">取 消</el-button>
          <el-button type="primary" @click="submitAddStudent('studentForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Index",
    data() {
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号应该是 11 位的数字呢！'));
        } else {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('学生名不能为空哦！'));
        } else {
          callback();
        }
      };
      return {
        wechatFlag: false,//如何绑定微信
        searchText: '',//搜索的学生名/手机号
        studentTableData: [],//学生数据
        studentTotal: 0,//学生总数
        pageSize: 10,
        page: 1,
        studentForm: {
          studentAccount: "", //手机号码
          studentName: "" //学生姓名
        },//学生form
        addStudentFormFlag: false,//添加学生窗口显示
        ifEdit: false,//是否是编辑
        studentFormTitle: "添加学生信息",//添加学生窗口显示题目
        studentId: '',//编辑学生的时候需要的学生id
        studentFormRules: {
          studentAccount: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          studentName: [
            {validator: validateName, trigger: 'blur'}
          ],
        },
        //搜索条件
        options: [{
          queryValue: 'COURSE_NAME',
          queryName: '课程名'
        }, {
          queryValue: 'STUDENT_NAME',
          queryName: '学生名'
        }, {
          queryValue: 'STUDENT_ACCOUNT',
          queryName: '手机号'
        }],
        queryType: 'COURSE_NAME',
        placeholderText: '搜索课程名',
        ifBindWx: false, //筛选 true未绑定微信   false 全部
        searchTextPhone: '',//搜索学生手机号
        submitFlag:true,
      }
    },
    mounted() {
      //获取学生信息
      this.getStudentData();
    },
    watch: {
      queryType(val) {
        if (val == 'COURSE_NAME') {
          this.placeholderText = '搜索课程名';
        } else if (val == 'STUDENT_NAME') {
          this.placeholderText = '搜索学生名';
        }
        this.page = 1;
        if (this.searchText != '') {
          this.searchText = '';
          this.searchTextPhone = '';
          this.getStudentData();
        }
      },
      ifBindWx() {
        this.page = 1;
        this.getStudentData();
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getStudentData();
        console.log(`当前页: ${val}`);
      },
      //是否绑定微信过滤
      filterHandler(value, row, column) {
        console.log(value, row, column, "过滤");
      },
      //搜索课程名或者学生名或者学生手机号
      searchEmployee() {
        var _this = this;
        _this.page = 1;
        _this.getStudentData();
      },
      //获取学生列表
      getStudentData() {
        var _this = this;
        console.log(_this.searchTextPhone, "s手机号");
        var data = {
          "page": _this.page,
          "rows": _this.pageSize,
          "queryType": _this.queryType,
          "queryValue": _this.queryType == 'STUDENT_ACCOUNT' ? _this.searchTextPhone : _this.searchText
        }
        if (_this.ifBindWx) {
          data.ifBindWx = false;
        }
        _this.request({
          method: 'post',
          url: '/student/get_all_student.do',
          param: data,
          success: function (result) {
            if (result.code == 200) {
              var data = result.result;
              _this.studentTableData = data.data;
              _this.studentTotal = data.total;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取学生错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //添加学生
      addStudent() {
        //显示添加学生窗口
        this.ifEdit = false;
        this.studentFormTitle = "添加学生信息";
        this.addStudentFormFlag = true;
      },
      //编辑学生
      editStudent(data) {
        console.log(data, "学生数据单条");
        //显示添加学生窗口
        this.ifEdit = true;
        this.studentFormTitle = "编辑学生信息";
        this.addStudentFormFlag = true;
        this.studentForm.studentAccount = data.userAccount;
        this.studentForm.studentName = data.userName;
        this.studentId = data.id;
      },
      //取消添加、编辑学生
      resetAddStudent(formName) {
        this.$refs[formName].resetFields();
        console.log(this.studentForm, "表单");
        this.addStudentFormFlag = false;
        this.studentForm.studentAccount = ""
        this.studentForm.studentName = "";
      },
      //确定添加、编辑学生
      submitAddStudent(form) {
        let _this = this;
        _this.$refs[form].validate((valid) => {
          if (valid) {
            var url = _this.ifEdit ? '/student/update_student_name.do' : '/student/save_student.do';
            var editData = {
              "studentId": _this.studentId,
              "studentName": _this.studentForm.studentName
            }
            var data = _this.ifEdit ? editData : _this.studentForm;
            console.log(data, "添加或编辑提交的数据");
            if (_this.submitFlag) {
              _this.submitFlag = false;
              _this.request({
                method: 'post',
                url: url,
                param: data,
                success: function (result) {
                  if (result.code == 200) {
                    if (_this.ifEdit) {
                      _this.$message({
                        message: '已编辑学生',
                        type: 'success'
                      });
                    } else {
                      _this.$message({
                        message: '已添加学生',
                        type: 'success'
                      });
                    }
                    _this.submitFlag = true;
                    _this.resetAddStudent(form);
                    //刷新当前学生信息的数据
                    _this.page = 1;
                    _this.getStudentData();
                  } else if (result.code == 501) {
                    _this.submitFlag = true;
                    _this.$message.error(result.message);
                  }

                },
                error: function (error) {
                  _this.submitFlag = true;
                  //服务器异常
                  _this.$message.error('添加学生错误,网络加载失败，去右上角菜单中刷新页面。')
                }
              })
            }
          }
        });
      },
      //确定解除学生绑定
      unbindWechat(data) {
        console.log(data, "ddddd");
        data["ifbind"] = false;
        var _this = this;
        _this.request({
          method: 'post',
          url: '/student/remove_student_wx_bind.do',
          param: {studentAccount: data.userAccount},
          success: function (result) {
            if (result.code == 200) {
              _this.$message({
                message: '已解除绑定',
                type: 'success'
              });
              //刷新当前学生信息的数据
              _this.page = 1;
              _this.getStudentData();
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('解除绑定错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //点击邀请绑定微信
      bindStudent() {
        this.wechatFlag = true;

      },
      // 学生table的pop中所有的属性都清空值,避免编辑其他学生的时候 混淆
      cancelUnbindWechat(data) {
        let _this = this;
        //控制编辑的popOver是否显示
        data["ifbind"] = false; //取消解除学生绑定的pop是否显示
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../style/tag.css";

  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
    .select-block {
      flex: 1;
      text-align: right;
      padding-right: 8px;
      line-height: 40px;
      color: #606060;
      .wx-checkbox {
        margin-right: 24px;
      }
    }
  }

  .main-organ {
    margin-top: 20px;
  }

  .student-option {
    padding-right: 15px;
    border-right: 1px solid #F0F0F0;
    color: #f08d00;
    cursor: pointer;
  }

  .student-option:last-child {
    padding-left: 15px;
    border: none;
    padding-right: 0;
  }

  .student-option.el-popover__reference {
    padding-left: 15px;
    cursor: pointer;
  }

  .edit-option {
    padding-left: 0 !important;
  }

  .student-option.el-popover__reference {
    border: none;
  }

  .popover-option {
    margin-top: 10px;
    font-size: 14px;
    i {
      margin-right: 10px;
      color: #FAAD14;
    }
  }

  .student-detail.el-popover__reference {
    padding-left: 0;
  }

  .popover-detail {
    padding: 8px 8px 12px 8px;
    border-top: 1px solid #E8E8E8;
    h2 {
      margin-bottom: 8px;
    }
    .popover-detail-title {
      font-size: 16px;
      font-weight: 400;
      color: #222222;
      line-height: 24px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #606060 !important;
      line-height: 22px;
    }
  }

  .popover-detail:first-child {
    border: 0;
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }

  .dialog-img {
    height: 396px;
    overflow-y: auto;
    img {
      width: 94%;
      margin: 0 auto;
      display: block;
    }
  }
</style>
<style>
  .main-organ .el-table th {
    background-color: #fafafa !important;
  }

  .wx-checkbox .el-checkbox__label {
    font-size: 16px;
    color: #606060;
    font-weight: 400;
  }

  .header-tool input::-webkit-outer-spin-button,
  .header-tool input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .header-tool input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
