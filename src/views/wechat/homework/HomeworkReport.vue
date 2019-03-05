<template>
    <!--作业报告解析页面-->
    <div class="homework">
      <div class="banner">
        <template v-if="ifShowFinishGif">
          <!--完成作业,第一次进入此页面,播放做完作业的"嘭"动画-->
          <template v-if="ifMarked">
            <div class="banner-img">
                <div class="banner-txt">
                  <h4 class="banner-title">
                    <template v-if="markInfo.scoreObj.objectiveScoreStudent!=undefined && markInfo.scoreObj.subjectiveScoreStudent!=undefined">
                      {{markInfo.scoreObj.objectiveScoreStudent+markInfo.scoreObj.subjectiveScoreStudent}} <span style="font-size:12px;">分</span>
                    </template>
                  </h4>
                  <p class="banner-score"
                     v-if="markInfo.scoreObj.objectiveScoreTotal!=undefined && markInfo.scoreObj.subjectiveScoreTotal!=undefined"> 总分 {{markInfo.scoreObj.objectiveScoreTotal+markInfo.scoreObj.subjectiveScoreTotal}}</p>
                </div>
            </div>
          </template>
          <template v-else>
              <div class="banner-img banner-img-first-finish"></div>
          </template>

        </template>
        <template v-else>
          <!--完成作业,并非第一次进入此页面-->
          <div class="banner-img" :class="ifMarked?'':'banner-img-no'">
            <div class="banner-txt">
              <template v-if="ifMarked">
                <h4 class="banner-title">
                  <template v-if="markInfo.scoreObj.objectiveScoreStudent!=undefined && markInfo.scoreObj.subjectiveScoreStudent!=undefined">
                    {{markInfo.scoreObj.objectiveScoreStudent+markInfo.scoreObj.subjectiveScoreStudent}} <span style="font-size:12px;">分</span>
                  </template>
                </h4>
                <p class="banner-score"
                   v-if="markInfo.scoreObj.objectiveScoreTotal!=undefined && markInfo.scoreObj.subjectiveScoreTotal!=undefined"> 总分 {{markInfo.scoreObj.objectiveScoreTotal+markInfo.scoreObj.subjectiveScoreTotal}}</p>
              </template>
              <template v-else>
                <!--<h4 class="banner-title">老师批改中</h4>-->
                <p class="banner-score">  </p>
              </template>
            </div>
          </div>
        </template>

      </div>
      <div class="summary-comment" v-show="ifMarked">
        <!--整个作业的点评-->
        <h4>老师评语</h4>
        <div class="summary-box ziyue-flex" v-if="markInfo.homeworkRemark && summaryAudioUrl">

            <template v-if="markInfo.teacherImg">
              <img class="summary-img" :src="markInfo.teacherImg" alt="">
            </template>
            <template v-else>
              <img class="summary-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
            </template>
            <div class="ziyue-flex-item">
              <audio-phone :audioSrc="summaryAudioUrl" :ifArrow = 'true'></audio-phone>
            </div>

        </div>
        <div class="summary-box summary-txt-box" v-if="markInfo.homeworkRemark&&markInfo.homeworkRemark.markText">
          <template v-if="markInfo.teacherImg">
            <img class="summary-img" :src="markInfo.teacherImg" alt="">
          </template>
          <template v-else>
            <img class="summary-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
          </template>
          <!--<img class="summary-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">-->
          <div class="ziyue-flex-item">
            <div class="summary-txt arrow-left">
              <p v-html="markInfo.homeworkRemark.markText"></p>
            </div>
          </div>
        </div>

      </div>
      <div class="detail">

        <h4 class="detail-title">作答详情</h4>
        <div class="detail-nums">
          <div class="num-list">
            <div class="num-item" v-for="(qItem,nIdx) in studentAnswerInfo" @click="changeQuestionFun(nIdx)"
                 :class="qItem.questionType!='SUBJECTIVE'?([{'num-item-wrong':qItem.totalScore!=qItem.correctScore},{'num-item-cur':curQuestionIndex==nIdx}]):([{'num-item-cur':curQuestionIndex==nIdx}])">
              {{nIdx+1}}
            </div>
          </div>
        </div>

        <div class="question-list">
          <div v-for="(item,itemIdx) in questionList">
            <subjective-topic v-if="item.questionType == 'SUBJECTIVE'&&markInfo.questionMarkMap"
                              :questionData="item"
                              :recordData="studentAnswerInfo[itemIdx].subjectiveAnswerList"
                              :ifMarked="ifMarked"
                              :score="studentAnswerInfo[itemIdx].correctScore"
                              :commentData="markInfo.questionMarkMap[itemIdx+1] || {}"
                              v-show="itemIdx==curQuestionIndex"></subjective-topic>
            <fill-blank v-if="item.questionType == 'FILL_THE_BLANKS'"
                        :questionData="item"
                        :recordData="studentAnswerInfo[itemIdx].objectiveAnswerList"
                        :ifMarked="ifMarked"
                        :score="studentAnswerInfo[itemIdx].correctScore"
                        v-show="itemIdx==curQuestionIndex"></fill-blank>
            <single-choice v-if="item.questionType == 'CHOICE'"
                           :questionData="item"
                           :recordData="studentAnswerInfo[itemIdx].objectiveAnswerList"
                           :ifMarked="ifMarked"
                           :score="studentAnswerInfo[itemIdx].correctScore" v-show="itemIdx==curQuestionIndex"></single-choice>
            <multiple-report v-if="item.questionType == 'MULTIPLE_CHOICE'"
                             v-show="itemIdx==curQuestionIndex"
                             :questionData="item"
                             :recordData="studentAnswerInfo[itemIdx].objectiveAnswerList"
                             :ifMarked="ifMarked"
                             :score="studentAnswerInfo[itemIdx].correctScore"></multiple-report>
            <connection-report v-if="item.questionType == 'CONNECTION_PROBLEM'"
                               v-show="itemIdx==curQuestionIndex"
                               :questionData="item"
                               :recordData="studentAnswerInfo[itemIdx].objectiveAnswerList"
                               :ifMarked="ifMarked"
                               :score="studentAnswerInfo[itemIdx].correctScore"></connection-report>
          </div>

        </div>

      </div>
      <div class="report-footer">
        <router-link :to="{path:'/course/detail/'+classId+'/'+params.subjectId}" class="back-btn">返回课程</router-link>
      </div>
    </div>
</template>

<script>
  import SingleChoice from "@/components/SingleChoiceReport"
  import FillBlank from "@/components/FillBlankReport"
  import SubjectiveTopic from "@/components/SubjectiveReport"
  import MultipleReport from "@/components/MultipleChoiceReport"
  import ConnectionReport from "@/components/ConnectionReport"
  import AudioPhone from "@/components/AudioPhoneComponent"
    export default{
        name: '',
        props: [],
        components: {SingleChoice,FillBlank,SubjectiveTopic,MultipleReport,ConnectionReport,AudioPhone},
        data(){
            return {
              params:{}, //url中的参数lessonId,subjectId,homeworkIndex,fromPage(fromPage=1表示作业刚作完,需要一个完成作业的动画;fromPage=2表示不需要动画)
              ifShowFinishGif:false, //是否播放完成作业的动画
              curQuestionIndex:0, //当前展示的题目的索引值,从0开始
              questionTotal:8, //总题数
              questionList:[],
              studentAnswerInfo:[
                {
                  subjectiveAnswerList:[],
                  objectiveAnswerList:[],
                  correctScore:0
                }
              ], //学生的回答信息
              ifMarked:true, //老师是否批改完
              markInfo:{}, //评语(整个作业评分+主观题的评分)

              classId:0, //班级id

              summaryAudioUrl:'', //老师评语-录音--针对整个作业的
              summaryAudioStatus:'pause', //pause --当前停止播放状态;play--当前播放状态
              summaryAudioDuration:0, //老师录音评语的时长
            }
        },
        mounted(){
          let _this = this;
          let params = _this.$route.params;
          _this.params = params;
          console.log(_this.params)
          _this.checkWeiXinBrowser(function () {
            if (params.lessonId && params.subjectId && params.homeworkIndex) {

              let tmpFrom = parseInt(params.from);
              if (tmpFrom == 1) {
                _this.ifShowFinishGif = true; //显示做完作业的gif动画
              } else {
                _this.ifShowFinishGif = false;
              }
              _this.getHomeworkData();

            } else {
              alert('缺少参数')
            }
          });
        },
        watch: {},
        methods: {

          //切换显示题目
          changeQuestionFun(idx){
            this.curQuestionIndex = idx;
          },

          //获取作业内容
          getHomeworkData(){
            let _this = this;
            _this.request({
              method: 'post',
              url: '/homework/get_question.do',
              param: {"subjectId":_this.params.subjectId,"homeworkIndex":_this.params.homeworkIndex},
              success: function (result) {
                console.log(result);
                if (result.code == 200) {
                  console.log(result,"获取作业");
                  _this.questionList = result.result.questionInfoList;

                  _this.getHomeworkRecord(); //获取完作业内容,去获取当前作业的记录

                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('获取作业失败，刷新页面重试。')
              }
            })
          },

          //获取这个作业的作业记录
          getHomeworkRecord(){
            let _this = this;
            let param = {
              "lessonId":_this.params.lessonId,
              "subjectId":_this.params.subjectId,
              "homeworkIndex":_this.params.homeworkIndex,
            };
            _this.request({
              method: 'post',
              url: '/homework/record/get_homework_record.do',
              param: param,
              success: function (result) {
                console.log(result,'  get_homework_record.do');
                if (result.code == 200) {
                  console.log(result,"获取作业记录");
//                  _this.homeworkRecordId = result.result.id;
                  _this.classId = result.result.classId;
                  _this.studentAnswerInfo = result.result.answerInfoList || [];
                  _this.ifMarked = result.result.ifMarked || false;
                  _this.markInfo = result.result.markInfo || {"homeworkRemark":{},"questionMarkMap":{}};

                  _this.summaryAudioUrl = _this.markInfo.homeworkRemark.markAudio || '';

                  console.log(_this.studentAnswerInfo,"---studentAnswerInfo---------");

                }else{
                  _this.$message.error('获取作业记录失败，请重试。'+result.message)
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('获取作业记录失败，刷新页面重试。')
              }
            })

          },

          //老师整个作业的评语加载
          getSummaryInfo(){
            let _this = this;

            _this.$refs.mySummaryAudio.load();
            _this.$refs.mySummaryAudio.oncanplay = function () {
              console.log(parseInt(_this.$refs.mySummaryAudio.duration),"时间");
              _this.summaryAudioDuration = parseInt(_this.$refs.mySummaryAudio.duration);
            }

          },

          //老师评语点击事件--针对整体作业的评语
          summaryAudioClick(){
            let that = this;

            if(that.summaryAudioStatus=='pause'){
              that.$refs.mySummaryAudio.play();
              that.summaryAudioStatus='play'; //当前播放状态,记得修改图片
              that.$refs.mySummaryAudio.addEventListener("ended",function(){
                console.log('ended')
                that.$refs.mySummaryAudio.pause();
                that.summaryAudioStatus='pause';
              });
            }else{
              that.$refs.mySummaryAudio.pause();
              that.summaryAudioStatus='pause';
            }
          },

        }
    }
</script>
<style lang="scss" scoped>
  .homework{
    .banner{
      background: #fff;
      margin-bottom:8px;
      .banner-img{
        background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx.jpg) top center no-repeat;
        background-size: cover;
        width:100%;
        height: 208px;
        position: relative;
        .banner-txt{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width:100%;
          height: 97px;
          text-align: center;
          color:#eb6002;
          display: inline-block;
          vertical-align: bottom;
        }
        .banner-title{
          font-size:22px;
          margin-bottom:10px;
          margin-top: 26px;
          line-height: 10px;
        }
        .banner-score{
          font-size:13px;
        }
      }
      .banner-img-no{
        background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx-no.jpg) top center no-repeat;
        background-size: cover;
      }
      .banner-img-first-finish{
        background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx-finish.jpg) top center no-repeat;
        background-size: cover;
      }

    } /* banner */

    .summary-comment{
      margin-bottom:8px;
      background: #fff;
      padding: 16px;
      font-size: 16px;
      color:#606060;

      h4{
        display: block;
        font-size:16px;
        color:#222;
        font-weight: normal;
        border-left:4px solid #F08D00;
        margin-bottom:16px;
        padding-left:8px;
        line-height:16px;
      }
      .summary-box{
        .summary-img{
          width: 48px;
          height: 48px;
          border-radius: 100%;
          display: inline-block;
          vertical-align: middle;

        }
        .summary-audio{
          width: 125px;
          display: inline-block;
          height: 48px;
          background: #46A3FA;
          border-radius: 8px;
          vertical-align: middle;
          margin-left:16px;

          .ziyue-arrow{
            .audio-img{
              width: 20px;
              display: inline-block;
              vertical-align: middle;
            }
            .audio-time{
              padding-left:20px;
              line-height: 24px;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
      }
      .summary-txt-box{
        display:flex;
        align-content: center;
        align-items: start;

        .summary-txt{
          position: relative;
          background: #fff;
          border: 1px solid #eee;
          padding: 12px;
          width: inherit;
          min-height: 22px;
          border-radius: 6px;
          margin-left:16px;
          p{
            font-size:16px;
            color:#757575;
          }
        }
        .summary-txt::before {
          position:absolute;
          content:"";
          height:0;
          width: 0;
          pointer-events: none;
          border: solid transparent;
        }
        .summary-txt.arrow-left::before {
          width:12px;
          height: 12px;
          background: #fff;
          border:1px solid #eee;
          transform: rotate(45deg);
          border-right:0;
          border-top:0;
          margin-left:-19px;
        }
      }

    }
    /*  summary-comment  end*/

    .detail{
      margin-bottom:56px;
      background: #fff;
      padding: 16px;
      font-size: 16px;
      color:#606060;
      min-height: 300px;
      overflow: hidden;

      .detail-title{
        display: block;
        font-size:16px;
        color:#222;
        font-weight: normal;
        border-left:4px solid #F08D00;
        margin-bottom:16px;
        padding-left:8px;
        line-height:16px;
      }
      .detail-nums{
        border-bottom:1px solid #eee;
        padding-bottom:16px;

        .num-list{
          width: 100%;
          overflow-x: auto;
          height:48px;
          white-space: nowrap;
        }
        .num-item{
          background: #fff;
          border:1px solid #6CB3F5;
          border-radius: 100%;
          width: 46px;
          height:46px;
          font-size:32px;
          color:#6CB3F5;
          text-align: center;
          display: inline-block;
          margin-right:16px;
          line-height:46px;
        }
        .num-item:last-child{
          margin-right:0;
        }
        .num-item.num-item-cur{
          background: #6CB3F5;
          color:#fff;
        }
        .num-item-wrong{
          border:1px solid #FF6666!important;
          color:#FF6666;
        }
        .num-item-wrong.num-item-cur{
          background: #FF6666!important;
          color:#fff!important;
        }
      }
      /*detail-nums*/
      .question-list{
        padding:16px 0;
      }

    }

    .report-footer{
      position: fixed;
      bottom:0;
      left:0;
      right:0;
      background: #fff;
      padding:8px 16px;
      .back-btn{
        display: block;
        border:1px solid #F08D00;
        border-radius: 8px;
        font-size:20px;
        color:#F08D00;
        text-align: center;
        line-height: 28px;
        padding:6px 0;
      }
    }

  }

  @media only screen and (min-width: 768px) {
    .homework{
      .banner{

    .banner-img{
      background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx.jpg) top center no-repeat;
      background-size: contain;
    }
  }
    .banner-img-no{
      background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx-no.jpg) top center no-repeat;
      background-size: contain;
    }
    .banner-img-first-finish{
      background: url(//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/report-banner-wx-finish.jpg) top center no-repeat;
      background-size: contain;
    }
  }
  }
</style>
