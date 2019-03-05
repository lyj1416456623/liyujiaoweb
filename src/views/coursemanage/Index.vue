<template>
  <el-container>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">课程管理</a>
      </el-breadcrumb>
      <h4 class="common-title">课程管理</h4>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <el-button type="primary" plain @click="addCourse">添加课程</el-button>
          <el-input
            debounce
            @change="searchEmployee"
            placeholder="搜索课程名"
            v-model="searchText">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="main-organ">
          <el-table :data="courseTableData" style="width: 100%">
            <el-table-column label="课程名" min-width="40%">
              <template slot-scope="scope">
                <span>{{scope.row.courseName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="年级" min-width="20%">
              <template slot-scope="scope">
                <span v-if="scope.row.gradeValue"><span class="dot" :class="'ziyue-'+scope.row.grade"></span>{{scope.row.gradeValue}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="班级数" min-width="20%">
              <template slot-scope="scope">
                <span>{{scope.row.classInfos.length}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <span class="course-option" @click="seeCourse(scope.row)">查看</span>
                <span class="course-option" @click="editCourse(scope.row)">编辑</span>
                <span class="course-option"  v-if="scope.row.classInfos.length==0" @click="delCourse(scope.row)">删除</span>
              </template>
            </el-table-column>
            <div slot="empty" v-if="searchText==''">
              <p>还没有课程哦！</p>
            </div>
            <div slot="empty" v-if="searchText!=''">
              <p>没有你要找的课程哦！</p>
            </div>
          </el-table>
          <div class="block" v-if="courseTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="courseTotal">
            </el-pagination>
          </div>
        </div>
      </el-main>
      <!--上传中-->
      <div class="uploading-box" v-show="ifShowUploading">
        <div class="uploading-bg"></div>
        <div class="uploading-main">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/uploading.gif" alt="">
        </div>
      </div>
      <el-dialog
        :title="courseFormTitle"
        :modal-append-to-body='false'
        :visible.sync="addCourseFormFlag"
        :close-on-click-modal="false"
        width="496px">
        <el-form ref="courseForm" :rules="courseFormRules" :model="courseForm" label-width="100px">
          <el-form-item label="*课程名：" prop="courseName">
            <el-input v-model="courseForm.courseName" placeholder="没有输入课程名"></el-input>
          </el-form-item>
          <el-form-item label="*课程封面：" prop="imageUrl">
            <div class="couse-img-block">
              <div class="course-img">
                <input class="ipt-file" id="course-img-file" type="file"   accept="image/*" @change="changeUpload">
                <img :src="courseForm.imageUrl" alt="" v-if="courseForm.imageUrl!=''">
                <template v-if="courseForm.imageUrl==''">
                  <div class="iconfont icon-jiahao"></div>
                  <p>上传封面</p>
                </template>
              </div>
              <div class="course-item">
                1.封面图片尺寸为900x900 <br>2.封面图片大小不超过1MB <br>3.封面图片格式支持JPG,PNG,GIF
              </div>
            </div>
          </el-form-item>
          <el-form-item label="*课程简介：" prop="description">
            <el-input v-model="courseForm.description" placeholder="请输入" type="textarea"></el-input>
            <p class="text-num">{{courseForm.description.length}}/400</p>
          </el-form-item>
          <el-form-item label="年级：" prop="grade">
            <el-select v-model="courseForm.grade" placeholder="请选择" style="width:356px">
              <el-option :label="item.name" :value="item.value" :key="item.value" v-for="item in gradeList"></el-option>
            </el-select>
          </el-form-item>
          <div class="clear" style="clear:both"></div>
          <el-form-item label="*年份：" prop="lessonYear" class="line">
            <el-date-picker
              v-model="courseForm.lessonYear"
              type="year"
              :clearable='false'
              :editable = 'false'
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分类：" prop="classification" class="line line-select">
            <el-select v-model="courseForm.classification" placeholder="请选择">
              <el-option :label="item.name" :value="item.value" :key="item.value" v-for="item in addClassIficationList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetAddCourse('courseForm')">取 消</el-button>
          <el-button type="primary" @click="submitAddCourse('courseForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
  var currentYear = new Date().getFullYear()+"";
  export default {
    name: "Index",
    data() {
      var courseName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('课程名不能为空哦！'));
        } else {
          callback();
        }
      };
      var grade = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择年级'));
        } else {
          callback();
        }
      };
      var imageUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传课程封面'));
        } else {
          callback();
        }
      };
      var description = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入课程简介'));
        } else {
          callback();
        }
      };
      return {
        searchText: '',//搜索的课程名/手机号
        courseTableData: [],//课程数据
        courseTotal: 0,//课程总数
        pageSize: 10,
        page: 1,
        gradeList: [],//年级列表
        classIficationList: [{
          'value':'',
          'name':'全部'
        },{
          'value': 'COURSE_SPRING',
          'name': '春季'
        }, {
          'value': 'COURSE_SUMMER',
          'name': '暑假'
        },{
          'value':'COURSE_AUTUMN',
          'name':'秋季'
        },{
          'value':'COURSE_WINTER',
          'name':'寒假'
        },{
          'value':'COURSE_EXPERIENCE',
          'name':'体验课'
        },{
          'value':'COURSE_SHORT_TERM',
          'name':'短期课'
        },{
          'value':'COURSE_OPEN',
          'name':'公开课'
        }],
        addClassIficationList: [{
          'value': 'COURSE_SPRING',
          'name': '春季'
        }, {
          'value': 'COURSE_SUMMER',
          'name': '暑假'
        },{
          'value':'COURSE_AUTUMN',
          'name':'秋季'
        },{
          'value':'COURSE_WINTER',
          'name':'寒假'
        },{
          'value':'COURSE_EXPERIENCE',
          'name':'体验课'
        },{
          'value':'COURSE_SHORT_TERM',
          'name':'短期课'
        },{
          'value':'COURSE_OPEN',
          'name':'公开课'
        }],
        courseForm: {
          courseName: "", //课程名称
          imageUrl:"",//课程封面
          description:"",//课程简介
          grade: "GRADE_THREE",//年级
          lessonNum: 1,//课节数
          lessonYear:new Date(),//当前年  默认年
          classification: 'COURSE_SPRING',//分类
        },//学生form
        addCourseFormFlag: false,//添加课程窗口显示
        ifEdit: false,//是否是编辑
        courseId:"",//编辑的courseId
        courseFormTitle: "添加课程信息",//添加学生窗口显示题目
        submitFlag:true,
        ifShowUploading:false,//上传中显示
        courseFormRules: {
          courseName: [
            {validator: courseName, trigger: 'blur'}
          ],
          grade:[
            {validator: grade, trigger: 'blur'}
          ],
          imageUrl:[
            {validator: imageUrl, trigger: 'change'}
          ],
          description:[
            {validator: description, trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.getCourseData();
      this.getGradeList();
    },
    watch:{
      courseForm:{
        handler(newValue, oldValue) {
         console.log(newValue,"description");
         if(newValue.description&&newValue.description.length>400){
           this.courseForm.description = this.courseForm.description.substring(0,400);
         }
        },
        deep: true
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getCourseData();
        console.log(`当前页: ${val}`);
      },
      //搜索课程
      searchEmployee() {
        var _this = this;
        _this.page = 1;
        _this.getCourseData();
      },
      //获取课程列表
      getCourseData() {
        var _this = this;
        var data = {
          "page": _this.page,
          "rows": _this.pageSize,
          "courseName": _this.searchText
        }
        _this.request({
          method: 'post',
          url: '/course/get_all_course.do',
          param: data,
          success: function (result) {
            if (result.code == 200) {
              var data = result.result;
              _this.courseTableData = data.data;
              _this.courseTotal = data.total;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取年级
      getGradeList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/course/get_grade.do',
          param: {},
          success: function (result) {
            if (result.code == 200 && result.result) {
              _this.gradeList = result.result;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //添加课程
      addCourse() {
        //显示添加学生窗口
        this.ifEdit = false;
        this.courseFormTitle = "添加课程信息";
        this.addCourseFormFlag = true;
      },
      //编辑课程
      editCourse(data) {
        console.log(data, "课程数据单条");
        //显示添加课程窗口
        this.ifEdit = true;
        this.courseFormTitle = "编辑课程信息";
        this.addCourseFormFlag = true;
        this.courseId = data.id;
        this.courseForm = {
          courseName: data.courseName, //课程名称
          grade: data.grade||'GRADE_OTHER',//年级
          imageUrl:data.imageUrl||'http://ziyue-xn.oss-cn-beijing.aliyuncs.com/common/eeo_course_img.jpg',//课程封面
          description:data.description?data.description.replace(/<br>/g,'\n'):'',//课程简介
          lessonNum: data.lessonCount||1,//课节数
          lessonYear:data.year+'',//当前年  默认年
          classification: data.quarter||'COURSE_SPRING',//分类
        }
      },
      //查看课程
      seeCourse(data) {
        this.$router.push("/courseDetail/" + data.id);
      },
      //取消添加、编辑课程
      resetAddCourse(form) {
        this.$refs[form].resetFields();
        this.addCourseFormFlag = false;
        this.courseForm = {
          courseName: "", //课程名称
          grade: "GRADE_THREE",//年级
          lessonNum: 1,//课节数
          imageUrl:'',//课程封面
          description:'',//课程简介
          lessonYear:new Date(),//当前年  默认年
          classification: 'COURSE_SPRING',//分类
        }
      },
      changeUpload(){
        let that = this;
        that.ifShowUploading = true;
        let fd = new FormData();
        fd.append("file", document.getElementById('course-img-file').files[0]);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/file/upload_file.do');
        fd.append("fileType", "COURSE_IMG");
        xhr.onload = function () {
          let backResponse = JSON.parse(xhr.responseText);
          if (backResponse.code == 200 && backResponse.result) {
            that.courseForm.imageUrl = backResponse.result;
            that.ifShowUploading = false;
            document.getElementById('course-img-file').value ='';
          } else {
            console.log('课程上传图片失败 changeUpload')
          }
        };
        xhr.send(fd);
      },
      //确定添加、编辑课程
      submitAddCourse(form) {
        let _this = this;
        _this.$refs[form].validate((valid) => {
          if (valid) {
            var data = {
              "courseName":_this.courseForm.courseName,
              "grade":_this.courseForm.grade,
              "year":new Date(_this.courseForm.lessonYear).getFullYear(),
              "quarter":_this.courseForm.classification,
              "lessonNum":_this.courseForm.lessonNum,
              "description":_this.courseForm.description.replace(/\n/g,'<br>'),
              "imageUrl":_this.courseForm.imageUrl
            }
            console.log(data,"data");
            var url = _this.ifEdit ? '/course/update_course.do' : '/course/save_course.do';
            if(_this.ifEdit) data.courseId = _this.courseId;
            if(_this.submitFlag) {
              _this.submitFlag = false;
              _this.request({
                method: 'post',
                url: url,
                param: data,
                success: function (result) {
                  if (result.code == 200) {
                    _this.submitFlag = true;
                    if (_this.ifEdit) {
                      _this.$message({
                        message: '已修改课程',
                        type: 'success'
                      });
                    } else {
                      _this.page = 1;
                      _this.$message({
                        message: '已添加课程',
                        type: 'success'
                      });
                    }
                    _this.resetAddCourse(form);
                    //刷新当前课程信息的数据
                    _this.getCourseData();
                  }else{
                    _this.$message.error('添加/编辑课程错误,去右上角菜单中刷新页面。');
                    _this.submitFlag = true;
                  }
                },
                error: function (error) {
                  //服务器异常
                  _this.submitFlag = true;
                  _this.$message.error('添加课程服务器异常，去右上角菜单中刷新页面。')
                }
              })
            }
          }
        });
      },
      delCourse(data){
        var _this = this;
        this.$confirm('确定要删除该课程吗?', '删除课程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.request({
            method: 'post',
            url: '/course/delete_empty_course.do',
            param: {courseId:data.id},
            success: function (result) {
              if (result.code == 200 && result.result) {
                _this.getCourseData();
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else{
                _this.$message.error('删除课程失败，该课程创建过班级！');
              }
            },
            error: function (error) {
              //服务器异常
              _this.$message.error('删除课程失败，去右上角菜单中刷新页面。')
            }
          })

        }).catch(() => {
          console.log("取消删除课程")
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  /*上传gif*/
  .uploading-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    .uploading-bg {
      background: rgba(0, 0, 0, 0.32);
      width: 100%;
      height: 100%;
    }
    .uploading-main {
      position: absolute;
      top: 40%;
      left:50%;
      text-align: center;
      img {
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
      }
    }

  }
  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
  }

  .main-organ {
    margin-top: 20px;
    /*操作*/
    .course-option {
      padding: 0 15px;
      color: #F08D00;
      border-right: 1px solid #F0F0F0;
      cursor: pointer;
      white-space: nowrap;
    }
    .course-option:first-child{
      padding-left:0;
    }
    .course-option:last-child{
      border-right:0;
    }
    .dot{
      width:8px;
      height:8px;
      background:#F08D00;
      display: inline-block;
      border-radius:4px;
      margin-right:8px;
    }
  }

  .line {
    display: inline-block;
    width: 47%;
    float: left;
    .el-input-number {
      width: 140px;
    }
    .el-date-editor.el-input{
      width: 100% !important;
    }
  }
  .line-select{
    width: 53%;
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }
  /*筛选*/
  .course-filter{
    position:absolute;
    top:14px;
    right:38px;
    .el-date-editor.el-input,.el-select{
      width: 92px !important;
      float:left;
      margin-left:8px;
    }
  }
  .couse-img-block{
    display:flex;
    .course-img{
      width:104px;
      height:104px;
      border-radius:4px;
      border:1px dashed #E0E0E0;
      text-align: center;
      color:#E0E0E0;
      position:relative;
      cursor: pointer;
      img{
        width:100%;
        height:100%;
        cursor: pointer;
      }
      .ipt-file{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        opacity: 0;
      }
      .iconfont{
        margin-top:20px;
        margin-bottom:12px;
        font-size:24px;
      }
      p{
        font-size:16px;
        color:#BDBDBD;
        line-height:24px;
      }

    }
    .course-item{
      font-size:12px;
      color:#BDBDBD;
      line-height:22px;
      margin-left:16px;
    }
  }
  .text-num{
    font-size:12px;
    color:#BDBDBD;
    line-height:22px;
    text-align: right;
  }
</style>
