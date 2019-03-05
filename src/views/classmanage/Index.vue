<template>
  <div class="xi-container classmanage">
    <el-header class="auth-header classmanage-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a class="active" href="javascript:void(0)">我的班级</a>
      </el-breadcrumb>
      <h4 class="auth-title">我的班级</h4>
      <el-tabs class="xi-el-tabs" v-model="activeName">
        <el-tab-pane label="上课中" name="current"></el-tab-pane>
        <el-tab-pane label="已结课" name="history"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container>
      <el-main class="class-table-box">
        <div class="header-tool">
          <div></div>
          <el-input
            debounce
            @change="searchClassFun"
            placeholder="搜索课程名/班级名"
            v-model="searchIpt">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <template v-if="activeName=='current'">
          <el-table :data="currentTable" style="width:100%" ref="currentTable">
            <el-table-column prop="courseName" label="课程名" min-width="16%"></el-table-column>
            <el-table-column prop="className" label="班级名" min-width="15%"></el-table-column>
            <el-table-column label="老师" min-width="8%">
              <template slot-scope="scope"> {{scope.row.teacher?scope.row.teacher.userName:'暂无'}}</template>
            </el-table-column>
            <el-table-column label="班主任" min-width="8%">
              <template slot-scope="scope"> {{scope.row.master?scope.row.master.userName : '暂无'}}</template>
            </el-table-column>
            <el-table-column label="学生人数" min-width="10%">
              <template slot-scope="scope">
                <span style="color:#F08D00" v-if="!scope.row.students||(scope.row.students && scope.row.students.length==0)">0人</span>
                <el-popover placement="bottom" height="268" trigger="hover" popper-class="popover-course" v-else>
                  <div class="popover-detail-block">
                    <p v-for="item in scope.row.students">{{item.userName}}</p>
                  </div>
                  <span class="student-option student-detail" slot="reference" style="color:#F08D00">{{scope.row.students.length}}人</span>
                </el-popover>
                <i class="iconfont icon-bianji" style="color:#F08D00;margin-left:8px;cursor:pointer"
                   @click="editStudent(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="13%">
              <template slot-scope="scope">
                <router-link class="el-button el-button--text" :to="{path:'/classDetail/'+scope.row.id}">查看
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" v-if="curTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="curPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="curTotal">
            </el-pagination>
          </div>
        </template>
        <template v-else>
          <el-table :data="historyTable" style="width:100%" ref="historyTable">
            <el-table-column prop="courseName" label="课程名" min-width="16%"></el-table-column>
            <el-table-column prop="className" label="班级名" min-width="15%"></el-table-column>
            <el-table-column label="老师" min-width="8%">
              <template slot-scope="scope"> {{scope.row.teacher?scope.row.teacher.userName:'暂无'}}</template>
            </el-table-column>
            <el-table-column label="班主任" min-width="8%">
              <template slot-scope="scope"> {{scope.row.master?scope.row.master.userName : '暂无'}}</template>
            </el-table-column>
            <el-table-column label="学生人数" min-width="10%">
              <template slot-scope="scope">
                <span style="color:#F08D00" v-if="!scope.row.students||(scope.row.students && scope.row.students.length==0)">0人</span>
                <el-popover placement="bottom" height="268" trigger="hover" popper-class="popover-course" v-if="scope.row.students">
                  <div class="popover-detail-block">
                    <p v-for="item in scope.row.students">{{item.userName}}</p>
                  </div>
                  <span class="student-option student-detail" slot="reference" style="color:#F08D00">{{scope.row.students.length}}人</span>
                </el-popover>
                <i class="iconfont icon-bianji" style="color:#F08D00;margin-left:8px;cursor:pointer"
                   @click="editStudent(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="13%">
              <template slot-scope="scope">
                <router-link class="el-button el-button--text" :to="{path:'/classDetail/'+scope.row.id}">查看
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" v-if="historyTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="historyPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="historyTotal">
            </el-pagination>
          </div>
        </template>
        <!--编辑学生-->
        <el-dialog class="editClassDialog" :title="studentDialog" :visible.sync="studentDialogFlag" append-to-body
                   width="496px">
          <el-form :model="studentForm" ref="studentForm">
            <el-form-item label="学生：" :label-width="formLabelWidth">
              <el-select v-model="studentForm.studentIds" filterable multiple placeholder="请添加学生">
                <el-option v-for="(stu,index) in studentList" :key="'st'+index" :label="stu.userName"
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
    name: "Index",
    data() {
      return {
        activeName: 'current', //上课中的班级--current; 已结课的班级--history
        searchIpt: '', //搜索班级列表,公用
        currentTable: [], //上课中的班级数据
        curPage: 1,
        curTotal: 0, //总数据个数
        historyTable: [], //已结课的班级数据
        historyPage: 1, //已结课--当前第几页
        historyTotal: 0,//总个数
        pageSize: 10, //每页显示几条数据  上课中、已结课都用这一个数据
        teacherList: [],//老师列表
        studentList: [],//学生列表
        studentDialogFlag: false, //是否显示弹窗
        studentDialog:"编辑学生",
        studentForm: {
          studentIds: []  //学生id集合
        }, //编辑班级时dialog的最终数据,要与editClassFormOrigin进行比较,看看哪些学生被删除了
        formLabelWidth: '88px',
        classId: ""
      }

    },
    mounted() {
      let _this = this;
      _this.getClassList();
      _this.getTeacherList();
      _this.getAllUser();
    },
    watch: {
      activeName(val, old) {
        this.searchIpt = ''; //切换tab的时候,搜索框内容清空
        this.getClassList();
      }
    },
    methods: {
      //获取班级
      getClassList() {
        let _this = this;
        let url = '/class/get_my_class.do';
        let param = {
          page: _this.historyPage,
          rows: _this.pageSize,
          status: 'CLASS_ENDING',
          queryData:_this.searchIpt
        };
        if (_this.activeName == 'current') { //上课中
          param = {
            page: _this.curPage,
            rows: _this.pageSize,
            status: 'CLASS_IMPLEMENTING',
            queryData:_this.searchIpt
          };
        }
        _this.request({
          method: 'post',
          url: url,
          param: param,
          success: function (result) {
            if (result.code == 200 && result.result) {
              console.log('查询班级。。', _this.activeName)
              if (_this.activeName == 'current') { //上课中
                _this.currentTable = result.result.data;
                _this.curTotal = result.result.total;
              } else {
                _this.historyTable = result.result.data;
                _this.historyTotal = result.result.total;
              }

            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('获取班级失败，刷新页面重试。')
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
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
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
      //分页事件
      handleCurrentChange(val) {
        let _this = this;
        if (_this.activeName == 'current') { //上课中
          _this.curPage = val;
        } else {
          _this.historyPage = val;
        }
        console.log(`当前页: ${val}`);
        _this.getClassList();
      },

      //搜索班级
      searchClassFun() {
        var _this = this;
        if (_this.activeName == 'current') { //上课中
          _this.curPage = 1;
        } else {
          _this.historyPage = 1;
        }
        _this.getClassList();
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
        console.log(this.studentForm.studentIds, "this.studentForm.studentIds");
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
          param: {classId: _this.classId, studentAccounts: _this.studentForm.studentIds.join(",")},
          success: function (result) {
            if (result.code == 200 && result.result) {
              _this.studentDialogFlag = false;
              _this.getClassList();
            } else {
              _this.$message.error('编辑学生错误' + result.message);
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('编辑学生错误,网络加载失败，去右上角菜单中刷新页面。')
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
      .auth-title {
        padding-bottom: 8px;
      }
    }

    .class-table-box {
      margin: 24px;
      padding: 20px 24px;
      background: #fff;
      .search-box {
        height: 38px;
        line-height: 28px;
        width: 240px;
        margin-bottom: 24px;
      }
      .block {
        text-align: right;
        padding-top: 10px;
      }
    }

  }
  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:20px;
    .el-input {
      width: 240px;
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

  .editClassDialog .el-input, .editClassDialog .el-select {
    width: 320px !important;
  }
</style>
