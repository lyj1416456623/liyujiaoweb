<template>
  <div class="xi-container classmanage">
    <el-header class="auth-header classmanage-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link class="active" :to="{'path':'/courseManage'}">课程管理</router-link>
        <span>/</span>
        <a class="active" href="javascript:void(0)">课程详情</a>
      </el-breadcrumb>
      <h4 class="auth-title"><span v-if="courseDetail.gradeValue" :class="'ziyue-'+courseDetail.grade">{{courseDetail.gradeValue}}</span>{{courseDetail.courseName}}
      </h4>
    </el-header>
    <p class="class-total">当前共{{courseTable.length}}个班级</p>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <el-button type="primary" plain @click="addClass">添加班级</el-button>
        </div>
        <div class="tag-detail-list">
          <div class="tag-detail-item">
            <el-table :data="courseTable" ref="courseTable">
              <el-table-column prop="className" label="班级名" min-width="25%">
                <template slot-scope="scope">
                  <span>{{scope.row.className}}</span>
                </template>
              </el-table-column>
              <el-table-column label="老师" prop="teacherName" min-width="15%">
                <template slot-scope="scope">
                  <span v-if="scope.row.teacher">{{scope.row.teacher.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="班主任" min-width="15%">
                <template slot-scope="scope">
                  <span>{{scope.row.master?scope.row.master.userName:'--'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="学生人数" min-width="10%">
                <template slot-scope="scope">
                  <span style="color:#F08D00" v-if="!scope.row.students||(scope.row.students && scope.row.students.length==0)">0人</span>
                  <el-popover placement="bottom" height="268" trigger="hover" popper-class="popover-course" v-else>
                    <div class="popover-detail-block">
                      <p v-for="item in scope.row.students">{{item.userName}}</p>
                    </div>
                    <span class="student-option student-detail" slot="reference">{{scope.row.students.length}}人</span>
                  </el-popover>
                  <i class="iconfont icon-bianji" style="color:#F08D00;margin-left:8px;cursor:pointer"
                     @click="editStudent(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column label="课节数" min-width="10%">
                <template slot-scope="scope">
                  <span>{{scope.row.lessonCount}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="25%">
                <template slot-scope="scope">
                  <span class="student-option" @click="seeLesson(scope.row)">查看课节</span>
                  <span class="student-option" @click="editClass(scope.row)">编辑</span>
                  <span class="student-option" @click="delClass(scope.row)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block" v-if="courseTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="rows"
              layout="prev, pager, next"
              :total="courseTotal">
            </el-pagination>
          </div>
        </div>
        <!--编辑班级的弹窗-->
        <el-dialog class="editClassDialog" :title="classNameDialog" :visible.sync="dialogFormVisible" append-to-body :close-on-click-modal="false"
                   :before-close="dialogCancel"
                   width="496px">
          <el-form :model="editClassForm" :rules="rules" ref="ruleForm">
            <el-form-item label="班级名：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="editClassForm.name" placeholder="请输入班级名"></el-input>
            </el-form-item>
            <el-form-item label="班主任：" :label-width="formLabelWidth" prop="masterId">
              <el-select v-model="editClassForm.masterId" placeholder="请选择班主任" filterable>
                <el-option v-for="(masterItem,mIdx) in teacherList" :key="'m'+mIdx" :label="masterItem.userName"
                           :value="masterItem.userAccount"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="老师：" :label-width="formLabelWidth" prop="teacherId">
              <el-select v-model="editClassForm.teacherId" placeholder="请选择老师" filterable>
                <el-option v-for="(teacher,tIdx) in teacherList" :key="'t'+tIdx" :label="teacher.userName"
                           :value="teacher.userAccount"></el-option>
              </el-select>
              <p style="color:#F08D00;line-height: 22px" v-if="ifEdit&&teacherId!=editClassForm.teacherId">所有未上课节的老师也会更换为“{{teacherListObj[editClassForm.teacherId]}}”哦!</p>
            </el-form-item>
            <el-form-item label="学生上限：" :label-width="formLabelWidth" prop="studentNum">
              <el-input-number v-model="editClassForm.studentNum" :min="1" label="学生上限"
                               class="student-num"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="saveEditClass('ruleForm')" :disabled="!submitFlag">确 定</el-button>
          </div>
        </el-dialog>
        <!--编辑学生-->
        <el-dialog class="editClassDialog" :title="studentDialog" :visible.sync="studentDialogFlag" append-to-body :close-on-click-modal="false"
                   width="496px">
          <el-form :model="studentForm" ref="studentForm">
            <el-form-item label="学生：" :label-width="formLabelWidth">
              <el-select v-model="studentForm.studentIds" filterable multiple placeholder="请添加学生">
                <el-option v-for="(stu,index) in studentList" :key="'st'+index" :label="stu.userName+stu.userAccount.substr(-4,4)"
                           :value="stu.userAccount"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editstudentCancel">取 消</el-button>
            <el-button type="primary" @click="editStudentSubmit">保存</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'Detail',
    data() {
      return {
        courseTable: [],
        courseDetail: {},
        courseId: '',//课程id
        classId: '',//班级id 修改的时候使用
        dialogFormVisible: false, //是否显示弹窗
        dialogFormInnerVisible: false, //是否显示内置弹窗--确定将xx从班级中移除的
        studentDialogFlag: false,//学生弹窗
        studentDialog: "添加学生",//title
        deleteStudentList: '', //从班级中删除的学生名字列表
        editClassFormOrigin: {}, //编辑班级时的原数据
        classNameDialog: '添加班级',//
        editClassForm: {
          name: '',
          master: {}, //班主任
          masterId: '',
          teacher: {}, //老师
          teacherId: '',
          students: [], //学生信息集合
          studentIds: [], //学生id集合
          studentNum: 10//学生上限
        }, //编辑班级时dialog的最终数据,要与editClassFormOrigin进行比较,看看哪些学生被删除了
        studentForm: {
          studentIds: [], //学生id集合
        },//编辑学生
        ifEdit: false,//是否是编辑
        rows: 10,
        page: 1,
        courseTotal: 0,
        formLabelWidth: '100px',
        masterList: [],//班主任列表
        teacherList: [],//老师列表
        teacherListObj:{},//老师obj数据
        studentList: [],//学生列表
        loading: false,//远程搜索多选框
        studentIds: [],
        submitFlag: true,
        teacherId:'',//更换老师的老师id
        teacherName:'',//更换老师的老师名称
        rules: {
          name: [
            {required: true, message: '请输入班级名', trigger: 'blur'}
          ],
          masterId: [
            {required: true, message: '请选择班主任', trigger: 'change'}
          ],
          teacherId: [
            {required: true, message: '请选择老师', trigger: 'change'}
          ],
        }
      }
    },
    mounted() {
      var params = this.$route.params;
      this.courseId = params.id;
      console.log(this.courseId, "this");
      this.getCourseById();
      this.getTeacherList();
      this.getCourseClassList();
      this.getAllUser();
    },
    watch: {},
    methods: {
      //获取课程数据
      getCourseById() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/course/get_course_by_id.do',
          param: {"courseId": _this.courseId},
          success: function (result) {
            if (result.code == 200) {
              _this.courseDetail = result.result;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取该课程下面的班级
      getCourseClassList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/class/get_class_by_course_id.do',
          param: {"courseId": _this.courseId, "page": _this.page, "rows": _this.rows},
          success: function (result) {
            if (result.code == 200) {
              _this.courseTable = result.result.data;
              _this.courseTotal = result.result.total;
              console.log(_this.courseTable, "classInfos");
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取班主任或者老师列表数据
      getTeacherList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/user/get_teachers.do',
          param: {},
          success: function (result) {
            if (result.code == 200) {
              if (result.result) {
                _this.teacherList = result.result;
                for(var i =0;i<result.result.length;i++) {
                  _this.teacherListObj[result.result[i].userAccount] = result.result[i].userName;
                }
                console.log(_this.teacherListObj,"_this.teacherListObj");
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //分页点击页数查询数据
      handleCurrentChange(val) {
        this.page = val;
        this.getCourseClassList();
        console.log(`当前页: ${val}`);
      },
      seeLesson(data) {
        console.log("查看课节", data);
        this.$router.push("/lessonList/" + data.courseId + "/" + data.id+'/'+data.className);
      },
      //编辑学生
      editStudent(data) {
        console.log(data, "编辑学生");
        this.studentDialog = data.className;
        this.classId = data.id;
        this.studentDialogFlag = true;
        if(data.students){
          this.studentForm.studentIds = data.students.map((item) => {
            return item.userAccount;
          })
        }else{
          this.studentForm.studentIds = [];
        }
        console.log(this.studentForm.studentIds,"this.studentForm.studentIds");
      },
      //取消编辑学生
      editstudentCancel() {
        this.studentDialogFlag = false;
      },
      //确定编辑学生
      editStudentSubmit() {
        var _this = this;
        console.log(_this.classId, this.studentForm.studentIds, "学生");
        _this.request({
          method: 'post',
          url: '/class/user/add_or_delete_student.do',
          param: {classId:_this.classId,studentAccounts:_this.studentForm.studentIds.join(",")},
          success: function (result) {
            if (result.code == 200&&result.result) {
              _this.studentDialogFlag = false;
              _this.getCourseClassList();
            }else{
              _this.$message.error('编辑学生错误'+result.message);
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('编辑学生错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取所有学生
      getAllUser() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/user/get_students.do',
          param: {},
          success: function (result) {
            if (result.code == 200) {
              var data = result.result;
              _this.studentList = data;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      dialogCancel(form){
        console.log("关闭");
        this.dialogFormVisible = false;
        this.$refs['ruleForm'].resetFields();
      },
      //接口--保存编辑
      saveEditClass(formName) {
        var _this = this;
        var data = {
          className: _this.editClassForm.name,
          teacherAccount: _this.editClassForm.teacherId,
          masterAccount: _this.editClassForm.masterId,
          studentNum:_this.editClassForm.studentNum
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.submitFlag) {
              _this.submitFlag = false;
              if (_this.ifEdit) {
                //编辑班级
                data.classId = _this.classId;
                _this.request({
                  method: 'post',
                  url: '/class/user/update_class_info_and_user.do',
                  param: data,
                  success: function (result) {
                    if (result.code == 200) {
                      if (result.result) {
                        _this.$message({
                          message: '已修改班级',
                          type: 'success'
                        });
                        _this.dialogFormVisible = false;
                        _this.dialogFormInnerVisible = false;
                        _this.editDialogCancel(formName);
                        _this.submitFlag = true;
                        _this.getCourseClassList();
                        _this.page = 1;
                      }
                    } else {
                      _this.submitFlag = true;
                      _this.$message.error(result.message);
                    }
                  },
                  error: function (error) {
                    _this.submitFlag = true;
                    //服务器异常
                    _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
                  }
                })
              } else {
                //添加班级
                data.courseId = _this.courseId;
                console.log(data, "发送的数据-添加班级");
                _this.request({
                  method: 'post',
                  url: '/class/save_class.do',
                  param: data,
                  success: function (result) {
                    if (result.code == 200) {
                      if (result.result) {
                        _this.$message({
                          message: '已添加班级',
                          type: 'success'
                        });
                        _this.dialogFormVisible = false;
                        _this.editDialogCancel(formName);
                        _this.submitFlag = true;
                        _this.getCourseClassList();
                        _this.page = 1;
                      }
                    } else {
                      _this.submitFlag = true;
                      _this.$message.error(result.message);
                    }
                  },
                  error: function (error) {
                    _this.submitFlag = true;
                    //服务器异常
                    _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
                  }
                })
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },

      //编辑班级--取消操作
      editDialogCancel(form) {
        let _this = this;
        console.log("取消");
        _this.teacherId = '';
        _this.$refs[form].resetFields();
        _this.dialogFormVisible = false;
      },

      //确定从班级中移除学生,调用接口即可
      editDialogStudentSubmit(formName) {
        let _this = this;
        _this.saveEditClass(formName);
      },

      //取消从班级中移除学生
      editDialogStudentCancel() {
        let _this = this;
        _this.dialogFormInnerVisible = false;
      },
      //添加班级
      addClass() {
        this.ifEdit = false;
        this.dialogFormVisible = true;
        this.classNameDialog = '添加班级';
        this.editClassForm.classId = '';
        this.editClassForm.name = '';
        this.editClassForm.masterId = '';
        this.editClassForm.teacherId = '';
        this.editClassForm.studentIds = [];
        this.editClassForm.studentNum = 10;
      },
      //编辑班级
      editClass(data) {
        this.ifEdit = true;
        this.dialogFormVisible = true;
        this.classNameDialog = '编辑班级';
        this.classId = data.id;
        this.editClassForm.name = data.className;
        this.editClassForm.masterId = data.master ? data.master.userAccount : '';
        this.editClassForm.teacherId = data.teacher ? data.teacher.userAccount : '';
        this.teacherId = data.teacher ? data.teacher.userAccount : '';
        this.editClassForm.students = data.students;
        this.editClassForm.studentNum = data.studentNum || 10;
        var studentIds = [];
        if (data.students) {
          studentIds = data.students.map(function (item) {
            return item.userAccount
          });
        }
        this.editClassFormOrigin.studentIds = studentIds;
        this.editClassFormOrigin.students = data.students;
        this.editClassForm.studentIds = studentIds;
        this.deleteStudentList = '';
      },
      //删除班级
      delClass(data) {
        console.log(data, "班级数据");
        var _this = this;
        this.$confirm('确定要删除这个班级嘛？', '删除班级', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //  删除调接口
          _this.request({
            method: 'post',
            url: '/class/delete_class.do',
            param: {classId: data.id},
            success: function (result) {
              if (result.code == 200) {
                if (result.result) {
                  _this.$message({
                    message: '已删除班级',
                    type: 'warning'
                  });
                  _this.getCourseClassList();
                  _this.page = 1;
                }
              }else{
                _this.$message.error(result.message);
              }
            },
            error: function (error) {
              //服务器异常
              _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        }).catch(() => {
          console.log("取消删除");
        });
      },
      tongBuClass(data) {
        console.log(data, "shhdkfjskd");
        var _this = this;
        _this.request({
          method: 'post',
          url: '/class/sync_class_lesson.do',
          param: {classId: data.id},
          success: function (result) {
            if (result.code == 200) {
              if (result.result) {
                _this.$message({
                  message: '已同步课节信息',
                  type: 'success'
                });
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../style/header.css";

  .classmanage {
    .classmanage-header {
      padding-bottom: 12px !important;
      .auth-title {
        display: flex;
        align-items: center;
        span {
          padding: 0px 6px;
          border-radius: 4px;
          font-size: 14px;
          line-height: 22px;
          color: #fff;
          margin-right: 8px;
        }
      }
    }
  }

  .popover-detail-block {
    padding: 0 10px;
    box-sizing: border-box;
    p {
      border-bottom: 1px solid #F5F5F5;
      font-size: 12px;
      color: #606060;
      line-height: 20px;
      padding: 8px 0;
    }
    p:last-child {
      border: 0;
    }
  }

  .class-total {
    font-size: 14px;
    color: #BDBDBD;
    line-height: 24px;
    padding: 8px 0 0 24px;
  }

  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
  }

  .common-content {
    margin-top: 0;
  }

  .tag-detail-list {
    margin-top: 20px;
  }

  .student-option {
    padding: 0 15px;
    color: #f08d00;
    cursor: pointer;
    border-right: 1px solid #F0F0F0;
    white-space: nowrap;
  }

  .student-option:first-child {
    padding-left: 0;
  }

  .student-option:last-child {
    border: none;
    padding-right: 0;
  }

  .student-option.el-popover__reference {
    padding-left: 15px;
    cursor: pointer;
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

  .tip-del-student {
    position: static;
    color: #A23343;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-top: 4px;
    width: 320px;
    span {
      color: #606060;
    }
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }

  .editClassDialog {
    .el-dialog {
      .tip-del-student {
        font-size: 14px;
        color: #F5222D;
        span {
          color: #606060;
        }
      }
    }
    .inner-box {
      font-size: 16px;
      color: #222;
      text-align: center;
      padding: 60px 0;
      .inner-msg {
        margin-bottom: 80px;
        .high-light {
          color: #F08D00;
        }
      }
      .inner-footer {
        text-align: center;
      }

    }

  }
</style>
<style>
  .popover-course {
    min-width: 121px !important;
    box-sizing: border-box;
  }

  .main-organ .el-table th {
    background-color: #fafafa !important;
  }

  .editClassDialog .el-input, .editClassDialog .el-select {
    width: 320px !important;
  }

  .editClassDialog .student-num .el-input {
    width: 180px !important;
  }
</style>

