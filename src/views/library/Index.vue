<template>
  <el-container>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">套题</a>
      </el-breadcrumb>
      <h4 class="common-title">套题</h4>
    </el-header>
    <el-container class="common-content">
      <div class="course-list-slider">
        <div class="header-tool">
          <el-input
            debounce
            @change="searchEmployee"
            placeholder="搜索课程名"
            v-model="searchText">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <p v-if="courseData.length==0" class="error-text">没有你要找的课程哦！</p>
        <div class="course-list" v-if="courseData.length>0">
          <template v-for="item in courseData">
            <div class="course-list-block" :class="currentCourseId==item.id?'ifActive':''" @click="selectCourse(item)">
              {{item.courseName.length>14?item.courseName.substring(0,14)+'...':item.courseName}}
            </div>
          </template>
        </div>
        <div class="block" v-if="courseTotal>0">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
            layout="prev, pager, next"
            :small="true"
            :total="courseTotal"
            :pager-count="pagecount">
          </el-pagination>
        </div>
      </div>
      <div class="main-organ">
        <h2>课节详情</h2>
        <div class="lesson-box" id="lesson-list">
          <p class="error-text" style="text-align: left" v-if="lessonData.length==0">这个课程没有课节呢，先去课程管理设置一下课节吧！</p>
          <div class="lesson-block" v-if="lessonData.length>0" v-for="(item,idx) in lessonData">
            <p>第{{idx+1}}课</p>
            <div class="lesson-block-box">
              <router-link class="lesson-block-item" :class="item.preview?'':'lesson-no-data'"
                           :to="{path:'/libraryDetail/PREVIEW/'+item.courseId+'/'+(idx+1)+'/'+currentCourseName+'/'+currentGrade}">
                <span></span>课前预习
              </router-link>
              <router-link class="lesson-block-item" :class="item.homework?'':'lesson-no-data'"
                           :to="{path:'/libraryHomework/'+item.courseId+'/'+(idx+1)+'/'+currentCourseName+'/'+currentGrade}">
                <span></span>课后作业
              </router-link>
              <router-link class="lesson-block-item" :class="item.summary?'':'lesson-no-data'"
                           :to="{path:'/libraryDetail/SUMMARY/'+item.courseId+'/'+(idx+1)+'/'+currentCourseName+'/'+currentGrade}">
                <span></span>课后总结
              </router-link>
              <router-link class="lesson-block-item" :class="item.expand?'':'lesson-no-data'"
                           :to="{path:'/libraryDetail/EXPAND/'+item.courseId+'/'+(idx+1)+'/'+currentCourseName+'/'+currentGrade}">
                <span></span>课后拓展
              </router-link>
            </div>
          </div>
          <div class="add-lesson" @click="addLesson">+ 添加课节</div>
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        currentCourseId: '',//当前选中的课程id
        currentCourseName: '',//当前选中的课程名字
        currentGrade: '',//当前选中的课程的名字
        firstFlag: true,//用来判断是不是第一次打开
        searchText: '',//搜索的学生名/手机号
        courseData: [],//学生数据
        lessonData: [],//课节数据
        courseTotal: 0,//学生总数
        pageSize: 10,
        page: 1,
        pagecount: 5,
        classIficationList: [{
          'value': '',
          'name': '全部'
        }, {
          'value': 'COURSE_SPRING',
          'name': '春季课'
        }, {
          'value': 'COURSE_SUMMER',
          'name': '夏季课'
        }, {
          'value': 'COURSE_AUTUMN',
          'name': '秋季课'
        }, {
          'value': 'COURSE_WINTER',
          'name': '冬季课'
        }, {
          'value': 'COURSE_EXPERIENCE',
          'name': '体验课'
        }, {
          'value': 'COURSE_SHORT_TERM',
          'name': '短期课'
        }, {
          'value': 'COURSE_OPEN',
          'name': '公开课'
        }]
      }
    },
    mounted() {
      var courseData = localStorage.getItem("courseData");
      if (courseData) {
        courseData = JSON.parse(courseData);
        this.page = courseData.page || 1;
        this.currentCourseId = courseData.id || '';
      }
      this.getCourseData();
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
          url: '/question/course/get_course.do',
          param: data,
          success: function (result) {
            if (result.code == 200 && result.result) {
              var data = result.result;
              _this.courseData = data.data;
              _this.courseTotal = data.total;
              console.log(_this.courseTotal, "courseTotal");
              if (_this.firstFlag) {
                console.log(_this.currentCourseId, "currentCourseId");
                if (data.data.length > 0) {
                  if (_this.currentCourseId == '') {
                    _this.currentCourseId = data.data[0].id;
                  }
                  for(var i = 0;i<data.data.length;i++){
                    if(data.data[i].id == _this.currentCourseId){
                      _this.currentCourseName = data.data[i].courseName;
                      _this.currentGrade = data.data[i].grade || 'GRADE_ONE';
                    }
                  }
                  _this.getLessonDetail();
                }
                _this.firstFlag = false;
                _this.setCache();
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //选择课程
      selectCourse(data) {
        console.log(data, "dddd");
        this.currentCourseId = data.id;
        this.currentCourseName = data.courseName;
        this.currentGrade = data.grade || 'GRADE_ONE';
        document.getElementById("lesson-list").scrollTop = 0;
        this.getLessonDetail();
        this.setCache();
      },
      setCache() {
        var courseDataLibrary = {
          id: this.currentCourseId,
          page: this.page
        }
        localStorage.setItem("courseData", JSON.stringify(courseDataLibrary));
      },
      //获取课节
      getLessonDetail() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/question/course/get_course_details.do',
          param: {courseId: _this.currentCourseId},
          success: function (result) {
            if (result.code == 200 && result.result) {
              console.log(result.result);
              _this.lessonData = result.result;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      addLesson(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/question/course/update_course_lesson_count_identity.do',
          param: {courseId: _this.currentCourseId},
          success: function (result) {
            if (result.code == 200 && result.result) {
              console.log(result.result);
              _this.getLessonDetail();
            }else{
              _this.$message.error('添加课节失败，去右上角菜单中刷新页面。')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .common-content {
    display: flex;
    background: #f2f3f5;
  }

  .error-text {
    font-size: 14px;
    color: #BDBDBD;
    line-height: 22px;
    text-align: center;
    padding-top: 12px;
  }

  .course-list-slider {
    width: 248px;
    height: 624px;
    background: #fff;
    border-radius: 2px;
    margin-right: 8px;
    position: relative;
    .header-tool {
      padding: 16px 24px;
    }
    .course-list {
      .course-list-block {
        padding-left: 24px;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        color: #606060;
        cursor: pointer;
      }
      .ifActive {
        background: #fef6eb;
        border-right: 3px solid #F08D00;
        color: #F08D00;
      }
      .course-list-block:hover {
        background: #F08D00;
        color: #fff;
      }
    }
    .block {
      position: absolute;
      bottom: 16px;
      right: 8px;
    }
  }

  .main-organ {
    background: #fff;
    border-radius: 2px;
    height: 624px;
    flex: 1;
    h2 {
      font-size: 16px;
      font-weight: 500;
      color: #212121;
      line-height: 24px;
      padding: 16px 20px;
      border-bottom: 1px solid #E0E0E0;
    }
    .lesson-box {
      padding: 0 24px;
      height: 545px;
      overflow-y: auto;
      .add-lesson {
        height: 40px;
        border-radius: 4px;
        border: 1px dashed #E0E0E0;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        color: #606060;
        margin-top: 24px;
      }
      .add-lesson:hover {
        color: #F08D00;
        border-color: #F08D00;
      }
      .lesson-block {
        p {
          font-size: 14px;
          color: #212121;
          line-height: 22px;
          padding: 16px 0 8px;
        }
        .lesson-block-box {
          zoom: 1;
          .lesson-block-item {
            width: 23%;
            margin-right: 2.5%;
            height: 64px;
            box-sizing: border-box;
            float: left;
            display: flex;
            align-items: center;
            border: 1px solid #EEEEEE;
            cursor: pointer;
            border-radius: 2px;
            span {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 4px;
              background: #F08D00;
              margin-right: 16px;
              margin-left: 16px;
            }
          }
          .lesson-block-item:last-child {
            margin-right: 0;
          }
          .lesson-block-item:hover {
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
            border: none;
          }
          .lesson-no-data {
            background: #F5F5F5;
            border-radius: 2px;
            border: 1px solid #EEEEEE;
            span {
              background: #D8D8D8;
            }
          }
        }
        .lesson-block-box:after {
          clear: both;
          content: '';
          display: block;
          width: 0;
          height: 0;
          visibility: hidden;
        }
      }
    }
  }

  /*筛选*/
  .course-filter {
    position: absolute;
    top: 14px;
    right: 38px;
    .el-date-editor.el-input, .el-select {
      width: 92px !important;
      float: left;
      margin-left: 8px;
    }
  }
</style>
