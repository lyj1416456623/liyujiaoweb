<template>
  <!--<div>填空题报告模板</div>-->
  <div class="fill-blank">
    <div class="title">
      <template v-for="(tItem,idx) in questionData.title" >
        <p v-if="tItem.itemType=='TEXT'" v-html="tItem.itemValue"></p>
        <img :src="tItem.itemValue" alt="" v-if="tItem.itemType=='IMG'">
      </template>
    </div>
    <div class="blank-list">
      <p class="blank-title">学生答案：</p>
      <div class="blank-item " v-for="(answer,aIdx) in studentAnswerData" :key="'ans'+aIdx" :class="[{'blank-item-right':answer.ifCorrect},{'blank-item-wrong':!answer.ifCorrect}]">
        <span class="series-box">{{aIdx+1}}</span> <div class="answer-txt">{{answer.answer}}<span>+{{answer.score}}</span></div>
      </div>
    </div>
    <div class="explain">
      <p class="explain-answer">正确答案是：<template v-for="(answerItem,aIdx) in questionData.answerList"><span class="series-box">{{aIdx+1}}</span><span class="answer-span">{{answerItem}}</span></template></p>
      <div class="explain-detail">
        <template v-for="explainItem in questionData.explainList">
          <p v-if="explainItem.itemType=='TEXT'" v-html="explainItem.itemValue"></p>
          <img :src="explainItem.itemValue" alt="" v-if="explainItem.itemType=='IMG'">
        </template>
      </div>
    </div>

    <!--老师评语-->
    <!--<div class="comment">-->
      <!--<p class="comment-title">老师评语：</p>-->
      <!--<p class="comment-txt">这里就是老师评语的内容，demo</p>-->
      <!--<div class="comment-audio">-->
        <!--<custom-audio :audioSrc="audioComment"></custom-audio>-->
        <!--<audio :src="audioComment" controls="controls"></audio>-->
        <!--<div class="ziyue-audio-custom-play">-->
        <!--<div class="audio-custom-bg" @touch.end="playComment(audioComment)"><i class="iconfont icon-right_m"></i> <span>56"</span></div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

  </div>
</template>

<script>
  import CustomAudio from '@/components/CustomAudioComponent'
  export default{
    name: 'FillBlank',
    props:{
      questionData:{
        type:Object,
        required: true
      },
      recordData:{
        type:Array,
        required: true
      }
    },
    components: {CustomAudio},
    data(){
      return {
        studentAnswerData:[
          {
            answer:'学生的答案',
            ifCorrect:true, //答对 还是 答错
            score:0, //学生这个选项的得分
          }
        ], //重新封装下学生的答案

        audioStatus:'pause', //默认老师评语不播放; pause--停止播放状态;play--播放中
        audioComment:'https://onlinetest-public.oss-cn-beijing.aliyuncs.com/public/audio/welcome.mp3',

      }
    },
    mounted(){
      console.log('fill answer mounted',this.recordData)
      this.studentAnswerData = [];

      if(this.recordData.length==this.questionData.answerList.length) {

        for (let i = 0; i < this.recordData.length; i++) {
          let tmpTxt = this.recordData[i];
          let tmpCorrect = false;
          let tmpScore = 0;
          if (!this.questionData.ifAnswerWithOrder) { //无序填空题,判断正确答案是否包含 学生填的内容
            if (this.questionData.answerList.indexOf(tmpTxt) > -1) {//答对了
              tmpCorrect = true;
              tmpScore = this.questionData.scoreMap['' + (i + 1)];
            }
          } else { //有序填空题,匹配每一个内容是否一致
            if (this.questionData.answerList[i] == tmpTxt) {//答对了
              tmpCorrect = true;
              tmpScore = this.questionData.scoreMap['' + (i + 1)];
            }
          }

          let tmpData = {
            answer: tmpTxt,
            ifCorrect: tmpCorrect, //答对 还是 答错
            score: tmpScore, //学生这个选项的得分
          };
          console.log(tmpData);
          this.studentAnswerData.push(tmpData);
        }
        console.log(this.studentAnswerData,'   =======end');
      }


    },
    watch: {},
    methods: {
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
    }
  }
</script>
<style lang="scss" scoped>

  .fill-blank {
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
      color: #222;
      line-height: 26px;
      margin-bottom: 16px;
      margin-top:8px;
    }

    .blank-list {

      .blank-title{
        font-size:16px;
        color:#bdbdbd;
        line-height:22px;
      }

      .blank-item {
        display: flex;
        align-items: baseline;
        align-content: center;
        margin-bottom: 16px;
        padding: 8px 0;
        font-size: 24px;
        line-height: 26px;


        .answer-txt{
          width:283px;
          margin-left:8px;
          border-bottom:1px solid #e0e0e0;
          padding-bottom:12px;
          font-size:16px;
          color:#606060;
          span{
            padding-left:8px;
          }
        }

      }

      .blank-item-right {
        .answer-txt{
          color: #46A3FA;
        }
      }
      .blank-item-wrong {
        .answer-txt{
          color: #FF6666;
        }
      }

    }
    /*blank-list end*/
    /*解析*/
    .explain{
      font-size:16px;
      color:#606060;
      line-height: 24px;
      padding:16px;
      background:#fafafa;
      border-radius: 8px;
      width:600px;
      box-sizing: border-box;
      .explain-answer{
        margin-bottom:8px;
        .answer-span{
          color:#46A3FA;
          padding:0 4px;
        }
      }
    }

    /*老师评语*/
    .comment{
      font-size:16px;
      color:#606060;
      line-height: 24px;
      padding:16px;
      background:#fafafa;
      border-radius: 8px;
      width:600px;
      box-sizing: border-box;
      .comment-title{
        margin-bottom: 8px;
      }
      .comment-txt{margin-bottom: 16px;}
      .comment-audio{margin-bottom: 16px;}
    }

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

  }
</style>
