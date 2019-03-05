<template>
  <!--学生做作业  连线题-->
  <div class="single-choice">
    <div class="single-title">
      <template v-for="item in connectionData.title">
        <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue" >
        <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
      </template>
    </div>
    <div class="qusition-option">
      <template  v-for="(val,key) in connectionData.leftDataList">
          <div class="question-block">
            <div class="option-content">
              <p>{{val}}</p>
            </div>
            <!--:class="studentAnswer[key]&&studentAnswer[key]!==''?'option-checked':''"-->
            <div class="option question-option" :id="'question-block'+key" @click="checkedQuestion(key)" >{{studentAnswer[key]||''}} </div>
          </div>
      </template>
    </div>
    <div class="qusition-option answer-option">
      <template v-for="(val,key) in connectionData.rightDataList">
        <div class="question-block" :id="'answer-block'+key" @click="checkedAnswer(val,key)">
          <div class="option"> {{key+1}} </div>
          <div class="option-content">
            <p>{{val}}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import XmAudio from "@/components/AudioComponent"
  import $ from 'jquery'
  export default {
    props: ['connectionData','answer'],
    name: "ConnectionComponent",
    components:{XmAudio},
    data() {
      return {
        checkedValue:'',
        studentAnswer:{}
      }
    },
    mounted(){
      console.log(this.answer,'    连线题组件mounted中answer');
      if(this.answer && this.answer.length>0){
        for(let i=0;i<this.answer.length;i++){
          this.studentAnswer[i+'']= this.answer[i];
        }
        this.studentAnswer = JSON.parse(JSON.stringify(this.studentAnswer));

        this.showAnswerBg();
      }else{
        $("#question-block0").addClass("question-block-active");
      }
    },
    methods:{
      //选择左边的题
      checkedQuestion(index){
        console.log(index);
        if(this.studentAnswer[index]){
          $("#answer-block"+(this.studentAnswer[index]-1)).removeClass("question-block-active").removeClass("question-block-disabled");
          this.studentAnswer[index] = '';
          delete this.studentAnswer[index];
          $("#question-block"+index).removeClass("option-checked");
          this.showAnswerBg();
        }
        for(var i = 0 ;i<this.connectionData.leftDataList.length;i++){
          $("#question-block"+i).removeClass("question-block-active");
        }
        $("#question-block"+index).addClass("question-block-active");
      },
      //选择右边的答案
      checkedAnswer(data,index){
        if($("#answer-block"+index).hasClass("question-block-disabled")&&!$("#answer-block"+index).hasClass("question-block-active")){
          return false;
        }
        console.log(index,"dDdd");
        if(this.studentAnswer[index]) {
          $("#answer-block"+index).removeClass("question-block-active");
        }
        for(var i = 0 ;i<this.connectionData.leftDataList.length;i++) {
          $("#answer-block"+i).removeClass("question-block-active");
        }
        for(var i = 0 ;i<this.connectionData.leftDataList.length;i++){
          if($("#question-block"+i).hasClass("question-block-active")){
            console.log(index,"index");
            this.studentAnswer[i]= index+1;
            this.studentAnswer = JSON.parse(JSON.stringify(this.studentAnswer));
            $("#question-block"+i).removeClass("question-block-active");
            if(!this.studentAnswer[i+1]){
              $("#question-block"+(i+1)).addClass("question-block-active");
            }
            this.showAnswerBg();
            return false;
          }
        }
      },
      showAnswerBg(){
        console.log(this.studentAnswer,"studentAnswer");
        var studentAnswer = [];
        for(var i = 0 ;i<this.connectionData.leftDataList.length;i++){
          $("#answer-block"+i).removeClass("question-block-disabled");
        }
        for(var key in this.studentAnswer){
          console.log(this.studentAnswer[key],key,"keyddd");
          $("#answer-block"+(this.studentAnswer[key]-1)).addClass("question-block-disabled");
          $("#question-block"+key).addClass("option-checked");
          console.log(key,"this.studentAnswer");
          studentAnswer.push(this.studentAnswer[key]);
        }
        console.log(studentAnswer,"studrle");
        this.$emit("connect-check",studentAnswer);
      }
    }
  }
</script>

<style scoped lang="scss">
  .single-choice {
    padding-bottom:20px;
    .single-title{
      margin-bottom:16px;
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
      margin-bottom:8px;
      .question-block{
        display:flex;
        min-height:42px;
        padding:8px;
        padding-left:0;
        border-radius:8px;
        box-sizing: border-box;
        align-content: center;
        align-items: center;
        margin-bottom:8px;
        .option-content{
          font-size:18px;
          line-height:26px;
          display:block;
          flex:1;
        }
        .option{
          width:56px;
          height:40px;
          border-radius:12px;
          text-align: center;
          line-height: 40px;
          margin-left:12px;
          color:#fff;
          background:#f5f5f5;
        }
        .option-checked{
          background:#46A3FA;
        }
      }
      .question-block-active {
        background: #FFFFFF!important;
        border: 1px solid #6CB3F5;
      }
    }
    .answer-option{
      margin-top:24px;
      .question-block{
        min-height:80px;
        border:1px solid #BDBDBD;
        background:#fff;
        border-radius:12px;
        margin-bottom:12px;
        padding:8px;
        .option-content{
          border:0;
        }
        .option{
          border:0;
          padding:0;
          color:#000;
          width:36px;
          margin-left:5px;
          margin-right:15px;
          background:none;
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
  }
</style>
