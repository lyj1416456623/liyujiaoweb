<template>
  <el-container>
    <el-header class="common-header" style="height:92px;">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/library' }">套题</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">课后作业</a>
      </el-breadcrumb>
      <h4 class="common-title" style="height:44px">{{courseName}}</h4>
      <div class="header-tag">
        <span>第{{lessonNum}}课</span>
        <span>课后作业</span>
      </div>
      <!--<div class="update-user">最后编辑人：{{updateUser}}</div>-->
    </el-header>
    <el-container class="common-content">
      <div class="empty-content" v-if="lessonData.length==0">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/homeworkkong.png" alt="">
        <p>这节课没有课后作业哦！</p>
        <el-button type="primary" plain @click="jump">录入题目</el-button>
      </div>
      <div class="detail-homework" v-if="lessonData.length>0">
        <div class="detail-list" v-for="(item,idx) in lessonData">
          <div class="detail-item">
            <choice :questionData = "item.questionDataObject" :idx="idx" v-if="item.type=='CHOICE'||item.type=='MULTIPLE_CHOICE'"></choice>
            <connection :questionData = "item.questionDataObject" :idx="idx" v-if="item.type=='CONNECTION_PROBLEM'"></connection>
            <fill-blank :questionData = "item.questionDataObject" :idx="idx" v-if="item.type=='FILL_THE_BLANKS'"></fill-blank>
            <subjective :questionData = "item.questionDataObject" :idx="idx" v-if="item.type=='SUBJECTIVE'"></subjective>
          </div>
          <div class="detail-footer">
            <div class="footer-block">
              <p>知识点：</p>
              <div class="footer-point">
                <span v-for="point in item.points">{{point.name}}</span>
              </div>
            </div>
            <div class="footer-option">
              <div class="see-detail" @click="seeDetail(item,idx)">
                <i class="iconfont icon-chakan"></i>查看详情
              </div>
              <div class="see-detail" @click="upData(idx)">
                <i class="iconfont icon-shangyi"></i>上移
              </div>
              <div class="see-detail" @click="downData(idx)">
                <i class="iconfont icon-xiayi"></i>下移
              </div>
              <div class="see-detail" @click="delQuestion(item)">
                <i class="iconfont icon-shanchu"></i>从套题中移除
              </div>
            </div>
          </div>
        </div>
        <div class="add-question" @click="jump">
          <i class="iconfont icon-jiahao"></i>录入下一题
        </div>
      </div>
      <el-footer class="library-footer" v-if="lessonData.length>0">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="updateQuestion">保存</el-button>
      </el-footer>
    </el-container>
    <el-dialog
      title="题目详情"
      :visible.sync="detailConentFlag"
      width="648px"
      append-to-body
      class="dialog-block"
    >
      <div class="dialog-content">
        <div class="grade-block">
          <p><span>年级：</span>{{detailData.gradeValue}}</p>
          <p><span>难度：</span>
            <el-rate
              v-model="quesitionData.difficultLevel"
              disabled
              :colors="['#F08D00', '#F08D00', '#F08D00']">
            </el-rate>
          </p>
        </div>
        <div class="point-block">
          <p>知识点：</p>
          <div class="point-item">
            <span v-for="item in detailData.points">{{item.name}}</span>
          </div>
        </div>
        <div class="detail-dialog-item">
          <choice-detail :detailQustionData = "detailData.questionDataObject" :idx="detailIdx" v-if="detailData.type=='CHOICE'||detailData.type=='MULTIPLE_CHOICE'"></choice-detail>
          <connection-detail :detailQustionData = "detailData.questionDataObject" :idx="detailIdx" v-if="detailData.type=='CONNECTION_PROBLEM'"></connection-detail>
          <fill-blank-detail :detailQustionData = "detailData.questionDataObject" :idx="detailIdx" v-if="detailData.type=='FILL_THE_BLANKS'"></fill-blank-detail>
          <subjective-detail :detailQustionData = "detailData.questionDataObject" :idx="detailIdx" v-if="detailData.type=='SUBJECTIVE'"></subjective-detail>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import Choice from "./detailComponent/Choice"
  import Connection from "./detailComponent/Connection"
  import FillBlank from "./detailComponent/FillBlank"
  import Subjective from "./detailComponent/Subjective"

  import ChoiceDetail from "./maskDetailComponent/Choice"
  import ConnectionDetail from "./maskDetailComponent/Connection"
  import FillBlankDetail from "./maskDetailComponent/FillBlank"
  import SubjectiveDetail from "./maskDetailComponent/Subjective"

  export default {
    name: "detail",
    components: {
      Choice,
      Connection,
      FillBlank,
      Subjective,
      ChoiceDetail,
      ConnectionDetail,
      FillBlankDetail,
      SubjectiveDetail
    },
    data() {
      return {
        updateUser:'',//最后编辑人
        courseName:'',//课程名
        lessonNum: '',//第几课
        courseId:'',//课程id
        grade:'',//年级
        lessonData: [],//题目数据
        questionList: [],//题目
        detailConentFlag: false,//弹窗
        quesitionData:{
          difficultLevel:1
        },
        detailIdx:0,//查看详情idx
        detailData:{},//详情数据
      }
    },
    mounted() {
      var params = this.$route.params;
      this.courseName = params.coursename;
      this.lessonNum = params.idx;
      this.courseId = params.courseId;
      this.grade = params.grade;
      this.getQuestion();
    },
    methods: {
      jump() {
        this.$router.push('/inputHomework/'+this.courseId+'/'+this.lessonNum+'/'+this.grade+'/libraryhw/null');
      },
      goBack(){
        this.$router.go(-1);
      },
      //获取课节题
      getQuestion(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/question/course/get_question_for_course_lesson.do',
          param: {
            courseId:_this.courseId,
            lessonIndex:_this.lessonNum,
            lessonQuestionType:'HOMEWORK'
          },
          success: function (result) {
            if (result.code == 200&&result.result) {
              console.log(result.result);
              _this.lessonData = result.result;

            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取套题失败，去右上角菜单中刷新页面。')
          }
        })
      },
      updateQuestion(){
        var _this = this;
        var questionDataId = [];
        _this.lessonData.map(item=>{
          questionDataId.push(item.id);
        })
        console.log(questionDataId,"questionDataId");
        _this.request({
          method: 'post',
          url: '/question/course/update_question_for_course_lesson.do',
          param: {
            courseId:_this.courseId,
            lessonIndex:_this.lessonNum,
            lessonQuestionType:'HOMEWORK',
            questionDataId:questionDataId.join(",")
          },
          success: function (result) {
            if (result.code == 200) {
              if (result.result) {
                _this.$router.go(-1);
              }
            }else if(result.code==501){
              _this.$message.error('不能修改当前套题哦~');
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //删除题目
      delQuestion(data) {
        console.log(data, "班级数据");
        var _this = this;
        //剩下题目的id
        var questionDataId = [];
        _this.lessonData.map(item=>{
          if(item.id!=data.id){
            questionDataId.push(item.id);
          }
        })
        console.log(questionDataId,"questionDataId");
        this.$confirm('确定要删除这份题目内容嘛？', '删除题目', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //  删除调接口
          _this.request({
            method: 'post',
            url: '/question/course/update_question_for_course_lesson.do',
            param: {
              courseId:_this.courseId,
              lessonIndex:_this.lessonNum,
              lessonQuestionType:'HOMEWORK',
              questionDataId:questionDataId.join(",")
            },
            success: function (result) {
              if (result.code == 200) {
                if (result.result) {
                  _this.getQuestion();
                }
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
      //查看详情
      seeDetail(data,idx){
        this.detailConentFlag = true;
        this.detailIdx = idx+1;
        this.detailData = data;
      },
      // 上移
      upData(index) {
        console.log(index);
        var newArr = [];
        if(index<1){
          this.$message('已经是第一题了，再移就上天了！');
        }else{
          //在上一项插入该项
          this.lessonData.splice(index-1,0,(this.lessonData[index]));
          //删除后一项
          this.lessonData.splice(index+1,1);
          console.log(this.lessonData,"dddd");
        }
      },
      // 下移
      downData(index) {
        if(index == this.lessonData.length-1){
          this.$message('已经是最后一题了，再移也不能如入地哦！');
        }else{
          //在下一项插入该项
          this.lessonData.splice(index+2,0,(this.lessonData[index]));
          //  删除前一项
          this.lessonData.splice(index,1);

        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .header-tag {
    font-size: 12px;
    color: #606060;
    line-height: 24px;
    margin-top: 8px;
    span {
      padding: 5px 10px;
      background: #F5F5F5;
      border-radius: 4px;
      margin-right: 8px;
    }
  }
  .update-user{
    position:absolute;
    bottom:8px;
    right:26px;
    font-weight:400;
    color:#BDBDBD;
    font-size:12px;
  }
  .common-content {
    background: #fff;
    margin-bottom: 80px;
    min-height:640px;
    .empty-content {
      text-align: center;
      margin: 0 auto;
      padding-top: 70px;
      img {
        width: 227px;
        height: 193px;
        margin: 0 auto;
        display: block;
      }
      p {
        padding: 36px 0 64px;
        font-size: 16px;
        color: #BDBDBD;
        line-height: 24px;
      }
    }
    .detail-homework {
      padding: 24px;
      width:100%;
      .detail-list {
        border: 1px solid #eeeeee;
        margin-bottom: 24px;
        .detail-item {
          padding: 24px;
        }
      }
      .detail-list:last-child {
        margin-bottom: 0;
      }
      .add-question{
        width:600px;
        height:40px;
        display: block;
        line-height: 40px;
        padding-left:12px;
        border:1px dashed #E0E0E0;
        border-radius:4px;
        font-size:16px;
        color:#606060;
        i{
          margin-right:12px;
        }
      }
    }
    /*有内容的*/
    .detail-footer {
      padding: 13px 24px;
      border-top: 1px solid #eeeeee;
      background: #FAFAFA;
      display: flex;
      align-items: center;
      .footer-block {
        display: flex;
        align-items: top;
        font-size: 14px;
        color: #606060;
        line-height: 22px;
        flex: 1;
        .footer-point {
          flex: 1;
        }
      }
      .footer-option {
        float: right;
        .see-detail {
          float: left;
          margin-left: 16px;
          font-size: 14px;
          color: #606060;
          cursor: pointer;
          i {
            margin-right: 12px;
            font-size: 24px;
            vertical-align: middle;
            color: #BDBDBD;
          }
        }
      }
    }
  }

  .dialog-content {
    height:560px;
    overflow-y:auto;
    padding:24px;
    box-sizing: border-box;
    /*年级*/
    .grade-block {
      p {
        font-size: 14px;
        color: #606060;
        line-height: 22px;
        float: left;
        margin-right: 64px;
        display: flex;
        span {
          margin-right: 16px;
          flex: 1;
        }
      }
    }
    .grade-block:after {
      clear: both;
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    /*知识点*/
    .point-block {
      display: flex;
      align-items: top;
      margin-top: 16px;
      font-size: 14px;
      color: #606060;
      p {
        line-height: 22px;
        margin-right: 8px;
        margin-top: 6px;
      }
      .point-item {
        line-height: 20px;
        flex: 1;
        span {
          padding: 6px 8px;
          background: #F5F5F5;
          border-radius: 4px;
          margin-right: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }
      }
    }
    .detail-dialog-item {
      margin-top: 24px;
    }
  }
</style>
<style>
  .dialog-block .el-dialog__header {
    border-bottom: 1px solid #E0E0E0;
  }
  .dialog-block .el-dialog__body{
    padding:0;
  }
</style>
