<template>
  <!--安卓手机的简答题,答题方式如果选择了录像,则页面自动变为录音题 hsq 2019.1.14-->
  <div class="wechat-content-homework">
    <div class="homework-content">
        <div class="homework-title">
            <div class="homework-title-item" v-for="(item,idx) in questionList">
              <span class="question-type" v-if="item.questionType == 'CHOICE'&& idx == questionNum-1">单选题</span>
              <span class="question-type" v-if="item.questionType == 'MULTIPLE_CHOICE'&& idx == questionNum-1">多选题</span>
              <span class="question-type" v-if="item.questionType == 'FILL_THE_BLANKS'&& idx == questionNum-1">填空题</span>
              <span class="question-type" v-if="item.questionType == 'CONNECTION_PROBLEM'&& idx == questionNum-1">选择题</span>
              <span class="question-type" v-if="item.questionType == 'SUBJECTIVE'&& idx == questionNum-1">{{item.topic || '简答题'}}</span>

              <div class="question-num" v-if="idx == questionNum-1">
                <span>{{questionNum}}</span>/{{questionList.length}}
              </div>
            </div>
        </div>
        <div class="question-list">
          <div class="question-item" v-for="(item,idx) in questionList" :key="'q'+idx">
            <template v-if="item.questionType == 'SUBJECTIVE'&& idx == questionNum-1">
              <!--简答题-->
              <div class="q-subjective-box">
                <div class="q-title">
                  <template v-for="tItem in item.title">
                    <p class="q-title-txt" v-if="tItem.itemType=='TEXT'" v-html="tItem.itemValue"></p>
                    <img class="q-title-img" :src="tItem.itemValue" alt="" v-if="tItem.itemType=='IMG'">
                    <!--<audio v-if="tItem.itemType=='AUDIO'" :src="tItem.itemValue" controls></audio>-->
                    <xm-audio v-if="tItem.itemType == 'AUDIO'" :audioSrc="tItem.itemValue"></xm-audio>
                    <video v-if="tItem.itemType=='VIDEO'" :src="tItem.itemValue"
                           controls
                           playsinline="" webkit-playsinline="" x5-playsinline="allow"
                           style="width:95%;height: 180px;"></video>
                  </template>

                  <!--<p class="q-title-txt">我是一道简答题的题目，我也不知道我有多么的长，而且我的做大方式也不同。</p>-->
                  <!--<img class="q-title-img" src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/homework/question/20181221160321843685.png" alt="">-->
                  <!--<audio src="" controls></audio>-->
                  <!--<video src="" controls style="width:95%;height: 180px;"></video>-->
                </div>

                <div class="q-answer-box">
                  <div class="q-answer-txt">
                    <p class="txt-title">答</p>
                    <textarea  class="txt-content" v-model="subjectiveAnswerObj.txt" placeholder="输入或上传答案" rows="8" style="width: 100%;" @blur="resetWindow"></textarea>
                  </div>
                  <template v-if="item.answerWay && item.answerWay.length>1">
                    <div class="q-answer-preview">
                      <template v-for="(audioItem,idx) in subjectiveAnswerObj.audio">
                        <div class="preview-audio">
                          <!--<audio :src="audioItem" controls></audio>-->
                          <custom-audio :audioSrc="audioItem"></custom-audio>
                          <span class="audio-close" @click="delSubjective('audio',idx)"><i class="iconfont icon-wrong"></i></span>
                        </div>
                      </template>
                      <!--<div class="preview-audio" v-show="subjectiveAnswerObj.audio">-->
                        <!--<audio :src="subjectiveAnswerObj.audio" controls></audio>-->
                      <!--</div>-->
                      <template v-for="(imgItem,idx) in subjectiveAnswerObj.img">
                        <div class="preview-item">
                          <img class="item-main" :src="imgItem" alt="">
                          <i class="iconfont icon-wrong item-close" @click="delSubjective('img',idx)"></i>
                        </div>
                      </template>
                      <!--<div class="preview-item">-->
                        <!--<img class="item-main" -->
                             <!--src="https://onlinetest-public.oss-cn-beijing.aliyuncs.com/public/pic/welcome.png" alt="">-->
                        <!--<i class="iconfont icon-wrong item-close" @click="delSubjective('img',0)"></i>-->
                      <!--</div>-->
                      <div class="preview-video" v-show="subjectiveAnswerObj.video">
                        <video class="item-main"
                               poster="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/poster-video.png"
                               :src="subjectiveAnswerObj.video"
                               controls></video>
                        <i class="iconfont icon-wrong item-close" @click="delSubjective('video')"></i>
                      </div>
                    </div>
                    <div class="q-answer-other">
                      <div class="ziyue-flex">
                        <template v-for="(way,wayIdx) in item.answerWay">
                          <div class="ziyue-flex-item" v-if="way=='IMG'">
                            <div class="other-item">
                              <i class="iconfont icon-tupian" @click="chooseWxImg" style="cursor:pointer;"></i>
                            </div>
                            <p class="other-item-tip"> </p>
                          </div>
                          <template v-if="way=='AUDIO' || way=='VIDEO'">
                            <template v-if="ifAndroid">
                              <!--1,android 既有录音又有视频的时候,会显示两次录音,解决方法:way.length-->
                              <template v-if="item.answerWay.length>=4">
                                <!--作答方式≥4 既有audio 又有video,只显示audio-->
                                <div class="ziyue-flex-item" v-if="way=='AUDIO'">
                                  <div class="other-item">
                                    <i class="iconfont icon-luyin" @click="showRecordDialogFun" style="cursor:pointer;"></i>
                                  </div>
                                  <p class="other-item-tip"> </p>
                                </div>
                              </template>
                              <template v-else>
                                <!--作答方式小于4-->
                                <div class="ziyue-flex-item">
                                  <div class="other-item">
                                    <i class="iconfont icon-luyin" @click="showRecordDialogFun" style="cursor:pointer;"></i>
                                  </div>
                                  <p class="other-item-tip"> </p>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <!--2,ios  有啥显示啥-->
                              <div class="ziyue-flex-item" v-show="way=='AUDIO'">
                                <div class="other-item">
                                  <i class="iconfont icon-luyin" @click="showRecordDialogFun" style="cursor:pointer;"></i>
                                </div>
                                <p class="other-item-tip"> </p>
                              </div>
                              <div class="ziyue-flex-item" v-show="way=='VIDEO'">
                                <div class="other-item">
                                  <i class="iconfont icon-shipin"></i>
                                  <input class="q-file-video" type="file" :id="'hsqfileVideo'+idx" accept="video/*" capture="camcorder"
                                         @change="changeFileFunc('hsqfileVideo'+idx,'video')">
                                </div>
                                <p class="other-item-tip">仅支持一个视频</p>
                              </div>

                            </template>
                          </template>

                        </template>

                        <!--<div class="ziyue-flex-item">-->
                          <!--<div class="other-item">-->
                            <!--<i class="iconfont icon-luyin" @click="showRecordDialogFun" style="cursor:pointer;"></i>-->
                          <!--</div>-->
                          <!--<p class="other-item-tip"> </p>-->
                        <!--</div>-->
                        <!--<div class="ziyue-flex-item" v-show="!ifAndroid">-->
                          <!--<div class="other-item">-->
                            <!--<i class="iconfont icon-shipin"></i>-->
                            <!--<input class="q-file-video" type="file" :id="'hsqfileVideo'+idx" accept="video/*" capture="camcorder"-->
                                   <!--@change="changeFileFunc('hsqfileVideo'+idx,'video')">-->
                          <!--</div>-->
                          <!--<p class="other-item-tip">仅支持一个视频</p>-->
                        <!--</div>-->
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <fill-blank v-if="item.questionType == 'FILL_THE_BLANKS'&& idx == questionNum-1"
                        :fillData="item" :answer="currentAnswer"
                        @fill-check="fillblankCheckFun"></fill-blank>
            <single-choice v-if="item.questionType == 'CHOICE'&& idx == questionNum-1"
                           :singleData="item" :answer="currentAnswer"
                           @single-check="singleCheckFun"></single-choice>
            <multiple-choice v-if="item.questionType == 'MULTIPLE_CHOICE'&& idx == questionNum-1"
                             :multipleData="item" :answer="currentAnswer"
                             @multiple-choice="multipleCheckFun"></multiple-choice>
            <connection-choice :connectionData="item" :answer="currentAnswer"
                               v-if="item.questionType == 'CONNECTION_PROBLEM'&& idx == questionNum-1"
                               @connect-check="connectCheckFun"></connection-choice>
          </div>
        </div>
    </div>
    <div class="homework-footer">
      <div class="ziyue-flex">
        <div class="pre-box" v-show="questionNum>1">
          <button class="btn-homework" @click="preQuestionFun"><img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/pre-question.png" alt=""></button>
        </div>
        <div class="ziyue-flex-item next-box">
          <template v-if="questionNum<questionList.length">
            <button class="btn-homework" style="opacity: .4;" disabled v-show="ifNextDisabled">下一题</button>
            <button class="btn-homework" @click="nextQuestionFun" v-show="!ifNextDisabled">下一题</button>
          </template>
          <template v-else>
            <button class="btn-homework" style="opacity: .4;" disabled v-show="ifNextDisabled">提交作业</button>
            <button class="btn-homework" @click="dialogData.show=true" v-show="!ifNextDisabled">提交作业</button>
          </template>

          <!--<button class="btn-homework" @click="nextFillBlankFun">下一空</button>-->
        </div>
      </div>
    </div>
    <div class="uploading-box" v-show="ifShowUploading">
      <div class="uploading-bg"></div>
      <div class="uploading-main">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/uploading.gif" alt="">
      </div>
    </div>
    <div class="recording-box" v-show="ifWxRecordDialog">
      <div class="recording-bg" @click="cancelRecordBg"></div>
      <div class="recording-main">
        <div class="recording-main-content">
          <div class="recording-time">{{recordTime}}''/60''</div>
          <div class="recording-operation">
            <template v-if="ifRecordStatus==false">
              <p>点一下开始录音</p>
              <button class="btn-record" @click="beginWxRecordFun"><i class="iconfont icon-yuyin-shebeitiaoshi"></i></button>
            </template>
            <template v-else>
              <p>点一下结束录音</p>
              <button class="btn-record-end" @click="finishWxRecordFun"><i class="iconfont icon-lujing"></i></button>
            </template>
          </div>
        </div>

      </div>
    </div>
    <custom-dialog :dialogData="dialogData" @onConfirm="submitHomework()"
                   v-if="dialogData.show"></custom-dialog>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import SingleChoice from "@/components/SingleChoice"
  import MultipleChoice from "@/components/MultipleChoice"
  import ConnectionChoice from "@/components/ConnectionComponent"
  import FillBlank from "@/components/FillBlankComponent"
  import CustomAudio from '@/components/CustomAudioComponent' //自定义的audio播放样式

  import CustomDialog from '@/components/Dialog'
  import XmAudio from "@/components/AudioComponent" //题目、解析中的音频

  export default {
    name: "ClassHomework",
    components: {SingleChoice,FillBlank,MultipleChoice,ConnectionChoice,CustomAudio,CustomDialog,XmAudio},
    data() {
      return {
        dialogData:{
//          title:'提示',
          message:'提交后就不能修改了哦！',
          cancelButtonText:'再看看',
          confirmButtonText: "确定提交",//确认按钮文字
          confirmButtonColor: "#46A3FA",//确认按钮颜色
          cancelButtonColor:"#999",
          show:false,
        },
        lessonId:'', //课节id  url param中
        subjectId:'', //套题id  url param中
        homeworkIndex:'', //第几次作业,从1开始  url param中

        questionNum:1,//当前是第几
        // 题,从1开始
        curQuestion:{}, //当前题的题目,从questionList中获得
        subjectiveAnswerObj:{
          txt:"",
          img:[],
          audio:[], //["http://xxx.mp3","http:xxxxx.mp3"],
          video:""
        }, //当前作业中,学生做简答题作业的时候,输入的答案,目前只管文本

        currentAnswer:[], //保存答案时,传给数据库的参数
        questionList:[

        ], //题目列表
        homeworkRecordId:'1', //这个作业对应的记录id //debug 应该是空值
        hasAnswerInfo:[], //已经作答的题目的答案(做了几个,表示该继续进入下一题了)

        ifNextDisabled:true, //下一题是否是disabled状态  true--disable;false-可以点击了;最后一题时,控制提交作业
        ifShowUploading:false, //是否显示上传中的动图---用于上传图片和上传视频的过程中

        ifWxRecordDialog:false, //是否显示微信录音的窗口
        ifRecordStatus:false, //true--录音中  false--录音结束
        recordTime:0, //当前录音时间
        recordTimerFlag:null, //录音的flag
        localId:null, //微信录音的localId
        serverId:null, //微信录音的serverId

        ifHaveClickFlag:false, //下一题按钮是否点过 。 true--按钮点过了,不能再点;false--按钮没点过,可以点 避免按钮点两次
        ifHaveStartRecordFlag:false, //点了一次录音图片,就不能再点了

        ifAndroid : navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1|| navigator.userAgent.indexOf('Linux') > -1,//true--安卓
      }
    },
    watch:{
      subjectiveAnswerObj:{
        handler(val,old){
          console.log(val);
          console.log(old);
          if(val.txt.trim().length<1 && val.img.length<1
            && val.audio.length<1 && val.video.trim().length<1){
            this.ifNextDisabled = true;//下一题不可点
          }else{
            this.ifNextDisabled = false;
          }
        },
        immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        deep: true
      },
      questionNum(val,old){
        this.curQuestion =this.questionList[val-1]
      }

    },
    mounted() {
      let _this = this;
      _this.checkWeiXinBrowser(function () {
        _this.wxConfigZiYue();
        let params = _this.$route.params;
        if (params.subjectId && params.homeworkIndex) {
          _this.lessonId = Number(params.lessonId);
          _this.subjectId = Number(params.subjectId);
          _this.homeworkIndex = Number(params.homeworkIndex);
          _this.getHomeworkData();
          _this.confirmLesson();
        }
      });
    },
    methods: {
      resetWindow() {
        window.scroll(0, 0);
      },
      confirmLesson(){
        let _this = this;
        _this.request({
          method: 'post',
          url: '/student/lesson/confirm_lesson_task.do',
          param: {"lessonId":this.lessonId,"type":"MESSAGE_LESSON_HOMEWORK"},
          success: function (result) {
            console.log(result);
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },

      //获取作业内容
      getHomeworkData(){
        let _this = this;
        _this.request({
          method: 'post',
          url: '/homework/get_question.do',
          param: {"subjectId":_this.subjectId,"homeworkIndex":_this.homeworkIndex},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              _this.questionList = result.result.questionInfoList;

              _this.curQuestion = result.result.questionInfoList[0];//当前题目

              _this.getHomeworkRecord(); //获取完作业内容,去获取当前作业的状态,看看已经做到了第几题

            }else{
              _this.$message.error('获取作业失败，'+result.message);
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('获取作业失败，刷新页面重试。')
          }
        })
      },

      //获取这个作业的作业记录(假如作业做了一半,关掉手机,再次做的时候,已做的题目就不用做了)
      getHomeworkRecord(){
        let _this = this;
        let param = {
          "lessonId":_this.lessonId,
          "subjectId":_this.subjectId,
          "homeworkIndex":_this.homeworkIndex,
        };
        _this.request({
          method: 'post',
          url: '/homework/record/get_homework_record.do',
          param: param,
          success: function (result) {
            console.log(result,'  get_homework_record.do');
            if (result.code == 200) {
              console.log(result,"获取作业记录");
              _this.homeworkRecordId = result.result.id;
              _this.hasAnswerInfo = result.result.answerInfoList || [];
              _this.questionNum = _this.hasAnswerInfo.length+1; //继续开始做下一题
              _this.curQuestion =_this.questionList[ _this.questionNum-1];

              if(result.result.ifFinishAnswer){ //作业已完成
                _this.$router.replace('/homeworkReport/' + _this.lessonId + '/' + _this.subjectId + '/' + _this.homeworkIndex + '/2')
              }else{
                //作业没有做完:所有的题目都做了,但是提交的时候,没有提交成功
                if(_this.questionNum >_this.questionList.length){
                  _this.ifNextDisabled = false;

                  _this.questionNum = _this.questionList.length; //最后一个题
                  _this.curQuestion =_this.questionList[ _this.questionNum-1];

                }
              }
              _this.showAnswerFromStorage();

            }else{
              _this.$message.error('获取作业记录失败 '+result.message)
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('获取作业记录失败，刷新页面重试。')
          }
        })

      },

      //上一题按钮
      preQuestionFun(){
        let _this = this;

        _this.setLocalStorageAnswer(function () {
          _this.questionNum--;

          if (_this.questionNum <0){
            console.log('已经是第一题了,不能再后退了')
          }else{
            _this.curQuestion = _this.questionList[_this.questionNum - 1]
            _this.clearToDefault(); //数据恢复为默认值
            _this.ifHaveClickFlag = false; //进入下一题了,按钮可以点了
            _this.showAnswerFromStorage();
          }


        });
      },

      //下一题按钮
      nextQuestionFun(callback){
        let _this = this;
        //检查下是否填写了答案,没有填写就不能下一题
        let qType = _this.curQuestion.questionType;

        switch(qType){
          case 'SUBJECTIVE':
            let tmpAnswer = []; //当前题目,学生的答案
            if(_this.subjectiveAnswerObj.txt.trim()){
              tmpAnswer.push(_this.subjectiveAnswerObj.txt.trim().replace(/\n/g,'<br>'));
            }
            if(_this.subjectiveAnswerObj.img.length>0){
              tmpAnswer = tmpAnswer.concat(_this.subjectiveAnswerObj.img);
            }
            if(_this.subjectiveAnswerObj.audio.length>0){
              tmpAnswer = tmpAnswer.concat(_this.subjectiveAnswerObj.audio);
            }
            if(_this.subjectiveAnswerObj.video){
              tmpAnswer.push(_this.subjectiveAnswerObj.video);
            }
            if(tmpAnswer.length<1){
              alert('请作答');
              return false;
            }
            _this.currentAnswer = JSON.parse(JSON.stringify(tmpAnswer));
            break;
          case 'FILL_THE_BLANKS':
            break;
          case 'CHOICE':
            break;
          case 'MULTIPLE_CHOICE':
            break;
          case 'CONNECTION_PROBLEM':
            break;
          default:
            alert('不支持这种题型:'+qType);
            return false;
            break;
        }

        if(_this.ifHaveClickFlag == false){
          _this.setLocalStorageAnswer();

          console.log('第一次点。。');
          _this.ifHaveClickFlag = true; //按钮点过了,可以执行了
          //再保存本题的答案,最后在questionNum++;
          let param = {
            "homeworkRecordId": _this.homeworkRecordId,
            "questionNum": _this.questionNum,
            "answerData": JSON.stringify(_this.currentAnswer)
          }

          console.log(param,' 保存答案的参数');
          _this.request({
            method: 'post',
            url: '/homework/save_answer.do',
            param: param,
            success: function (result) {
              console.log(result);
              if (result.code == 200 && result.result) {

                _this.questionNum++;
                if (_this.questionNum > _this.questionList.length) {
                  //最后一题,不调用clearToDefault是为了防止保存答案成功,但是finish作业失败,再次点击'提交作业'按钮时重新保存最后一题答案失败。
                  if (callback) {
                    callback();
                  }
                } else {
                  _this.curQuestion = _this.questionList[_this.questionNum - 1]
                  _this.clearToDefault(); //数据恢复为默认值
                  _this.ifHaveClickFlag = false; //进入下一题了,按钮可以点了
                  _this.showAnswerFromStorage();

                }
              } else {
                _this.$message.error('保存答案失败，请重试。')
                _this.ifHaveClickFlag = false; //按钮可以点了
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('保存答案失败，点击下一题重试。')
              _this.ifHaveClickFlag = false; //按钮可以点了
            }
          });

        }else{
          console.log('点过了。。')
        }

      },

      //设置每道题的localStorage 主观题存subjectiveAnswerObj
      setLocalStorageAnswer(callback){
        let that = this;
        if(window.localStorage){
          let tmpKey = that.lessonId+'_'+that.questionNum;

          if(that.curQuestion.questionType=='SUBJECTIVE'){
            localStorage.setItem(tmpKey,JSON.stringify(that.subjectiveAnswerObj));

          }else{
            localStorage.setItem(tmpKey,JSON.stringify(that.currentAnswer));

          }
        }

        if(callback){
          callback();
        }
      },

      //将localStorage中缓存的学生答案赋值到页面上,在点击上一题、下一题的时候用到
      showAnswerFromStorage(){
        let that = this;
        window.scroll(0, 0); //回到页面最上面
        if(window.localStorage){
          let tmpKey = that.lessonId+'_'+that.questionNum;

          let tmpAnswer = localStorage.getItem(tmpKey);
          console.log('从localStorage得到缓存的答案   ',tmpAnswer);
          if(tmpAnswer!=null){
            if(that.curQuestion.questionType=='SUBJECTIVE'){
              that.subjectiveAnswerObj = JSON.parse(tmpAnswer);
            }else{
              that.currentAnswer = JSON.parse(tmpAnswer);
            }
          }

        }
      },

      //下一空按钮
      nextFillBlankFun(){

      },

      //点击下一题后,数据恢复为默认值
      clearToDefault(){
        this.subjectiveAnswerObj = {
            txt:"",
            img:[],
            audio:[],
            video:""
        };
        this.currentAnswer = [];
        this.ifNextDisabled = true; //下一题 不可点
//        this.ifSubmitDisabled = true; //提交作业 不可点
      },


      //简答题--选择微信图片
      chooseWxImg(){
        let _this = this;
        let localIds = [];
        wx.chooseImage({
          count: 3, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            console.log('hehe');
            console.log(res);
            localIds = res.localIds || []; // 返回选定照片的本地ID列表['weixin://xxx','','']，
            // localId可以作为img标签的src属性显示图片

            _this.ifNextDisabled = true; //上传图片或视频的时候,让'下一题'按钮不可点
            _this.ifShowUploading = true; //显示上传中gif
            _this.uploadImgToWxAndOss(localIds);
          }
        });

      },

      //简答题---选择微信图片后,上传到微信服务器和oss服务器
      uploadImgToWxAndOss(localIds){
        let _this = this;
        _this.ifNextDisabled = true; //上传图片或视频的时候,让'下一题'按钮不可点
        _this.ifShowUploading = true; //显示上传中gif

        let tmpIds = JSON.parse(JSON.stringify(localIds));
        console.log('tmpIds length ',tmpIds.length)

        syncUploadImg();

        function syncUploadImg() {
          console.log('syncUploadImg   syncUploadImg  syncUploadImg length  ',tmpIds.length);
          if (tmpIds.length<1) {
            _this.ifShowUploading = false; //上传中的gif
          } else {
            var localId = tmpIds.pop();
            wx.uploadImage({
              localId: localId,
              isShowProgressTips: 0, // 默认为1，显示进度提示.
              success: function(res) {
                var serverId = res.serverId; // 返回图片的服务器端ID

                _this.request({
                  method: 'post',
                  url: '/file/get_file_url.do  ',
                  param: {
                    mediaId:serverId,
                    fileType:'STUDENT_ANSWER_WX_IMG'
                  },
                  success: function (result) {
                    console.log(result,' 返回的微信图片在oss地址');
                    if (result.code == 200 && result.result) {
                      _this.subjectiveAnswerObj.img.push(result.result);
                    } else {
                      _this.$message.error('微信图片转换失败，请稍后重试。')
                    }
                    syncUploadImg();
                  },
                  error: function (error) {
                    //服务器异常
                    console.log(error);
                    _this.$message.error('微信图片转换失败，请重新上传图片');
                    _this.ifShowUploading = false; //上传中的gif
                  }
                });

              }
            });
          }
        }

      },

      //简答题--上传图片或视频--目前只有视频用到了
      changeFileFunc(ele,type){
        let _this = this;
        _this.ifNextDisabled = true; //上传图片或视频的时候,让'下一题'按钮不可点
        _this.ifShowUploading = true; //显示上传中gif
        console.log(ele,'  upload video')
        let fd = new FormData();
        fd.append("file", document.getElementById(ele).files[0]);
        if(type=='img') {
          fd.append("fileType", "STUDENT_ANSWER_IMG");
        }
        if(type=='video'){
          fd.append("fileType","STUDENT_ANSWER_VIDEO");
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/file/upload_file.do');
        xhr.onload = function () {
          console.log(xhr.responseText, "返回img   403");
          let backResponse = JSON.parse(xhr.responseText);

          if(backResponse.code==200 && backResponse.result){
            if(type=='img') {
              _this.subjectiveAnswerObj.img.push(backResponse.result);
            }
            if(type=='video'){
              _this.subjectiveAnswerObj.video = backResponse.result;
            }
            _this.ifNextDisabled = false; //上传成功后,让'下一题'按钮可点
            _this.ifShowUploading = false; //不显示上传中gif
          }
        };
        xhr.send(fd);
      },


      //简答题--删除视频or图片
      delSubjective(type,idx){
        let _this = this;
        if(type=='video'){
          let tmpAnswerObj = Object.assign(_this.subjectiveAnswerObj);
          tmpAnswerObj.video='';
          _this.subjectiveAnswerObj=tmpAnswerObj;
        }
        if(type=='img'){
          _this.subjectiveAnswerObj.img.splice(idx,1);
        }
        if(type=='audio'){
          _this.subjectiveAnswerObj.audio.splice(idx,1);
        }
      },

      //点击 录音按钮
      showRecordDialogFun(){
        //alert('暂不支持微信录音功能,请先使用录像功能');
        if(this.ifHaveStartRecordFlag==false){
          this.ifHaveStartRecordFlag = true; //再次点击录音图标无效
          this.ifWxRecordDialog=true;
        }

      },

      //录音dialog显示的情况下,点击蒙层的效果
      cancelRecordBg(){
        if(this.ifRecordStatus==false){ //未开始录音,点蒙层,隐藏录音弹窗
          this.ifWxRecordDialog=false;
          this.ifHaveStartRecordFlag=false;
        }
      },

      //简答题--开始微信录音
      beginWxRecordFun(){
        console.log('开始录音')
        let _this = this;

        _this.recordTime = 0;

        wx.startRecord({
          success:function () {
            console.log('start record')
            _this.ifRecordStatus = true; // = 'recording';
            console.log(_this.ifRecordStatus)
            _this.recordTimerFlag = setInterval(() => {
              _this.recordTime++;
            },1000)
            _this.listenTimeOnRecord();
          },
          cancel: function () {
            _this.$message.error('拒绝授权录音,将无法作答')
          }
        })
      },

      //监听录音时间,超过60秒自动停止录音,然后上传音频
      listenTimeOnRecord(){
        console.log('监听录音时间');
        let _this = this;
        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            _this.localId = res.localId
            _this.ifRecordStatus = false; // = 'recorded';
            console.log(_this.ifRecordStatus)

            console.log('60秒停止录音 localId  is  ',res.localId)
            clearInterval(_this.recordTimerFlag)
            _this.upVoice();
          }
        })

      },

      //上传录音的音频到wx服务器
      upVoice(){
        console.log('上传录音到wx服务器');
        let _this = this;
        _this.ifShowUploading = true; //上传中的gif

        wx.uploadVoice({
          localId: _this.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            let serverId = res.serverId; // 返回音频的服务器端ID
            _this.serverId = serverId;

            console.log('serverId  is  ',serverId)
            _this.uploadWxAudioToOss(serverId);

          }
        });
      },

      //上传微信的音频到oss服务器
      uploadWxAudioToOss(serverId){
        let _this = this;
        _this.request({
          method: 'post',
          url: '/file/get_file_url.do  ',
          param: {
            mediaId:serverId,
            fileType:'STUDENT_ANSWER_WX_AUDIO'
          },
          success: function (result) {
            console.log(result,' 返回的微信音频地址');
            if (result.code == 200 && result.result) {
              console.log(_this.subjectiveAnswerObj);
              _this.subjectiveAnswerObj.audio.push(result.result);
              _this.ifWxRecordDialog =false;
              _this.ifHaveStartRecordFlag = false; //可以点击录音图标了
              _this.ifShowUploading = false; //上传中的gif
              _this.recordTime = 0;//录音时间改为0
            } else {
              _this.$message.error('微信音频转换失败，请重试。')
              _this.ifWxRecordDialog =false;
              _this.ifHaveStartRecordFlag = false; //可以点击录音图标了
              _this.ifShowUploading = false; //上传中的gif
              _this.recordTime = 0;//录音时间改为0

            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('微信音频转换，请重新录音');
            _this.ifWxRecordDialog =false;
            _this.ifHaveStartRecordFlag = false; //可以点击录音图标了
            _this.ifShowUploading = false; //上传中的gif
            _this.recordTime = 0;//录音时间改为0
          }
        });
      },

      //简答题--停止微信录音
      finishWxRecordFun(){
        let _this = this;

        wx.stopRecord({
          success: function (res) {
            console.log('停止录音 ',res)
            clearInterval(_this.recordTimerFlag);
            _this.localId = res.localId;
            _this.ifRecordStatus = false;
            console.log(_this.ifRecordStatus,'  停止录音  localId is ',_this.localId)
            _this.upVoice();
          },
          fail: function (error) {
            clearInterval(_this.recordTimerFlag);
            _this.ifRecordStatus = false;
            console.log('停止录音 error ',error);
          }
        })
      },

      //单选题返回的答案
      singleCheckFun(val){
        console.log('第 '+ this.questionNum+' 题,单选,答案是: ',val);
        this.currentAnswer = [];
        this.currentAnswer.push(val);
        this.ifNextDisabled = false;
      },

      //多选题返回的答案
      multipleCheckFun(val){
        console.log('第 '+ this.questionNum+' 题,多选,答案是: ',val);

        //多选题,至少选择一个答案
        if(val.length>0){
          this.currentAnswer = val;
          this.ifNextDisabled = false; //下一题 可点
        }else{
          this.currentAnswer = [];
          this.ifNextDisabled = true; //下一题 不可点
        }
      },

      //连线题返回的答案
      connectCheckFun(val){
        console.log('第 '+ this.questionNum+' 题,连线,答案是: ',val);
        //需要判断长度
        if(val.length == this.curQuestion.answerList.length){
          this.currentAnswer = val;
          this.ifNextDisabled = false; //下一题 可点
        }else{
          this.currentAnswer = [];
          this.ifNextDisabled = true; //下一题 不可点
        }

      },

      //填空题返回的答案
      fillblankCheckFun(val){
        console.log('第 ' + this.questionNum + ' 题,填空,答案是: ', val);
        if (val.length == this.curQuestion.answerList.length) {
          this.currentAnswer = val;
          //判断每个空,是否都填了
          let ifWrite = true; //是否把数据传给父组件 true-可以传了
          for (let i = 0; i < val.length; i++) {
            if (val[i].trim().length < 1) {
              ifWrite = false;
              break;
            }
          }
          if (ifWrite) {
            this.ifNextDisabled = false; //每个空都填了,可以点下一题了
          } else {
            this.ifNextDisabled = true; //部分空 没有填写,不可以点 下一题
          }

        } else {
          this.currentAnswer = [];
          this.ifNextDisabled = true; //下一题 不可点
        }

      },

      //提交作业,先保存最后一题的答案,然后再调用提交作业接口
      submitHomework(){
        let _this = this;
        _this.nextQuestionFun(function () {

          let submitParam = {
            "homeworkRecordId": _this.homeworkRecordId
          };
          console.log(submitParam, '  submitParam');
          _this.request({
            method: 'post',
            url: '/homework/finish_homework.do',
            param: submitParam,
            success: function (result) {
              console.log(result);
              if (result.code == 200 && result.result) {
                //跳转之前,清除下 localStorage
                for (var k = 1; k <= _this.questionList.length; k++) {
                  let tmpDelKey = _this.lessonId + '_' + k;
                  window.localStorage.removeItem(tmpDelKey);
                  console.log('清除localStorage   ', tmpDelKey);
                }
                window.location.href = '/homeworkReport/' + _this.lessonId + '/' + _this.subjectId + '/' + _this.homeworkIndex + '/1';
              } else {
                _this.$message.error('提交作业失败，请重试。')
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('提交作业失败，点击重试。')
            }
          });

        });

      },

    }
  }
</script>

<style scoped lang="scss">
  .wechat-content-homework{
    position:relative;
    width:100%;
    height:100%;
    bottom:0;
    left:0;
    right:0;
    top:0;
    box-sizing: border-box;
  }
  .homework-content {
    padding: 0 16px 70px;
    background:#fff;
    .homework-title {
      padding: 16px 0;
      .homework-title-item{
        .question-type {
          padding: 2px 8px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          border-radius: 12px;
          display: inline-block;
          background: #E7F3FD;
          color: #46A3FA;
          font-size: 14px;
        }
        .question-num {
          float: right;
          color: #BDBDBD;
          font-size: 12px;
          span {
            color: #6CB3F5;
            font-size: 20px;
          }
        }
      }
    }
    .question-list{
      .q-subjective-box{
        .q-title {
          margin-bottom: 8px;

            .q-title-txt {
              font-size: 18px;
              font-weight: 400;
              color: #222;
              line-height: 26px;
              margin-bottom: 8px;
            }

            .q-title-img {
              width: 100%;
              margin-bottom: 8px;
            }

        }

        .q-answer-box{
          margin-top:8px;
          min-height:280px;
          overflow: hidden;
          background:#FAFAFA;
          border-radius:12px;
          padding:16px 16px 10px;
          .q-answer-txt{
            .txt-title{
              font-size:18px;
              color:#6CB3F5;
              font-weight: 400;
              line-height: 18px;
              margin-bottom:16px;
            }
            .txt-content{
              background: transparent!important;
              border: 0!important;
              font-size:18px;
              color:#606060;
            }
          }
          .q-answer-preview{
            margin-bottom:4px;
            .preview-audio{
              margin-bottom:16px;

              .component-audio{
                display: inline-block;
              }
              .audio-close{
                width: 20px;
                height: 20px;
                background: #BDBDBD;
                border-radius: 100%;
                line-height: 20px;
                color:#fff;
                text-align: center;
                margin-left:12px;
                display: inline-block;
                cursor: pointer;
              }
            }
            .preview-item{
              width: 92px;
              height: 92px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 8px;
              margin-bottom: 8px;
              position: relative;
              .item-main{
                width: 92px;
                height: 92px;
                z-index: 21;
              }
              .item-close{
                position: absolute;
                right: -6px;
                top:-6px;
                z-index: 22;
                background: #FF7575;
                width: 16px;
                height: 16px;
                border-radius: 100%;
                text-align: center;
                line-height: 16px;
                font-size:16px;
                color:#fff;
                cursor: pointer;
              }
            }
            .preview-video{
              margin-top:8px;
              margin-bottom: 8px;

              video{
                width: 90%;
                height: 200px;
                display: inline-block;
                background: #222;
                vertical-align: middle;
                position: relative;
                z-index: 20;
              }
              .item-close{
                display: inline-block;
                vertical-align: middle;
                background: #FF7575;
                width: 16px;
                height: 16px;
                border-radius: 100%;
                text-align: center;
                line-height: 16px;
                font-size:16px;
                color:#fff;
                cursor: pointer;
              }
            }
          }
          .q-answer-other{
            border-top:1px solid #E0E0E0;
            text-align: center;
            padding:10px 0 0;
            .other-item-tip{
              text-align: center;
              color: #bdbdbd;
              font-size: 10px;
              padding: 10px 0 0;
              line-height: 1;
              height: 12px;
            }
            .other-item {
              width: 32px;
              height: 32px;
              margin:0 auto;
              position: relative;
              .iconfont {
                font-size: 30px;
                color: #e0e0e0;
              }
              .q-file-video {
                opacity: 0;
                width: inherit;
                height: inherit;
                position: absolute;
                top:0;
                left:0;
                right:0;
                bottom:0;
              }

            }
          }
        }

      }
    } /* question-list end */


  }

  .homework-footer{
    position: fixed;
    left:0;
    right:0;
    bottom:0;
    z-index: 23;
    padding:8px 16px;
    background: #fff;
    border-top:1px solid #f5f5f5;

    .btn-homework{
      padding:8px 16px;
      line-height:28px;
      cursor: pointer;
    }
    .pre-box{
      width:65px;
      margin-right:8px;
      .btn-homework{
        border: 1px solid #6CB3F5;
        border-radius:12px;
        background: #fff;
        text-align: center;
        width: 100%;
        cursor: pointer;
        img{
          width: 100%;
          height: 8px;
          margin: 6px auto 0;
        }
      }
    }
    .next-box{
      .btn-homework{
        text-align: center;
        background: #46A3FA;
        border: 1px solid #6CB3F5;
        box-shadow:0px 2px 4px 0px rgba(0,120,199,0.24);
        border-radius:12px;
        display: inline-block;
        width: 100%;
        font-size:20px;
        font-weight:400;
        color:#fff;
        line-height:28px;
        cursor: pointer;

      }
    }
  }

  .uploading-box{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:50;

    .uploading-bg{
      background:rgba(0,0,0,0.32);
      width: 100%;
      height: 100%;
    }
    .uploading-main{
      position: relative;
      top:-70%;
      text-align: center;
      img{
        width: 120px;
        height: 120px;
        background:rgba(255,255,255,1);
        box-shadow:0px -1px 4px 0px rgba(0,0,0,0.08);
        border-radius:12px;
      }
    }

  }

  .recording-box{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:49;
    .recording-bg{
      position: relative;
      background:rgba(0,0,0,0.32);
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .recording-main{
      position: fixed;
      bottom:0;
      left:0;
      right:0;
      text-align: center;

      .recording-main-content{


      }
      .recording-time{
        font-size:24px;
        font-weight:400;
        color:#fff;
        line-height:33px;
        text-align: center;
        padding-bottom: 16px;
      }
      .recording-operation{
        background: #fff;
        height: 118px;
        text-align:center;
        p{
          font-size:14px;
          color:#909090;
          line-height: 22px;
          padding:16px 0;
        }
        .btn-record{
          width:96px;
          height:46px;
          background:rgba(70,163,250,1);
          border:1px solid rgba(70,163,250,1);
          box-shadow:0px 2px 4px 0px rgba(0,120,199,0.24);
          border-radius:24px;
          cursor:pointer;
          .iconfont{
            font-size:24px;
            color:#fff;
          }
        }
        .btn-record-end{
          width:96px;
          height:46px;
          box-shadow:0px 2px 4px 0px rgba(255,102,102,0.32);
          border-radius:24px;
          border:1px solid rgba(235,96,2,1);
          background:#fff;
          cursor:pointer;
          .iconfont{
            font-size:24px;
            color:#FF6666;
          }
        }

      }

    }
  }

</style>
