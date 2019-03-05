<template>
  <div class="xi-container classmanage">
    <el-header class="auth-header classmanage-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/classManage' }">我的班级</router-link>
        <span>/</span>
        <a class="active" href="javascript:void(0)">班级详情</a>
      </el-breadcrumb>
      <h4 class="auth-title" v-if="classInfo.course">{{classInfo.course.courseName}} {{classInfo.className}}</h4>
      <div class="auth-discript">
        <div class="auth-discript-left">
          <div class="auth-discript-inline">班主任：{{classInfo.master ? classInfo.master.userName :''}}</div>
          <div class="auth-discript-inline">老师：{{classInfo.teacher ? classInfo.teacher.userName :''}}</div>
          <div v-if="classInfo.students">学生（{{classInfo.students.length}}人）：{{classInfo.studentNames}}</div>
        </div>
        <div class="auth-discript-right">
          <p class="auth-discript-light">已上课节</p>
          <p class="auth-discript-small"> <span class="f-large">{{lessonEndNum}}</span>/{{lessonNumList.length}}</p>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-main class="class-table-box">
        <div class="tag-list">
          <template v-for="(item,idx) in lessonNumList">
            <template v-if="ifExpand">
              <!--当前是展开状态 -->
              <el-button plain :class="{'el-button--primary':idx==curLessonNum}" @click="tabLessonFun(idx)">第{{item.lessonIndex}}课</el-button>
            </template>
            <template v-else>
              <!--当前是收起状态-->
              <el-button plain :class="{'el-button--primary':idx==curLessonNum}" v-show="idx<2" @click="tabLessonFun(idx)">第{{item.lessonIndex}}课</el-button>
            </template>
          </template>
          <el-button type="text" @click="expandAllLesson">
            <template v-if="ifExpand">收起</template> <template v-else>展开</template><i class="iconfont icon-shouqi"></i>
          </el-button>
        </div>
        <div class="tag-detail-list">
          <div class="tag-detail-item">
            <h4>学生完成情况</h4>
            <template v-if="currentTable.length>0">
              <el-table :data="currentTable" style="width:100%"
                        ref="currentTable">
                  <el-table-column prop="userName" label="学生名" style="width:10%;"></el-table-column>
                  <el-table-column label="课前预习" style="width:10%;">
                    <template slot-scope="scope">
                      <template v-if="scope.row.preview==undefined">
                        <span class="tag-not-finish">--</span>
                      </template>
                      <template v-else>
                        <span class="tag-finish" v-show="scope.row.preview"><i class="iconfont icon-right"></i></span>
                        <span class="tag-not-finish" v-show="!scope.row.preview"><span class="tag-border"></span>未完成</span></span>
                      </template>
                    </template>
                  </el-table-column>

                  <el-table-column label="课中回顾" style="width:10%;">
                    <template slot-scope="scope">
                      <template v-if="scope.row.replay==undefined">
                        <span class="tag-not-finish">--</span>
                      </template>
                      <template v-else>
                        <span class="tag-finish" v-show="scope.row.replay"><i class="iconfont icon-right"></i></span>
                        <span class="tag-not-finish" v-show="!scope.row.replay"><span class="tag-border"></span>未完成</span>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="课后总结" style="width:10%;">
                    <template slot-scope="scope">
                      <template v-if="scope.row.summarize==undefined">
                        <span class="tag-not-finish">--</span>
                      </template>
                      <template v-else>
                        <span class="tag-finish" v-show="scope.row.summarize"><i class="iconfont icon-right"></i></span>
                        <span class="tag-not-finish" v-show="!scope.row.summarize"><span class="tag-border"></span>未完成</span>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="课后拓展" style="width:10%;">
                    <template slot-scope="scope">
                      <template v-if="scope.row.expansion==undefined">
                        <span class="tag-not-finish">--</span>
                      </template>
                      <template v-else>
                        <span class="tag-finish" v-show="scope.row.expansion"><i class="iconfont icon-right"></i></span>
                        <span class="tag-not-finish" v-show="!scope.row.expansion"><span class="tag-border"></span>未完成</span>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="课后作业" style="width:35%;">
                    <template slot-scope="scope">
                      <template v-if="scope.row.homework==undefined">
                        <span class="tag-not-finish">--</span>
                      </template>
                      <template v-else>
                      <span class="tag-finish" v-show="scope.row.homework.status=='FINISHED'"><i class="iconfont icon-right"></i></span>
                      <span class="tag-not-finish" v-show="scope.row.homework.status!=='FINISHED'"><span class="tag-border"></span>未完成</span></span>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <template v-if="scope.row.homework && scope.row.homework.status=='FINISHED' ">
                        <router-link class="el-button el-button--text tag-finish"
                                     :to="{path:'/classHomework/'+classId+'/'+scope.row.homework.homeworkRecordId+'/'+lessonNumList[curLessonNum].classLessonName+'/'+scope.row.userName+'/'+classInfo.teacher.userName}">查看作业详情</router-link>
                      </template>
                      <template v-else>
                        <span class="tag-not-finish">查看作业详情</span>
                      </template>
                    </template>
                  </el-table-column>
              </el-table>
            </template>
            <template v-else>
              <p style="font-size:16px;color:#BDBDBD;">课节还没有开始哦！</p>
            </template>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
    export default{
        name: 'ClassDetail',
        props: [],
        components: {},
        data(){
            return {
              classId:0,
              classInfo:{}, //班级信息

              curLessonNum:0, //当前选中的是第几个课节(从0开始)
              lessonNumList:[
//                {
//                  "beginTime": 1545794400000,
//                  "classId": 2081,
//                  "classInfo": {
//                    "id": 2081
//                  },
//                  "classLessonName": "王万成测试班 - 1",
//                  "endTime": 1545796200000,
//                  "id": 5932,
//                  "ifComplete": true,
//                  "lessonIndex": 1,
//                  "task": []
//                },
//                {
//                  "beginTime": 1545816000000,
//                  "classId": 2081,
//                  "classInfo": {
//                    "id": 2081
//                  },
//                  "classLessonName": "王万成测试班 - 2",
//                  "endTime": 1545817800000,
//                  "id": 5933,
//                  "ifComplete": true,
//                  "lessonIndex": 2,
//                  "task": []
//                },
//                {
//                  "beginTime": 1545880800000,
//                  "classId": 2081,
//                  "classInfo": {
//                    "id": 2081
//                  },
//                  "classLessonName": "王万成测试班 - 3",
//                  "endTime": 1545882600000,
//                  "id": 5934,
//                  "ifComplete": false,
//                  "lessonIndex": 3,
//                  "task": []
//                },
//                {
//                  "beginTime": 1545967200000,
//                  "classId": 2081,
//                  "classInfo": {
//                    "id": 2081
//                  },
//                  "classLessonName": "王万成测试班 - 4",
//                  "endTime": 1545969000000,
//                  "id": 5940,
//                  "ifComplete": false,
//                  "lessonIndex": 4,
//                  "task": []
//                }
              ], //课节信息(排好序之后的)

              lessonEndNum:0, //已经上过的课节数

              ifExpand:false, //当前课节列表的状态,是否是展开状态  false---为展开;true--展开


              currentTable:[
//                {
//                  expansion: false,
//                  homework: "NOT_START",
//                  preview: false,
//                  replay: false,
////                  summarize: false,
//                  userAccount: "18435160381",
//                  userName: "测试黄彦文学生1",
//                }
              ],

            }
        },
        mounted(){
          let params = this.$route.params;
          if(params.id){
            this.classId = params.id;
            this.getClassInfo();
          }

        },
        watch: {},
        methods: {

          //获取班级信息
          getClassInfo(){
            let _this = this;
            _this.request({
              method: 'post',
              url:'/class/get_class_info_by_id.do',
              param:{"classId":_this.classId},
              success: function (result) {
                console.log(result);
                if (result.code == 200 && result.result) {
                  console.log('获取班级信息。。')
                  _this.classInfo = result.result;

                  let tmpLessonArray = result.result.lessonArray || [];
                  //后期,给lessonNumList排个序,
                  tmpLessonArray.map((item,idx) => {
                    if(item.ifComplete==true){
                      _this.lessonEndNum +=1; //已上的课节数
                    }
                  });

                  if(_this.lessonEndNum>0) { //有上过的课
                    //给lessonNumList排个序,最后一个已上的课,即将上的课,其他未上的课,....,第一个已上的课,第二个已上,...,
                    let tmpStartArr = tmpLessonArray.slice(_this.lessonEndNum - 1);
                    let tmpEndArr = tmpLessonArray.slice(0, _this.lessonEndNum - 1);
                    console.log(tmpStartArr);
                    console.log(tmpEndArr, '-------排序后---');

                    _this.lessonNumList = tmpStartArr.concat(tmpEndArr);
                  }else{
                    _this.lessonNumList = tmpLessonArray;
                  }

                  _this.getLessonInfo();

                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('获取班级信息失败，刷新页面重试。')
              }
            })
          },
          // (1234).toLocaleString('zh-hans-CN-u-nu-hanidec',{useGrouping:false})  返回 一二三四
          // 如果useGrouping=true,则返回  一,二三四

          //展开所有课节 --- set ifExpand = true
          expandAllLesson(){
            this.ifExpand = !this.ifExpand;
          },

          //获取某个课节的学生作业信息
          getLessonInfo(){
            let _this = this;
            let tmpLessonId = _this.lessonNumList[_this.curLessonNum].id;
            console.log('当前课节id is  ',tmpLessonId);
            _this.request({
              method: 'post',
              url:'/lesson/get_lesson_student_message_by_lesson_id.do',
              param:{"lessonId":tmpLessonId},
              success: function (result) {
                console.log(result);
                if (result.code == 200) {
                  console.log('获取课节信息。。')
                  if(result.result){
                    _this.currentTable = result.result;
                  }else{
                    console.log('没有课节信息')
                  }

                }else{
                  _this.$message.error('获取课节信息失败，刷新重试。')
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('获取课节信息失败，刷新页面重试。')
              }
            })
          },

          //切换 第几讲 (idx--lessonArray的index,从0开始)
          tabLessonFun(idx){
            this.curLessonNum = idx;
            this.getLessonInfo();
          },
        }
    }
</script>
<style scoped lang="scss">
  @import "../../style/header.css";

  .classmanage {
    .classmanage-header {
      padding-bottom:24px!important;

      .auth-title {
        padding-bottom: 16px;
      }
      .auth-discript{
        display:flex;
        align-content:center;
        align-items:center;

        .auth-discript-left{
          flex:1;
          -webkit-flex:1;
        }
        .auth-discript-inline{
          display: inline-block;
          padding-right:80px;
          margin-bottom:8px;
        }
        .auth-discript-right{
          width: 70px;
          text-align: left;
          .auth-discript-light{
            font-size:12px;
            color: #c0c0c0;;
          }
          .auth-discript-small{
            font-size:10px;
            color:#606060;
            .f-large{
              font-size:32px;
            }
          }
        }
      }


    }

    .class-table-box {
      margin: 24px;
      padding: 20px 0;
      background: #fff;
      min-height: 550px;

      .tag-list{
        border-bottom:1px solid #eee;
        padding: 0 24px 15px;

        .el-button{
          margin:0 10px 8px 0!important;
        }

        .el-button + .el-button{
          margin-left:0px!important;
          margin-right:10px!important;
          /*margin-bottom:8px;*/
        }

      }
      .tag-detail-list{
        padding: 24px;

        .tag-detail-item{
          h4{
            margin-bottom:16px;
          }

          .tag-finish{
            font-size:14px;
            color:#F08D00;;
          }
          .tag-not-finish{
            font-size:14px;
            color:#BDBDBD;
            .tag-border{
              display: inline-block;
              background:#BDBDBD;
              width: 2px;
              height: 10px;
              border-radius: 2px;
              margin-right:8px;
            }
          }


        }
      }
    }

  }
</style>
