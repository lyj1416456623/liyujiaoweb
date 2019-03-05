<template>
    <!--<div>简答题的报告模板</div>-->
  <div class="subjective-report">
    <template v-if="ifMarked==false || ifMarked =='false'">
      <div class="ziyue-flex correct-status">
        <div class="pigai-img">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/correcting.png" alt="">
        </div>
        <div class="ziyue-flex-item">
          <h4>批改中…</h4>
          <p>老师还在批改呢，稍后再来看看吧！</p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="question-score"><span v-show="score && score>0">+{{score}}分</span></div>
    </template>
    <div class="title">
      <template v-for="(tItem,idx) in questionData.title" >
        <p v-if="tItem.itemType=='TEXT'" v-html="tItem.itemValue"></p>
        <img :src="tItem.itemValue" alt="" v-if="tItem.itemType=='IMG'">
        <xm-audio v-if="tItem.itemType == 'AUDIO'" :audioSrc="tItem.itemValue"></xm-audio>
      </template>
    </div>
    <div class="student-answer-box">
      <p class="blank-title">你的答案：</p>
      <template v-for="(record,idx) in recordData">
        <p class="blank-answer-txt" v-if="record.itemType=='TEXT'" v-html="record.itemValue"></p>
        <div class="blank-answer-audio" v-if="record.itemType=='AUDIO'">
          <audio-phone :audioSrc="record.itemValue" :ifArrow='false'></audio-phone>
        </div>
      </template>
      <div class="blank-answer-img-box">
        <template  v-for="(imgVideo,idx) in recordData">
          <img  v-if="imgVideo.itemType=='IMG'" class="blank-answer-img"
                :src="imgVideo.itemValue" alt="" @click="previewImgWx(imgVideo.itemValue)">
        </template>
      </div>
      <div class="blank-answer-video-box">
        <template  v-for="(imgVideo,idx) in recordData">
          <video v-if="imgVideo.itemType=='VIDEO'" class="blank-answer-video"
                 poster="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/poster-video.png"
               :src="imgVideo.itemValue" playsinline="" webkit-playsinline="" x5-playsinline="allow"
               controls="controls"></video>
        </template>
      </div>

    </div>

    <!--老师评语-->
    <div class="comment" v-show="ifMarked">
      <p class="comment-title">老师点评：</p>
      <p class="comment-txt" v-if="commentData && commentData.markText" v-html="commentData.markText"></p>
      <div class="comment-audio" v-if="commentData && commentData.markAudio">
        <audio-phone :audioSrc="commentData.markAudio" :ifArrow='false'></audio-phone>
      </div>
      <div class="comment-img" v-if="commentData && commentData.markImgList">
        <template v-for="img in commentData.markImgList">
          <img :src="img" alt="" @click="previewImgWx(img)">
        </template>

      </div>
    </div>

    <!--解析-->
    <div class="explain" v-show="questionData.explainList && questionData.explainList.length>0">
      <p class="explain-answer">解析：</p>
      <div class="explain-detail">
        <template v-for="explainItem in questionData.explainList">
          <p v-if="explainItem.itemType=='TEXT'" v-html="explainItem.itemValue"></p>
          <img :src="explainItem.itemValue" alt="" v-if="explainItem.itemType=='IMG'">
          <xm-audio v-if="explainItem.itemType == 'AUDIO'" :audioSrc="explainItem.itemValue"></xm-audio>
        </template>
      </div>
    </div>


  </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    import AudioPhone from "@/components/AudioPhoneComponent" //学生答案、老师评语的音频
    import XmAudio from "@/components/AudioComponent"  //题目、解析中的音频
    export default{
        name: 'SubjectiveReport',
        props:{
          questionData:{
            type:Object,
            required: true
          },
          recordData:{
            type:Array,
            required: true
          },
          ifMarked:{
            type: Boolean,
            required: true
          },
          score:{
            required: true
          }, //学生本题的得分
          commentData:{
            type:Object,
            required: true
          } //老师的评语
//            commentData:{
//              markAudio: ""
//              markImgList: []
//              markScoreMap: {1: 0}
//              markText: "3333333"
//            }

        },
//        props: ["ifMarked","questionData","recordData"],
        components: {AudioPhone,XmAudio},
        data(){
            return {
              audioStatus:'pause', //默认老师评语不播放; pause--停止播放状态;play--播放中
              audioComment:'',//https://onlinetest-public.oss-cn-beijing.aliyuncs.com/public/audio/welcome.mp3',
            }
        },
        mounted(){
          console.log(this.questionData,' 简答题--questionData----subjective')
          console.log(this.recordData,' recordData------subjective')
          console.log(this.commentData,' commentData----subjective')
          if(this.commentData && this.commentData.markAudio){
            this.audioComment = this.commentData.markAudio;
            console.log(this.audioComment,"this.audioCommentthis.audioComment");
          }
        },
        watch: {},
        methods: {
          //播放音频
          playComment(url){
            console.log(url);
            let _this = this;
            let Media = new Audio(url);
            if(_this.audioStatus=='pause'){
              Media.play();
              _this.audioStatus = 'play';
            }else{
              Media.stop();
              _this.audioStatus = 'pause'
            }

          },

          //微信预览图片
          previewImgWx(url){
            wx.previewImage({
              current: url, // 当前显示图片的http链接
              urls: [url] // 需要预览的图片http链接列表
            });
          },
        }
    }
</script>
<style lang="scss" scoped>

  .subjective-report {
    padding-bottom: 20px;

  .correct-status {
    padding: 0 0 14px;
    border-bottom: 1px solid #eee;

  .pigai-img {
    width: 35px;
    height: 35px;
    margin-left: 12px;
    img{
      width: 100%;
    }
  }

  .ziyue-flex-item {
    padding-left: 24px;

  h4 {
    font-weight: normal;
    font-size: 16px;
  }

  p {
    font-size: 12px;
    color: #BDBDBD;
  }

  }
  }
  .question-score {

  span {
    min-width: 48px;
    display: inline-block;
    font-size: 12px;
    color: #46A3FA;
    text-align: center;
    line-height: 12px;
    padding: 4px 0;
    background: #E7F3FD;
    border-radius: 24px;
  }

  }
  .title {
    font-size: 18px;
    color: #666;
    line-height: 26px;
    margin-bottom: 32px;
    margin-top: 8px;

  p{
    margin-bottom: 8px;
  }
  img{
    width:100%;
  }
  }

  .student-answer-box {

  .blank-title {
    font-size: 16px;
    color: #bdbdbd;
  }
  .blank-answer-txt{
    font-size:16px;
    color:#222;
    line-height: 24px;
    margin-bottom:16px;
  }
  .blank-answer-audio,.blank-answer-img-box,.blank-answer-video-box{
    margin-bottom:16px;
  }
  .blank-answer-img-box{
    margin-bottom:16px;
  }

  .blank-answer-img{
    width: 92px;
    height: 92px;
    display: inline-block;
    margin-right: 8px;
  }
  .blank-answer-video{
    width: 100%;
    height: 200px;
    background: #222;
  }

  }
  /*blank-student-answer-box end*/
  /*解析*/
  .explain {
    font-size: 16px;
    color: #606060;
    line-height: 24px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    margin-bottom: 24px;

  .explain-answer {
    margin-bottom: 8px;

  .answer-span {
    color: #46A3FA;
    padding: 0 4px;
  }

  }
  .explain-detail {

  p {
    margin-bottom: 8px;
  }
  img {
    width: 100%;
  }

  }
  }

  /*老师评语*/
  .comment {
    font-size: 16px;
    color: #606060;
    line-height: 24px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    margin-bottom: 24px;

  .comment-title {
    margin-bottom: 8px;
  }

  .comment-txt {
    margin-bottom: 16px;
  }

  .comment-audio {
    margin-bottom: 16px;
  }
  .comment-img{
    width: 100%;
    margin-bottom: 16px;
    img{
      width: 92px;
      height: 92px;
      margin-right:8px;
    }

  }

  }

  .series-box {
    width: 16px;
    height: 16px;
    border: 1px solid #606060;
    border-radius: 100%;
    text-align: center;
    line-height: 16px;
    display: inline-block;
    font-size: 14px;
    color: #606060 !important;
  }

  }
</style>
