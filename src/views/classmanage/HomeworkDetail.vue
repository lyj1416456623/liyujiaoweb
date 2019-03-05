<template>
  <div class="homework-detail">
    <el-header class="auth-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/classManage' }">我的班级</router-link>
        <span>/</span>
        <router-link :to="{ path: '/classDetail/'+classId }">班级详情</router-link>
        <span>/</span>
        <a href="javascript:void(0)">学生作业</a>
      </el-breadcrumb>
    </el-header>
    <div class="homework-content">
      <div class="homework-title-content">
        <h2><span></span>{{studentName}}的课后作业</h2>
        <p class="grade">{{lessonName}} <span>第{{homeworkIndex}}讲</span></p>
        <div class="teacher-top-evaluation" v-if="ifMarked==true">
          <img :src="userData.avatar||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png'" alt="">
          <span>{{teacherName}}老师：</span>
          <div class="home-top-content-p">
            <p v-if="markInfo.homeworkRemark.markText!=''" v-html="markInfo.homeworkRemark.markText"></p>
            <xm-audio v-if="markInfo.homeworkRemark.markAudio" :audioSrc="markInfo.homeworkRemark.markAudio" style="margin-top:0"></xm-audio>
          </div>
        </div>
        <div class="score-block">
          <template v-if="ifMarked==true">
            <p>得分</p>
            <p class="score-item"><span>{{markInfo.scoreObj.objectiveScoreStudent+markInfo.scoreObj.subjectiveScoreStudent}}</span>/{{markInfo.scoreObj.objectiveScoreTotal+markInfo.scoreObj.subjectiveScoreTotal}}</p>
          </template>
          <template v-else>
            <p> </p>
            <p class="score-item">批改中</p>
          </template>
        </div>
      </div>
      <div class="question-content">
        <h2>题目解析</h2>
        <div class="question-list">
          <div class="question-list-block" v-for="(quesItem,idx) in recordList">
            <div class="question-score">
              <span>题目{{idx+1}}</span>
              <span class="score-content" v-if="answerList[idx]">+{{answerList[idx].correctScore}}分</span>
            </div>
            <choice :questionData = 'quesItem' :recordData="answerList[idx].objectiveAnswerList||[]"
                    v-if="quesItem.questionType=='CHOICE'||quesItem.questionType=='MULTIPLE_CHOICE'"></choice>
            <fill-blank :questionData = 'quesItem' :recordData="answerList[idx].objectiveAnswerList||[]"
                        v-if="quesItem.questionType=='FILL_THE_BLANKS'"></fill-blank>
            <connection :questionData = 'quesItem' :recordData="answerList[idx].objectiveAnswerList||[]"
                        v-if="quesItem.questionType=='CONNECTION_PROBLEM'"></connection>
            <div class="subjective-block" v-if="quesItem.questionType=='SUBJECTIVE'">
              <div class="subject-choice">
                <div class="subjective-title">
                  <template v-for="item in quesItem.title">
                    <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
                    <img v-if="item.itemType == 'IMG'" :src="item.itemValue">
                  </template>
                </div>
                <div class="subject-list">
                  <p class="subject-title">学生答案：</p>
                  <p v-for="texItem in answerList[idx].subjectiveAnswerList"
                     v-if="texItem.itemType == 'TEXT'" class="text-block" v-html="texItem.itemValue">
                  </p>
                  <div class="img-block">
                    <div class="img-item" v-for="imgItem in answerList[idx].subjectiveAnswerList" v-if="imgItem.itemType == 'IMG'">
                      <img :src="imgItem.itemValue" alt="">
                      <div class="img-mask" @click="seeBigImg(imgItem.itemValue)">查看图片</div>
                    </div>
                  </div>
                  <xm-audio v-for="(audioItem,idx) in answerList[idx].subjectiveAnswerList" :key="'aud'+idx" v-if="audioItem.itemType == 'AUDIO'" :audioSrc="audioItem.itemValue"></xm-audio>
                  <div class="video-block" v-for="videoItem in answerList[idx].subjectiveAnswerList" v-if="videoItem.itemType == 'VIDEO'">
                    <video controls="controls">
                      <source :src="videoItem.itemValue" />
                    </video>
                  </div>
                  <div class="teacher-commonts" v-if="ifMarked&&markInfo.questionMarkMap&&markInfo.questionMarkMap[idx+1]">
                    <p class="teacher-title">老师评语：</p>
                    <p class="text-block" v-html="(markInfo.questionMarkMap[idx+1]).markText"></p>
                    <div class="img-block" v-if="(markInfo.questionMarkMap[idx+1]).markImgList&&(markInfo.questionMarkMap[idx+1]).markImgList.length>0">
                      <div class="img-item" v-for="markImgItem in (markInfo.questionMarkMap[idx+1].markImgList)">
                        <img :src="markImgItem" alt="">
                        <div class="img-mask" @click="seeBigImg(markImgItem)">查看图片</div>
                      </div>
                    </div>
                    <xm-audio v-if="(markInfo.questionMarkMap[idx+1]).markAudio" :audioSrc="(markInfo.questionMarkMap[idx+1]).markAudio"></xm-audio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--微信绑定-->
    <el-dialog
      title=""
      :modal-append-to-body='false'
      :visible.sync="imgFlag"
      width="40%">
      <div class="dialog-img">
        <img :src="imgUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import choice from './Choice'
  import FillBlank from './FillBlank'
  import connection from './Connection'
  import subjective from './Subjective'
  import XmAudio from "./AudioView"
  export default {
    name: '',
    props: ['userData'],
    components: {choice,FillBlank,connection,subjective,XmAudio},
    data() {
      return {
        classId:0, //班级id
        imgFlag:false,
        imgUrl:'',
        homeworkRecordId: '',//作业记录id
        recordList:[],//作业记录列表
        answerList:[],//作业答案列表
        music: {
          isPlay: false,
          currentTime: 0,
          maxTime: 0,
          volume: 100
        },
        markInfo:{
        },//评分+分数
        homeworkIndex:0,
        lessonName:'',//课程名
        studentName:'',//学生名
        teacherName:'',//老师名
        ifMarked:false, //作业是否已批改
      }
    },
    mounted() {
      this.homeworkRecordId = this.$route.params.homeworkRecordId;
      this.lessonName = this.$route.params.lessonName;
      this.studentName = this.$route.params.studentName;
      this.teacherName = this.$route.params.teacherName;
      this.getHomeworkRecord();
    },
    watch: {
      '$refs.music.currentTime': function () {
        console.log(this.$refs.music.currentTime)
      }
    },
    methods: {
      //获取作业记录
      getHomeworkRecord(){
        var _this = this;
        _this.request({
          method: 'post',
          url:'/manage/homework/get_student_homework_record.do',
          param:{homeworkRecordId:_this.homeworkRecordId},
          success: function (result) {
            if (result.code == 200 && result.result) {
              console.log(result.result);
              var data = result.result;
              _this.recordList = data.subjectQuestionInfo.questionInfoList;
              console.log(_this.recordList,"题目");
              _this.classId = data.studentHomeworkRecord.classId;
              _this.answerList = data.studentHomeworkRecord.answerInfoList;
              _this.markInfo = data.studentHomeworkRecord.markInfo||{};
              console.log(_this.answerList,"答案");
              _this.homeworkIndex = data.subjectQuestionInfo.homeworkIndex;
              console.log(_this.homeworkIndex,"ffff")
              _this.ifMarked = data.studentHomeworkRecord.ifMarked;

            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('获取作业记录失败，刷新页面重试。')
          }
        })
      },
      seeBigImg(imgUrl){
        console.log(imgUrl);
        this.imgFlag = true;
        this.imgUrl = imgUrl;
      },
      listenMusic() {
        if (!this.$refs.music) {
          return
        }
        if (this.$refs.music.readyState) {
          this.music.maxTime = this.$refs.music.duration;
        }
        this.music.isPlay = !this.$refs.music.paused;
        this.music.currentTime = this.$refs.music.currentTime;
      },
      play() {
        console.log(this.$refs.music.paused, "this.$refs.music.paused");
        if (this.$refs.music.paused) {
          this.$refs.music.play();
        } else {
          this.$refs.music.pause();
        }
        this.music.isPlay = !this.$refs.music.paused
      },
      changeTime(time) {
        this.$refs.music.currentTime = time
      },
    }
  }
</script>
<style scoped lang="scss">
  .homework-detail {
    margin: 24px 24px 0 24px;
  }

  .auth-header {
    height: 0 !important;
  }

  .homework-content {
    .homework-title-content{
      background:#fff;
      box-shadow:0px 1px 2px 0px rgba(0,0,0,0.12);
      border-radius:4px;
      padding: 24px;
      padding-bottom:0;
      position:relative;
      .score-block{
        position:absolute;
        right:24px;
        top:12px;
        .home-top-content-p{
          flex:1;
          p{
            font-size:12px;
            color:#C0C0C0;
            line-height:20px;
            height: 20px;
          }
        }


        .score-item{
          color:#606060;
          font-size:14px;
          span{
            font-size:40px;
            color:#F08D00;
            line-height:48px;
          }
        }
      }
      h2{
        display:flex;
        align-items: center;
        font-size:16px;
        font-weight:500;
        color:#222222;
        line-height:24px;
        span{
          height:12px;
          padding:0 2px;
          margin-right:8px;
          background:#f08d00;
        }
      }
      .grade{
        font-size:12px;
        color:#606060;
        line-height:20px;
        margin-top:4px;
        padding-bottom:15px;
        padding-left:12px;
        span{
          color:#F08D00;
        }
      }
      .teacher-top-evaluation{
        padding:15px 0;
        display:flex;
        align-items: center;
        border-top:1px solid #e0e0e0;
        img{
          width:32px;
          height:32px;
        }
        span{
          margin: 0 8px;
        }
        p{
          background:rgba(245,245,245,1);
          border-radius:4px;
          line-height:24px;
          padding:4px 8px;
          flex:1;
        }
      }
    }
    .question-content{
      background:#fff;
      box-shadow:0px 1px 2px 0px rgba(0,0,0,0.12);
      border-radius:4px;
      padding: 24px;
      margin-top:8px;
      h2{
        font-size:16px;
        font-weight:500;
        color:#222222;
        line-height:24px;
      }
      .question-list{
        .question-list-block{
          padding:24px 0;
          border-bottom:1px solid #E8E8E8;
          .question-score{
            font-size:14px;
            span{
              padding:2px 8px;
              background:#EEEEEE;
              border-radius:4px;
            }
            .score-content{
              background:rgba(240,141,0,0.12);
              color:#F08D00;
              margin-left:4px;
            }
          }
        }
      }
    }
  }
  /*主观题样式*/
  .subjective-block{
    .subject-choice {
      .subjective-title {
        margin-bottom: 16px;
        h2 {
          font-size: 18px;
          font-weight: 400;
          color: #222222;
          line-height: 26px;
          margin-top: 16px;
        }
        img {
          width: 100%;
          margin-top: 8px;
        }
      }
      .subject-list {
        .subject-title {
          font-size: 16px;
          color: #bdbdbd;
          line-height: 22px;
          margin-bottom:8px;
        }
        .text-block{
          font-size:16px;
          color:#222222;
          line-height:24px;
        }
        .img-block{
          display:flex;
          border-radius: 4px;
          margin-top:8px;
          .img-item{
            position:relative;
            width:92px;
            height:92px;
            margin-right:16px;
            cursor: pointer;
            img{
              width:100%;
              height:100%;
            }
            .img-mask{
              width:100%;
              height:100%;
              background:rgba(0,0,0,0.48);
              position:absolute;
              top:0;
              left:0;
              color:#fff;
              text-align: center;
              line-height: 92px;
              display:none;
            }
          }
          .img-item:hover{
            .img-mask{
              display:block;
            }
          }
        }
        .audio-item{
          .audio-block{
            margin-top:16px;
            padding:23px 24px 0;
            box-sizing: border-box;
            height:79px;
            border-radius:8px;
            background:linear-gradient(165deg,#FFCD55, #FFB64E);
            display:flex;
            .play{
              font-size:32px;
              line-height: 32px;
              color:#fff;
              text-shadow: 2px 2px 6px rgba(137,81,0,.24);
            }
            .line{
              height:32px;
              width:2px;
              background:#fff;
              margin-left:19px;
            }
            .slider-audio{
              width:100%;
              flex:1;
              margin-left:15px;
            }
          }
        }
        .video-block{
          width:240px;
          margin-top:16px;
          video{
            width:100%;
          }
        }
        /*老师评语*/
        .teacher-commonts{
          width:600px;
          padding:16px;
          box-sizing: border-box;
          background:#FAFAFA;
          border-radius:12px;
          margin-top:24px;
          .teacher-title{
            font-size:16px;
            color:#606060;
            line-height:24px;
            margin-bottom:8px;
          }
        }
      }
    }
  }
  .dialog-img{
    img{
      max-width:100%;
      margin:0 auto;
      display:block;
      max-height: 560px;
      overflow: auto;
    }
  }
</style>
