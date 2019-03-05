<template>
    <!--<div>多选题报告页面</div>-->
  <div class="multiple-choice">
    <div class="question-score"><span>+{{score}}分</span></div>
    <div class="single-title">
      <template v-for="item in questionData.title">
        <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue" >
        <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
      </template>
    </div>
    <div class="qusition-option " v-for="(val,key,i) in questionData.optionMap"
         :class="[{'option-right':(questionData.answerList.indexOf(key)!=-1 && recordData.indexOf(key)!=-1)},{'option-wrong':(questionData.answerList.indexOf(key)==-1 && recordData.indexOf(key)!=-1)}]">

      <label class="question-block">
        <div class="option">{{key}}</div>
        <div class="option-content">
          <template v-for="answer in val">
            <p v-if="answer.itemType=='TEXT'" v-html="answer.itemValue"></p>
            <img :src="answer.itemValue" alt="" v-if="answer.itemType=='IMG'">
          </template>
        </div>
      </label>
    </div>

    <div class="explain">
      <p class="explain-answer">正确答案是：<template v-for="(answerItem,aIdx) in questionData.answerList"><span class="answer-span">{{answerItem}}</span></template></p>
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
    import XmAudio from "@/components/AudioComponent"
    export default{
      name: 'MultiReport',
      props: {
        questionData: {
          type: Object,
          required: true
        },
        recordData: { //学生的答案
          type: Array,
          required: true
        },
        ifMarked: {
          type: Boolean,
          required: true
        }, score: {
          required: true
        }, //学生本题的得分
      },
      components:{XmAudio},
      data(){
        return {}
      },
      mounted(){
      },
      watch: {},
      methods: {}
    }
</script>
<style scoped lang="scss">
  .multiple-choice {
    padding-bottom:20px;

  .question-score {
    margin-bottom:8px;
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


  .single-title{
    margin-bottom:32px;
  h2 {
    font-size: 18px;
    font-weight: 400;
    color: #222222;
    line-height: 26px;
  }
  img{
    width:100%;
    margin-top:8px;
  }
  }
  .qusition-option{
    width:100%;
    border:1px solid #E0E0E0;
    border-radius:12px;
    font-size:24px;
    color:#222222;
    margin-bottom:16px;
  .question-block{
    display:flex;
    min-height:80px;
    padding:14px 20px;
    box-sizing: border-box;
    align-content: center;
    align-items: center;
  .option{
    width:32px;
    height:32px;
    text-align: center;
    background:#fff;
    line-height: 32px;
  }

  .option-content{
    margin-left:20px;
    font-size:18px;
    line-height:26px;
    display:block;
    flex:1;
  img{
    height:120px;
  }
  }
  }
  input{
    opacity: 0;
    display:block;
    height:0;
  }
  }
  .option-right{
    border:1px solid #46a3fa;
    .option{
      width:32px;
      height:32px;
      text-align: center;
      background: #46a3fa !important;
      line-height: 32px;
      color:#fff;
      border-radius:12px;
      box-shadow: 0 2px 4px rgba(0,120,199,.24);
    }
  }
  .option-wrong{
    border:1px solid #FF6666;
    .option{
      width:32px;
      height:32px;
      text-align: center;
      background: #FF6666 !important;
      line-height: 32px;
      color:#fff;
      border-radius:12px;
      box-shadow: 0 2px 4px rgba(255,102,102,.24);
    }
  }
  .qusition-option:last-child{
    margin-bottom:0;
  }


  /*解析*/
  .explain{
    font-size:16px;
    color:#606060;
    line-height: 24px;
    padding:16px;
    background:#fafafa;
    border-radius: 8px;
    margin-bottom: 24px;
  .explain-answer{
    margin-bottom:8px;

  .answer-span{
    color:#46A3FA;
    padding:0 4px;
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


  }
</style>
