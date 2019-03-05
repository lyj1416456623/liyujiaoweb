<template>
  <!-- 学生做作业---多选题  -->
  <div class="single-choice">
    <div class="single-title">
      <template v-for="item in multipleData.title">
        <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue" >
        <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
      </template>
    </div>
    <div class="qusition-option" v-for="(val,key,i) in multipleData.optionMap" :class="checkedValue.indexOf(key)!=-1?'single-active':''">
      <label :for="'multiple'+key+i" class="question-block">
        <div class="option">{{key}}</div>
        <div class="option-content">
          <template v-for="answer in val">
            <p v-if="answer.itemType=='TEXT'" v-html="answer.itemValue"></p>
            <img :src="answer.itemValue" alt="" v-if="answer.itemType=='IMG'">
          </template>
        </div>
      </label>
      <input type="checkbox" name="multiple" :id="'multiple'+key+i" :value="key" v-model="checkedValue" />
    </div>
  </div>
</template>

<script>
  import XmAudio from "@/components/AudioComponent"
  export default {
    props: ['multipleData','answer'],
    name: "MultipleChoice",
    components:{XmAudio},
    data() {
      return {
        checkedValue:[],
      }
    },
    mounted(){
      if(this.answer){
        this.checkedValue = JSON.parse(JSON.stringify(this.answer));
      }
    },
    watch:{
      checkedValue(val){
        console.log(this.checkedValue,"选中的值");
        if(this.checkedValue != this.multipleData.studentAnswer){
          this.$emit("multiple-choice",this.checkedValue);
        }
      }
    },
    methods:{

    }
  }
</script>

<style scoped lang="scss">
  .single-choice {
    padding-bottom:20px;
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
