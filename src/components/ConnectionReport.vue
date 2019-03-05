<template>
    <!--<div>连线题报告页面模板</div>-->
  <div class="connection-template">
    <div class="question-score"><span>+{{score}}分</span></div>
    <div class="single-title">
      <template v-for="item in questionData.title">
        <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue" >
        <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
      </template>
    </div>
    <div class="qusition-option">
      <template  v-for="(val,key) in questionData.leftDataList">
        <div class="question-block" :id="'question-block'+key">
          <div class="option-content">
            <p>{{val}}</p>
          </div>
          <div class="option" :class="{'option-wrong':recordData[key]!=questionData.answerList[key]}"> {{recordData[key]||''}} </div>
        </div>
      </template>
    </div>
    <div class="qusition-option answer-option">
      <template v-for="(val,key) in questionData.rightDataList">
        <div class="question-block" :id="'answer-block'+key">
          <div class="option"> {{key+1}} </div>
          <div class="option-content">
            <p>{{val}}</p>
          </div>
        </div>
      </template>
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
      name: 'ConnectionReport',
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
      components: {XmAudio},
      data(){
        return {}
      },
      mounted(){
        console.log(this.recordData)
      },
      watch: {},
      methods: {}
    }
</script>
<style scoped lang="scss">
  .connection-template {
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
    border-radius:12px;
    font-size:24px;
    color:#222222;
    margin-bottom:16px;
  .question-block{
    display:flex;
    min-height:42px;
    background:#F2F2F2;
    padding:8px;
    margin-bottom:8px;
    border-radius:8px;
    box-sizing: border-box;
    align-content: center;
    align-items: center;
  .option-content{
    font-size:18px;
    line-height:26px;
    display:block;
    flex:1;
    border-right:1px solid #E0E0E0;
  }
  .option{
    width:32px;
    height:32px;
    padding-left:12px;
    text-align: center;
    line-height: 32px;
    color:#46A3FA;
  }
  .option-wrong{
    color:#FF6666!important;
  }

  }
  .question-block-active {
    background: #FFFFFF;
    border: 1px solid #6CB3F5;
  }
  }
  .answer-option{
    margin-top:32px;
  .question-block{
    min-height:80px;
    border:1px solid #BDBDBD;
    background:#fff;
    border-radius:12px;
  .option-content{
    border:0;
  }
  .option{
    border:0;
    padding:0;
    color:#000;
    margin-left:5px;
    margin-right:15px;
  }
  }
  .question-block-disabled{
    border:1px solid #BDBDBD;
    background:#F2F2F2;
  }
  .question-block-active{
    background:#FFFFFF;
    border:1px solid #6CB3F5;
  .option{
    background:#6cb3f5;
    color:#fff;
    border-radius:12px;
  }
  }
  }
  .single-active{
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
