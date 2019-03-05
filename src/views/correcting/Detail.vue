<template>
    <!--<div>老师批改作业的页面</div>-->
  <el-container class="correct-container">
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">批改作业</a>
      </el-breadcrumb>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="hw-header">
          <div class="ziyue-flex">
            <div class="ziyue-flex-item">
              <p class="header-title">{{studentName}}的课后作业</p>
              <p class="header-desc">{{courseName}} <span class="c-f-primary">第 {{homeworkIndex}} 讲</span></p>
            </div>
            <template v-if="objectiveList.length>0">
              <div class="hw-header-score">
                <p class="score-title">客观题得分</p>
                <p class="score-num">{{objectiveScoreStudent}}<span>/{{objectiveScoreTotal}}</span></p>
              </div>
              <div class="hw-header-detail">
                <el-button type="text" @click="objectDetailDialog=true">查看详情</el-button>
              </div>
            </template>
          </div>
        </div>
        <div class="hw-correct">
          <h4 class="hwc-title">批改</h4>
          <div class="hwc-num-list">
            <!--subjectiveList-->
            <div class="hwc-num-item" v-for="(sub,idx) in subjectiveList" :key="'n'+idx" @click="currentNumFun(idx)">
              <el-button :class="{'el-button--primary':currentNum==idx}">题目{{sub.questionNum}} </el-button>
              <!--<i class="iconfont icon-right hw-corrected"></i>-->
            </div>
            <div class="hwc-num-item" @click="currentNumFun(subjectiveList.length)"><el-button :class="{'el-button--primary':currentNum==subjectiveList.length}">作业评语</el-button></div>

          </div>
          <div class="hwc-question-list">
            <div class="question-item" v-for="(sub,idx) in subjectiveList" :key="'q'+idx" v-show="currentNum==idx">
              <div class="q-title">
                <template v-for="(item,titleIdx) in sub.title">
                  <div class="q-title-txt" v-if="item.itemType=='TEXT'" v-html="item.itemValue"></div>
                  <img v-if="item.itemType=='IMG'" :src="item.itemValue" alt="">
                </template>

              </div>

              <div class="q-blank-list">
                <p class="blank-title">学生答案:</p>
                <div class="blank-item " v-if="answerInfoList[sub.questionNum-1]">
                  <div class="blank-item-subjective">
                    <template v-for="(ansItem,ansIdx) in answerInfoList[sub.questionNum-1].subjectiveAnswerList">
                      <p class="stu-txt" v-if="ansItem.itemType=='TEXT'" v-html="ansItem.itemValue"></p>
                    </template>
                    <div class="stu-img-list" >
                      <div class="img-item"
                           v-for="(ansItem,ansIdx) in answerInfoList[sub.questionNum-1].subjectiveAnswerList"
                           :key="'imgAns'+ansIdx"
                           v-if="ansItem.itemType=='IMG'">
                        <img :src="ansItem.itemValue" alt="">
                        <div class="img-hover">
                          <p class="hover-operate" @click="previewImg(ansItem.itemValue)">查看</p>
                          <p class="hover-operate" @click="downloadImg(ansItem.itemValue)">下载</p>
                        </div>
                      </div>
                    </div>
                    <template v-for="(ansItem,ansIdx) in answerInfoList[sub.questionNum-1].subjectiveAnswerList">
                      <div class="stu-audio" v-if="ansItem.itemType=='AUDIO'">
                        <audio :src="ansItem.itemValue" controls preload></audio>
                      </div>
                      <div class="stu-video" v-if="ansItem.itemType=='VIDEO'">
                        <video :src="ansItem.itemValue" controls></video>
                      </div>
                    </template>

                  </div>

                </div>
              </div>
              <div class="q-comment-box">
                <p class="blank-title">老师点评:</p>
                <div class="blank-item">
                  <div class="teacher-score">
                    <div class="blank-total">总分：<span class="c-f-primary">{{answerInfoList[sub.questionNum-1].totalScore}}</span></div>
                    <div class="set-score" v-show="answerInfoList[sub.questionNum-1].totalScore>0">得分：
                      <el-input-number size="small"
                                       v-model="questionScoreList[idx]"
                                       :min="0"
                                       :max="answerInfoList[sub.questionNum-1].totalScore" label="描述文字"></el-input-number>
                    </div>
                    <div class="set-score" v-show="answerInfoList[sub.questionNum-1].totalScore==0">
                      不需要给分
                    </div>
                  </div>
                  <div class="teacher-txt">
                    <el-input type="textarea" :rows="5" v-model="questionMarkMap[''+(sub.questionNum)].markText" placeholder="请输入"></el-input>
                  </div>
                  <div class="teacher-record">
                    <template v-if="questionMarkMap[''+(sub.questionNum)].markAudio.length>0">
                      <audio :src="questionMarkMap[''+(sub.questionNum)].markAudio" controls></audio>

                      <el-popover
                        placement="bottom"
                        width="210"
                        v-model="delAudioVisible">
                        <p><i class="iconfont icon-warning-circle-fill audio-del-icon"></i>确定要删除这条录音吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="delAudioVisible = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="removeMarkAudioSubmit">确定</el-button>
                        </div>
                        <i class="audio-close iconfont icon-wrong" slot="reference" @click="removeMarkAudioTip(sub.questionNum)"></i>

                        <!--<el-button >删除</el-button>-->
                      </el-popover>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="startRecordFun(sub.questionNum)">
                        <i class="iconfont icon-yuyin-shebeitiaoshi"></i>录音点评
                      </el-button>
                    </template>
                  </div>
                  <!--<div class="teacher-upload-list">-->
                  <!--等功能完成后再研究使用el-upload上传的实现方式,这几行代码请不要删除 -->
                  <!--</div>-->
                  <div class="teacher-imgs">
                    <div class="img-upload-box">
                      <div class="img-upload-main">
                        <i class="iconfont icon-jiahao ziyue-upload-add "></i>
                        <p class="upload-txt">上传图片</p>
                        <div class="upload-file">
                          <input class="ipt-file" :id="'hsqFileImg'+sub.questionNum" type="file"
                                 accept="image/*"
                                 @change="changeFileFunc('hsqFileImg'+sub.questionNum,sub.questionNum,questionMarkMap[''+sub.questionNum])">
                        </div>
                      </div>
                      <p class="upload-tip">支持.jpg .jpeg .png</p>
                    </div>

                    <div class="img-upload-item"
                         v-for="(img,imgIdx) in questionMarkMap[''+sub.questionNum].markImgList"
                         :key="'timg-'+sub.questionNum+'-'+imgIdx">
                      <img class="upload-img" :src="img" alt="">
                      <div class="upload-img-hover" @click="previewImg(img)">查看图片
                        <!--<p class="hover-operate" @click="previewImg(img)">查看</p>-->
                        <!--<p class="hover-operate" @click="downloadImg(img)">下载</p>-->
                      </div>
                      <i class="upload-close iconfont icon-wrong" @click="removeMarkMapImg(sub.questionNum,imgIdx)"></i>
                    </div>

                  </div>
                </div>
              </div>
            </div>

           <!--后期考虑用el-upload来上传图片-->

            <div class="question-item" v-if="currentNum == subjectiveList.length">
              <div class="total-remark">
                <div class="score-box">
                  <p class="score-label">总分</p>
                  <div class="score-detail">
                    <span class="score-detail-item">
                      <span class="get-total">{{subjectiveScoreStudent+objectiveScoreStudent}}</span>/{{subjectiveScoreTotal+objectiveScoreTotal}}
                    </span>
                    <span class="score-detail-item">主观题得分：<span class="c-f-primary">{{subjectiveScoreStudent}}</span>/{{subjectiveScoreTotal}}</span>
                    <span class="score-detail-item">客观题得分：<span class="c-f-primary">{{objectiveScoreStudent}}</span>/{{objectiveScoreTotal}}</span>
                  </div>
                </div>
                <div class="total-comment-box">
                  <p class="comment-select">你可以选择：
                    <el-radio-group style="display: inline-block" v-model="ifTextMark">
                      <el-radio-button label="文字评语"></el-radio-button>
                      <el-radio-button label="录音评语"></el-radio-button>
                    </el-radio-group>
                  </p>
                  <template v-if="ifTextMark=='文字评语'">
                    <div class="txt-comment">
                      <el-input type="textarea" v-model="homeworkRemark.markText" :rows="5" placeholder="请输入学生作业的评语"></el-input>

                    </div>
                  </template>
                  <template v-else>
                    <div class="audio-comment" v-show="homeworkRemark.markAudio.length>0">
                      <audio :src="homeworkRemark.markAudio" controls></audio>
                      <el-popover
                        placement="bottom"
                        width="210"
                        v-model="delAudioVisible">
                        <p><i class="iconfont icon-warning-circle-fill audio-del-icon"></i> 确定要删除这条录音吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="delAudioVisible = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="removeMarkAudioSubmit">确定</el-button>
                        </div>
                        <i class="audio-comment-close iconfont icon-wrong" slot="reference" @click="removeMarkAudioTip('all')"></i>

                        <!--<el-button >删除</el-button>-->
                      </el-popover>
                    </div>
                    <el-button type="primary" @click="startRecordFun('999')"  v-show="homeworkRemark.markAudio.length<1"><i class="iconfont icon-yuyin-shebeitiaoshi"></i>录音点评</el-button>
                  </template>
                </div>
              </div>
            </div>

          </div>
        </div>
      </el-main>
      <el-dialog
        title="录音中…"
        :modal-append-to-body="false"
        :visible.sync="recordDialogShow"
        :close-on-click-modal="false"
        :show-close="false"
        width="30%">
        <div class="dialog-body">
          <i class="iconfont icon-luyin"></i>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button plain @click="stopRecordHandle"><i class="iconfont icon-zanting"></i>完成录音</el-button>
          </span>
      </el-dialog>
      <el-dialog
        title="客观题作答详情"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="objectDetailDialog"
        :show-close="true"
        width="50%" min-width="660px" height="520px" class="correct-objective-dialog">

        <div class="question-list">
          <div class="question-list-block" v-for="(quesItem,idx) in objectiveList">
            <div class="question-score">
              <span>题目{{quesItem.questionNum}}  <template v-if="answerInfoList[idx]">（{{answerInfoList[idx].totalScore}}分）</template></span>
              <span class="score-content" v-if="answerInfoList[idx]">+{{answerInfoList[idx].correctScore}}分</span>
            </div>
            <choice :questionData = 'quesItem' :recordData="answerInfoList[idx].objectiveAnswerList||[]"
                    v-if="quesItem.questionType=='CHOICE'||quesItem.questionType=='MULTIPLE_CHOICE'"></choice>
            <fill-blank :questionData = 'quesItem' :recordData="answerInfoList[idx].objectiveAnswerList||[]"
                        v-if="quesItem.questionType=='FILL_THE_BLANKS'"></fill-blank>
            <connection :questionData = 'quesItem' :recordData="answerInfoList[idx].objectiveAnswerList||[]"
                        v-if="quesItem.questionType=='CONNECTION_PROBLEM'"></connection>
          </div>
        </div>

      </el-dialog>

      <!--预览图片-->
      <el-dialog
        title=""
        :modal-append-to-body='false'
        :visible.sync="imgPreviewFlag"
        width="40%">
        <div class="dialog-img">
          <img :src="imgPreviewUrl" alt="">
        </div>
      </el-dialog>

      <!--上传中-->
      <div class="uploading-box" v-show="ifShowUploading">
        <div class="uploading-bg"></div>
        <div class="uploading-main">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/uploading.gif" alt="">
        </div>
      </div>

    </el-container>
    <div class="correct-footer">
      <template v-if="ifSubmit">
        <el-button type="primary" @click="submitCorrect">提交批改</el-button>
      </template>
      <template v-else>
        <el-button type="info" plain disabled>提交批改</el-button>
      </template>

    </div>
  </el-container>
</template>

<script>
  import Recorder from 'recorder-js';
  var AudioContextRv = window.AudioContext || window.webkitAudioContext;
  var contextRv = new AudioContextRv();
  var configRv = {
    "sampleBits":8,    //采样数位 8, 16
    "sampleRate": (44100 / 6),  //采样率(1/6 44100)
  };

  const recorder = new Recorder(contextRv, {
    onAnalysed: data =>{
//      console.log(data)
    }

  });

  var isHTTPs = ((navigator.getUserMedia != null) && location.protocol == 'https:')
  if(!isHTTPs){
    alert('当前网站不支持录音,请在https环境下录音');
  }

  navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      recorder.init(stream);
    })
    .catch(err => console.log('Uh oh... unable to get stream...', err));


  var audioDataRv = {
    size: 0          //录音文件长度
    , buffer: []     //录音缓存
    , inputSampleRate: contextRv.sampleRate    //输入采样率
    , inputSampleBits: 16       //输入采样数位 8, 16
    , outputSampleRate: configRv.sampleRate    //输出采样率
    , oututSampleBits: configRv.sampleBits       //输出采样数位 8, 16
    , input: function (data) {
      this.buffer.push(new Float32Array(data));
      this.size += data.length;
    }
    , compress: function () { //合并压缩
      //合并
      var data = new Float32Array(this.size);
      var offset = 0;
      for (var i = 0; i < this.buffer.length; i++) {
        data.set(this.buffer[i], offset);
        offset += this.buffer[i].length;
      }
      //压缩
      var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
      var length = data.length / compression;
      var result = new Float32Array(length);
      var index = 0, j = 0;
      while (index < length) {
        result[index] = data[j];
        j += compression;
        index++;
      }
      return result;
    },
    encodeWAV: function () {
      var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
      var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
      var bytes = this.compress();
      var dataLength = bytes.length * (sampleBits / 8);
      var buffer = new ArrayBuffer(44 + dataLength);
      var data = new DataView(buffer);

      var channelCount = 1;//单声道
      var offset = 0;

      var writeString = function (str) {
        for (var i = 0; i < str.length; i++) {
          data.setUint8(offset + i, str.charCodeAt(i));
        }
      }

      // 资源交换文件标识符
      writeString('RIFF');
      offset += 4;
      // 下个地址开始到文件尾总字节数,即文件大小-8
      data.setUint32(offset, 36 + dataLength, true);
      offset += 4;
      // WAV文件标志
      writeString('WAVE');
      offset += 4;
      // 波形格式标志
      writeString('fmt ');
      offset += 4;
      // 过滤字节,一般为 0x10 = 16
      data.setUint32(offset, 16, true);
      offset += 4;
      // 格式类别 (PCM形式采样数据)
      data.setUint16(offset, 1, true);
      offset += 2;
      // 通道数
      data.setUint16(offset, channelCount, true);
      offset += 2;
      // 采样率,每秒样本数,表示每个通道的播放速度
      data.setUint32(offset, sampleRate, true);
      offset += 4;
      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
      offset += 4;
      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
      data.setUint16(offset, channelCount * (sampleBits / 8), true);
      offset += 2;
      // 每样本数据位数
      data.setUint16(offset, sampleBits, true);
      offset += 2;
      // 数据标识符
      writeString('data');
      offset += 4;
      // 采样数据总数,即数据总大小-44
      data.setUint32(offset, dataLength, true);
      offset += 4;
      // 写入采样数据
      if (sampleBits === 8) {
        for (var i = 0; i < bytes.length; i++, offset++) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
          val = parseInt(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val, true);
        }
      } else {
        for (var i = 0; i < bytes.length; i++, offset += 2) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
      }

      return new Blob([data], {type: 'audio/wav'});
    }
  };

  import choice from '../classmanage/Choice'
  import FillBlank from '../classmanage/FillBlank'
  import connection from '../classmanage/Connection'
  import dd from 'dingtalk-jsapi';
    export default{
        name: '',
        props: [],
        components: {choice,FillBlank,connection},
        data(){
            return {
              currentNum:0, //当前题号按钮,选择的是哪一个?从0开始

              homeworkRecordId:'', //url中的recordId

              studentName:'小林同学',//学生名
              courseName:'某个课程',//课程名
              homeworkIndex:1, //第几讲

              objectiveScoreTotal:0, //客观题总分
              objectiveScoreStudent:0, //客观题学生得分
              subjectiveScoreTotal:0, //主观题总分
              subjectiveScoreStudent:0, //主观题学生得分
              objectiveList:[], //客观题列表,非Subjective
              subjectiveList:[], //需要批改的主观题列表
              //主观题和客观题的格式 {explainList: Array(1),questionNum: 2,questionType: "SUBJECTIVE",title: Array(1)}
              answerInfoList:[], //学生的答案列表

              questionScoreList:[], //每个主观题的评分
              questionMarkMap:{

              }, //每个主观题的评分及评语

              homeworkRemark:{
                markAudio:'',
                markText:''
              }, //作业的整体评语

              ifTextMark:'文字评语',//文字评语还是录音评语
              ifSubmit:false, //是否可以'提交批改了'  true--提交批改按钮可点;false--提交批改按钮不可点

              isRecording:false, //true--正在录音中; false--没有录音
              recordNum:0, //当前录音的这题,对应的题号(从1开始,如果是总的作业评语,则为999)
              recordDialogShow:false, //录音的弹窗是否显示
              objectDetailDialog:false, //客观题详情弹窗

              imgPreviewFlag :false, //预览图片的弹窗是否显示
              imgPreviewUrl : '',//预览的图片地址

              ifShowUploading:false, //显示gif窗口
              delAudioVisible :false, //删除录音评语的popover
              delAudioQuestionNum:0, //删除录音评语的题号(题目几中的几)
            }
        },
        mounted(){
          let params = this.$route.params;
          if(params.recordId && params.studentName && params.courseName){
            this.homeworkRecordId = params.recordId;
            this.studentName = params.studentName;//学生名
            this.courseName = params.courseName;//课程名
            this.getHomeworkAllInfo();
          }
        },
        watch: {

          //老师批改的时候,给的主观题的分数
          questionScoreList:{
            handler(val,old){
              this.subjectiveScoreStudent = 0; //学生主观题得分为0
              val.map(item => {
                this.subjectiveScoreStudent += parseInt(item);
              });
            },
            immediate: true,
            deep:true
          },

          //整个作业的评语
          homeworkRemark:{
            handler(val,old){
              if(val.markAudio.length<1 && val.markText.length<1){
                this.ifSubmit = false; //提交按钮不可点
              }else{
                this.ifSubmit = true; //提交按钮可点
              }
            },
            immediate: true,
            deep:true
          }
        },
        methods: {

          //获取作业题目+学生答案+老师评语
          getHomeworkAllInfo(){
            let _this = this;

            _this.request({
              method: 'post',
              url: '/manage/homework/get_student_homework_record.do',
              param: {"homeworkRecordId":_this.homeworkRecordId},
              success: function (result) {
                console.log(result);
                if (result.code == 200) {
                  console.log(result,"获取批改作业");

                  //主观题和客观题列表,第几讲
                  let tmpSubjectInfo = result.result.subjectQuestionInfo || {};

                  _this.homeworkIndex = tmpSubjectInfo.homeworkIndex || ''; //第几讲

                  let tmpQuestionAll = tmpSubjectInfo.questionInfoList || [];
                   tmpQuestionAll.map((key,idx) => {
                     key.questionNum = idx+1;
                    if(key.questionType=='SUBJECTIVE'){
                      _this.subjectiveList.push(key);

                      //同时设置主观题的分数及评语对象
                      _this.$set(_this.questionMarkMap,''+(idx+1),{
                        "markAudio": "",
                        "markImgList": [],
                        "markScoreMap": {"1": 0,},
                        "markText":""
                      });
                      _this.questionScoreList.push(0); //每个题目,老师给的分数

                    }else{
                      _this.objectiveList.push(key);
                    }
                  });
                  console.log(_this.subjectiveList,"获取sub作业");
                  console.log(_this.objectiveList,"获取obj作业");
                  console.log(_this.questionMarkMap,"questionMarkMap 各个主观题的评分及评语");
                  console.log(_this.questionScoreList,"questionScoreList 自定义的主观题的评分");


                  //学生的答案;及主观题、客观题的总分
                  let tmpRecordInfo = result.result.studentHomeworkRecord || {};
                  _this.answerInfoList = tmpRecordInfo.answerInfoList;
                  console.log(_this.answerInfoList," 答案列表-----学生的");

                  _this.answerInfoList.map((key,idx) =>{
                    if(key.questionType =='SUBJECTIVE'){//主观题总分、学生得分
                      _this.subjectiveScoreTotal += parseInt(key.totalScore);
//                      _this.subjectiveScoreStudent += parseInt(key.correctScore); //加载题目的时候应该不需要计算

                      //加载学生答案中的视频  answerInfoList[sub.questionNum-1].subjectiveAnswerList

                    }else{ //客观题总分、学生得分
                      _this.objectiveScoreTotal += parseInt(key.totalScore);
                      _this.objectiveScoreStudent += parseInt(key.correctScore);
                    }
                  });



                }else{
                  _this.$message.error('获取批改作业详细信息失败，刷新页面重试。')
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('获取批改作业失败，刷新页面重试。')
              }
            })
          },

          //点击"题目x','作业评语'按钮时的事件,设置当前批改的区域对应的currentNum
          currentNumFun(val){
            this.currentNum = parseInt(val);
          },

          //预览图片--针对学生上传的
          previewImg(url){
            console.log(url);
            this.imgPreviewFlag = true;
            this.imgPreviewUrl = url;

            /* 接口成功了,但是url无法是数组,所以不用钉钉的预览图片
            dd.biz.util.previewImage({
              urls: [url],//['//static.dingtalk.com/media/1.jpg', '//static.dingtalk.com/media/2.jpg'],//图片地址列表
              current: url,//'//static.dingtalk.com/media/1.jpg',//当前显示的图片链接
              onSuccess : function(result) {

              },
              onFail : function() {}
            })
            */
          },

          //钉钉下载图片
          downloadImg(img){
            dd.biz.util.downloadFile({
              url: img, //要下载的文件的url
              name: '', //定义下载文件名字
              onProgress: function(msg){
                // 文件下载进度回调
              },
              onSuccess : function(result) {
                /*
                 true
                 */
              },
              onFail : function() {}
            })
          },

          //点击录音点评按钮--开始录音弹窗  qNum=999表示是整个作业的评语
          startRecordFun(qNum){
            console.log('开始录音')
            let _this = this;
            _this.recordNum = parseInt(qNum);
            _this.recordDialogShow = true;
            recorder.start()
              .then(() => _this.isRecording = true);
          },

          //完成录音
          stopRecordHandle(){
            console.log('停止录音')
            let _this = this;
            recorder.stop()
              .then(({blob, buffer}) => {

                if(buffer && buffer[0]) {
                  audioDataRv.input(buffer[0]); //只能buffe[0],如果循环buffer.length的话,会变成双倍时间的音频,即音频内容是两遍一模一样的内容。
                  _this.uploadRecord();
                }else{
                  alert('录音失败');
                  _this.isRecording = false;
                  _this.recordDialogShow = false
                }
              });
          },


          //上传录音到后台服务器
          uploadRecord(){
            let _this = this;
            _this.ifShowUploading = true; //显示上传中gif
            let  url = '/api/file/upload_wav_file.do  ';
            let tmpFileBinary = audioDataRv.encodeWAV();

            var fd = new FormData();
            fd.append("file", tmpFileBinary);
            fd.append("fileType", "HOMEWORK_MARK_AUDIO");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.onload = function () {
              console.log(xhr.responseText, "返回的音频");
              let backResponse = JSON.parse(xhr.responseText);
              _this.isRecording = false; //未录音状态

              if(backResponse.code==200 && backResponse.result){
                if(_this.recordNum==999){
                  //作业的整个评语
                  _this.homeworkRemark.markAudio = backResponse.result;
                  console.log(_this.homeworkRemark,'-----upload整体作业音频之后');
                }else{
                  //单个题目的评语
                  let oldMarkMap = Object.assign({},_this.questionMarkMap); //浅克隆
                  oldMarkMap[''+_this.recordNum].markAudio = backResponse.result;
                  _this.questionMarkMap = oldMarkMap;
                  console.log(_this.questionMarkMap,'-----upload音频之后');
                }

                _this.recordDialogShow = false; //录音弹窗 不显示
                audioDataRv.size = 0; //将录音文件还原为初始值
                audioDataRv.buffer = [];
                _this.ifShowUploading = false; //上传中gif
              }else{
                alert("上传音频失败");
                _this.recordDialogShow = false; //录音弹窗 不显示
                audioDataRv.size = 0; //将录音文件还原为初始值
                audioDataRv.buffer = [];
                _this.ifShowUploading = false; //上传中gif
              }
            };

            xhr.send(fd);
          },

          //删除老师录音--单个题目评语或整体作业评语
          removeMarkAudioTip(qNum){
            let _this = this;

            _this.delAudioVisible = true;
            _this.delAudioQuestionNum = qNum; //要删除录音评语的题号
          },

          removeMarkAudioSubmit(){
            let _this = this;
            let qNum =  _this.delAudioQuestionNum;
            if(qNum=='all'){ //删除整体作业的录音评语
              let oldHomeworkRemark = Object.assign({}, _this.homeworkRemark);
              oldHomeworkRemark.markAudio = '';
              _this.homeworkRemark = oldHomeworkRemark;
            }else {
              let oldMarkMap = Object.assign({}, _this.questionMarkMap); //浅克隆
              oldMarkMap['' + qNum].markAudio = '';
              _this.questionMarkMap = oldMarkMap;
            }
            _this.delAudioVisible = false;
          },

          //老师点评单个题目--上传图片
          // ele--file控件的id; qNum--题目几(从1开始),是questionMarkMap中的key; markItem--单个题目的questionMarkMap中
          changeFileFunc(ele,qNum,markItem){
            console.log(markItem);
            let _this = this;

            console.log(this.questionMarkMap);
            console.log(ele,'  upload img')
            _this.ifShowUploading = true; //上传中gif
            let fd = new FormData();
            fd.append("file", document.getElementById(ele).files[0]);
            fd.append("fileType", "HOMEWORK_MARK");

            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/file/upload_file.do');
            xhr.onload = function () {
              console.log(xhr.responseText, "返回img   ");
              let backResponse = JSON.parse(xhr.responseText);

              if(backResponse.code==200 && backResponse.result){

                let oldMarkMap = Object.assign({},_this.questionMarkMap); //浅克隆
                oldMarkMap[''+qNum].markImgList.push(backResponse.result);
                _this.questionMarkMap = oldMarkMap;
                console.log(_this.questionMarkMap,'-----upload图片之后');
              }else{
                console.log('上传失败 img')
              }
              _this.ifShowUploading = false; //上传中gif
            };
            xhr.send(fd);
          },

          //删除老师上传的题目评语中的某个图片
          removeMarkMapImg(qNum,deleteIdx){
            let _this = this;
            let oldMarkMap = Object.assign({},_this.questionMarkMap); //浅克隆
            oldMarkMap[''+qNum].markImgList.splice(deleteIdx,1);
            _this.questionMarkMap = oldMarkMap;
            console.log('删除老师上传的图片之后,',_this.questionMarkMap)
          },


          //提交作业按钮
          submitCorrect(){
            let _this = this;

            let paramMarkMap = _this.questionMarkMap;
            let markMapLen = Object.keys(_this.questionMarkMap);

            for(let i=0;i<markMapLen.length;i++){

              let tmpKey = markMapLen[i];
              let tmpVal = _this.questionMarkMap[tmpKey];
              tmpVal.markText = tmpVal.markText.replace(/\n/g,'<br>');

              let stuScore = _this.questionScoreList[i] || 0;

              if(tmpVal.markScoreMap){
                tmpVal.markScoreMap['1'] = stuScore;
              }
              paramMarkMap[tmpKey] = tmpVal;

            }

            console.log(paramMarkMap,' --- 封装后的参数');
            console.log(_this.questionMarkMap,'  ---元_this.questionMarkMap')

            //将评语中的换行改为br
            let tmpHomeworkRemark = {};
            if(_this.ifTextMark=='文字评语'){
              tmpHomeworkRemark.markText = _this.homeworkRemark.markText.replace(/\n/g,'<br>');
              tmpHomeworkRemark.markAudio = '';
            }else{
              tmpHomeworkRemark.markText = '';
              tmpHomeworkRemark.markAudio = _this.homeworkRemark.markAudio;
            }


            let paramMark = {
              "homeworkRemark":tmpHomeworkRemark,
              "questionMarkMap":paramMarkMap,
              "scoreObj":{
                "objectiveScoreTotal":_this.objectiveScoreTotal,//客观题总分
                "objectiveScoreStudent":_this.objectiveScoreStudent,//客观题学生得分
                "subjectiveScoreTotal":_this.subjectiveScoreTotal,//主观题总分
                "subjectiveScoreStudent":_this.subjectiveScoreStudent//主观题学生得分
              }
            };

            console.log(paramMark);


            _this.request({
              method: 'post',
              url: '/manage/homework/mark_homework_record.do',
              param: {
                "homeworkRecordId": _this.homeworkRecordId,
                "markDataInfo":JSON.stringify(paramMark)
              },
              success: function (result) {
                console.log(result);
                if (result.code == 200) {
                  console.log(result, "提交批改成功");
                  _this.$router.replace('/manageIndex');
                }else{
                  _this.$message.error('提交批改失败了，点击按钮重试。')
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('提交批改失败了，点击重试。')
              }
            });
          },

        }
    }
</script>
<style lang="scss" scoped>
  .correct-container{
    .common-header{
      height: 0!important;
    }
    .common-content{
      margin:4px!important;
      background: transparent!important;
      padding-bottom:60px;
    }

    .hw-header{
      background: #fff;
      padding:16px 24px 8px;
      margin-bottom:8px;

      .header-title{
        border-left:4px solid #F08D00;
        height: 12px;
        line-height: 12px;
        padding-left:6px;
        font-size:16px;
        color:#222;
        font-weight: bold;
        margin-bottom:12px;
      }
      .header-desc{
        font-size:12px;
        color:#606060;
        padding-left:10px;
      }
      .hw-header-score{
        width: 100px;
        .score-title{
          font-size:12px;
          color:#c0c0c0;

        }
        .score-num{
          font-size:40px;
          color:#F08D00;
          line-height:50px;
          span{
            font-size:12px;
            color:#606060;
          }
        }
      }
      .hw-header-detail{
        width: 80px;
        border-left:1px solid #eee;
        padding-left:24px;
        font-size:14px;
      }

    }

    /*批改的题目列表*/
    .hw-correct{
      background: #fff;
      padding:16px 24px;

      .hwc-title{
        margin-bottom:16px;
      }
      .hwc-num-list{
        margin-bottom:24px;
        .hwc-num-item{
          position: relative;
          display:inline-block;
          vertical-align:middle;
          margin-right:12px;


          .hw-corrected{
            position: absolute;
            top:-4px;
            right:-6px;
            font-size:14px;
            color:#fff;
            z-index: 9;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 100%;
            background: #f90;
            text-align: center;

          }
        }
      }

      .hwc-question-list{
        margin-bottom:8px;

        .question-item{

          .q-title{
            font-size:14px;
            color:#222;
            line-height: 22px;
            margin-bottom:12px;
            .q-title-txt{
              margin-bottom:8px;
            }
            img{
              width: 220px;
              margin-bottom:8px;
            }
          }
          .q-blank-list{
            width:600px;
            .blank-title{
              font-size:14px;
              color:#BDBDBD;
              line-height: 20px;
              margin-bottom:4px;
            }
            .blank-item {
              display: flex;
              align-items: center;
              align-content: center;
              margin-bottom: 16px;
              padding: 16px;
              font-size: 14px;
              color:#606060;
              background: #f5f5f5;
              border-radius:4px;
              line-height: 26px;

              .series-box{
                width:16px;
                height: 16px;
                border:1px solid #606060;
                border-radius: 100%;
                text-align: center;
                line-height: 16px;
                display: inline-block;
                font-size:14px;
                color:#606060!important;
              }

              .answer-txt{
                flex:1;
                margin-left:8px;
                border-bottom:1px solid #e0e0e0;
                padding-bottom:8px;
                font-size:14px;
                color:#606060;
                span{
                  padding-left:8px;
                }
              }

            } /* blank-item end*/

            .blank-item-subjective{
              .stu-txt{
                font-size:14px;
                color:#222;
                line-height: 22px;
                margin-bottom:16px;
              }
              .stu-img-list{
                margin-bottom:16px;
                .img-item{
                  width: 92px;
                  height: 92px;
                  display: inline-block;
                  margin-right:8px;
                  position:relative;

                  img{
                    width: 92px;
                    height: 92px;
                  }
                  .img-hover{
                    display: none;
                    position: absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    cursor: pointer;
                    background:rgba(0,0,0,0.48);
                    font-size:16px;
                    color:#fff;
                    font-weight: 400;
                    line-height: 92px;
                    text-align: center;
                    .hover-operate{
                      font-size:14px;
                      color:#fff;
                      text-align: center;
                      line-height: 24px;
                      padding:12px 8px;
                      margin:0 8px;
                      cursor: pointer;
                      display: block;
                    }
                    .hover-operate:first-child{
                      border-bottom:1px solid #fff;
                    }
                  }
                }
                .img-item:hover{
                  .img-hover{
                    display: block;
                  }
                }
              }
              .stu-audio{
                margin-bottom:8px;
              }
              .stu-video{
                margin-bottom:8px;
                width: 480px;
                height: 240px;
                overflow: hidden;
                video{
                  width: 480px;
                  height: 240px;
                  background: #262626;
                }
              }

            }
            /*.blank-item-subjective  end*/
          }
            /*老师评语*/
          .q-comment-box{
            width:600px;
            .blank-title{
              font-size:14px;
              color:#BDBDBD;
              line-height: 20px;
              margin-bottom:14px;
            }
            .blank-item {
              .teacher-score{
                margin-bottom:16px;
                .blank-total{
                  display: inline-block;
                  font-size:14px;
                  color:#606060;
                }
                .set-score{
                  padding-left:12px;
                  display: inline-block;
                  font-size:14px;
                  color:#606060;
                }
              }
              .teacher-txt{
                margin-bottom:16px;
                .el-textarea{

                }
              }
              .teacher-record{
                margin-bottom:16px;

                audio{
                  display: inline-block;
                  vertical-align: middle;
                }

                .audio-close{
                  display: inline-block;
                  vertical-align: middle;
                  font-size: 16px;
                  color: #fff;
                  background: #FF7575;
                  border-radius: 22px;
                  width: 22px;
                  height: 22px;
                  text-align: center;
                  line-height: 22px;
                  margin-left:16px;
                  cursor: pointer;
                }
              }
              .teacher-imgs{
                margin-bottom:16px;

                .img-upload-box{
                  display: inline-block;
                  vertical-align: top;
                  margin-right: 16px;
                  .img-upload-main{
                    cursor: pointer;
                    width: 92px;
                    height: 92px;
                    text-align: center;
                    background:rgba(0,0,0,0.02);
                    border-radius:4px;
                    border:1px dashed rgba(0,0,0,0.15);
                    position:relative;

                    .ziyue-upload-add{
                      padding-top:20px;
                      /*padding-bottom:10px;*/
                      display: inline-block;
                      font-size:24px;
                    }
                    .upload-txt{
                      font-size:14px;
                      font-weight:400;
                      color:rgba(0,0,0,0.65);
                      line-height:22px;
                    }
                    .upload-file{
                      width: 92px;
                      height: 92px;
                      position: absolute;
                      top:0;
                      left:0;
                      opacity: 0;
                      .ipt-file{
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        display: inline-block;
                      }
                    }

                  }
                  .upload-tip{
                    font-size:14px;
                    font-weight:400;
                    color:rgba(0,0,0,0.45);
                    line-height:22px;
                  }
                }
                .img-upload-item{
                  cursor: pointer;
                  display: inline-block;
                  vertical-align: top;
                  margin-right: 16px;
                  width: 92px;
                  height: 92px;
                  position:relative;
                  border-radius:4px;
                  .upload-img{
                    width: 100%;
                    height: 100%;
                    display: block;
                  }
                  .upload-img-hover{
                    display: none;
                    width:100%;
                    height: 100%;
                    line-height: 92px;
                    background:rgba(0,0,0,0.48);
                    font-size:16px;
                    color:#fff;
                    text-align:center;
                    position: absolute;
                    top:0;
                    left:0;

                    .hover-operate{
                      font-size:14px;
                      color:#fff;
                      text-align: center;
                      line-height: 24px;
                      padding:12px 8px;
                      margin:0 8px;
                      cursor: pointer;
                      display: block;
                    }
                    .hover-operate:first-child{
                      border-bottom:1px solid #fff;
                    }

                  }
                  .upload-close{
                    position: absolute;
                    top:-8px;
                    right:-8px;
                    font-size: 16px;
                    color: #fff;
                    background: #FF7575;
                    border-radius: 22px;
                    width: 22px;
                    height: 22px;
                    text-align: center;
                    line-height: 22px;
                  }
                }
                .img-upload-item:hover{

                  .upload-img-hover{
                    display: block;
                  }

                }
              }
            }

          }

        }/* question-item*/

        .total-remark{
          .score-box{
            margin-bottom:24px;
            .score-label{
              font-size:12px;
              color:#c0c0c0;
            }
            .score-detail{
              font-size:14px;
              color:#606060;

              .score-detail-item{
                padding-right:20px;
              }
              .get-total{
                font-size:40px;
                color:#F08D00;
              }
            }

          }
          .total-comment-box{

            .comment-select{
              font-size:14px;
              color:#BDBDBD;
              margin-bottom:40px;
            }
            .txt-comment{
              background: #e0e0e0;
              width:600px;
              border-radius: 4px;
            }
            .audio-comment{
              margin-bottom:8px;
              audio{
                display: inline-block;
                vertical-align: middle;
              }
              .audio-comment-close{
                display: inline-block;
                vertical-align: middle;
                font-size: 16px;
                color: #fff;
                background: #FF7575;
                border-radius: 22px;
                width: 22px;
                height: 22px;
                text-align: center;
                line-height: 22px;
                margin-left: 16px;
                cursor: pointer;
              }
            }
          }
        }
        /*.total-remark end*/

      }

    }
    .correct-footer{
      position: fixed;
      bottom:0;
      left:241px;
      right:0;
      height:40px;
      background:rgba(255,255,255,1);
      box-shadow:-2px -1px 8px 0px rgba(0,0,0,0.16);
      border-radius:2px;
      padding:12px 24px;
      text-align: right;
    }
  }

  .dialog-body{
    text-align: center;

    .iconfont{
      font-size:50px;
      color: #F08D00;
    }
  }
  .dialog-footer{
    display: block;
    text-align: center;
    .iconfont{
      padding-right:10px;
    }
  }

  .correct-objective-dialog{

    .question-list{
      /*min-width:600px;*/
      max-height:520px;
      overflow:auto;
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

  .dialog-img{
    img{
      margin:0 auto;
      display:block;
      max-width:100%;
      max-height: 560px;
      overflow: auto;
    }
  }

  /*上传gif*/
  .uploading-box{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:101;

  .uploading-bg{
    background:rgba(0,0,0,0.32);
    width: 100%;
    height: 100%;
  }
  .uploading-main{
    position: absolute;
    top:40%;
    left:50%;
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
  .audio-del-icon{
    color: #FAAD14;
    padding-right: 8px;
    font-size: 20px;
    display: inline-block;
    vertical-align: middle;
  }
</style>
<style>
  /*textarea{*/
    /*resize:none!important;*/
    /*border:1px solid #e0e0e0!important;*/
  /*}*/
  .correct-objective-dialog .el-dialog__body{
    padding:0 20px!important;
  }
</style>
