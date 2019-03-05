<template>
    <!--<div>学生微信端做作业之填空题</div>-->
    <div class="fill-blank">
      <div class="title">
        <template v-for="item in fillData.title">
          <p v-if="item.itemType=='TEXT'" v-html="item.itemValue"></p>
          <img v-if="item.itemType == 'IMG'" :src="item.itemValue" >
          <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
        </template>
      </div>
      <div class="blank-list">

        <div class="blank-item ziyue-flex" v-for="(option,idx) in fillData.answerList" :key="idx"
             :class="{'blank-active':curFill==idx}"
             @click="fillItemClick(idx)">
          <span class="series-box">{{idx+1}}</span>
          <div class="ziyue-flex-item" style="padding-left:20px;">
            <input class="blank-item-ipt " type="text" v-model="fillAnswer[idx]" @blur="resetWindow">
          </div>
        </div>

        <!--<div class="blank-item blank-active">-->
          <!--<span class="series-box">1</span> <input type="text">-->
        <!--</div>-->

      </div>
    </div>

</template>

<script>
    import XmAudio from "@/components/AudioComponent"
    export default{
      name: 'FillBlankComponent',
      props: ["fillData","answer"],
      components:{XmAudio},
      data(){
        return {
          fillAnswer:[], //填空题的最终传给父组件的答案
          curFill:0, //当前在填哪一个空
        }
      },
      mounted(){
        if(this.answer && this.answer.length>0){
          this.fillAnswer = JSON.parse(JSON.stringify(this.answer));
        }else {
          for (let i = 0; i < this.fillData.answerList.length; i++) {
            this.fillAnswer.push('');
          }
        }
        console.log(this.fillAnswer,'   fillAnswer mounted');
      },
      watch: {

        fillAnswer:{
          handler(val,old){
            console.log(val,'  tmpNewFill');
            console.log(old,'  old');
            let tmpNewFill = JSON.parse(JSON.stringify(val));
            this.$emit("fill-check", tmpNewFill);

          },
//          immediate: true, // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法,这里不需要
          deep:true
        },

      },
      methods: {
        fillItemClick(idx){
          this.curFill = idx;
        },
        resetWindow() {
          window.scroll(0, 0);
        },
      }
    }

</script>
<style lang="scss" scoped>
  .fill-blank{
    .title{
        margin-bottom: 20px;
        p{
          font-size:18px;
          color:#666;
          line-height: 26px;
          margin-bottom: 8px;
        }
        img{
          width:100%;
          margin-bottom: 8px;
        }
    }
    .blank-list{

      .blank-item{
        border:1px solid #E0E0E0;
        -webkit-border-radius:8px;
        -moz-border-radius:8px;
        border-radius:8px;
        margin-bottom:16px;
        padding:8px 16px;
        font-size:24px;
        line-height: 26px;

        .series-box{
          width:24px;
          height: 24px;
          border:1px solid #606060;
          border-radius: 100%;
          text-align: center;
          line-height: 24px;
          display: inline-block;
          font-size:16px;
          color:#606060!important;
        }
        .blank-item-ipt{
          width:100%;
        }

      }
      .blank-active{
        border:1px solid #46A3FA;
        color:#46A3FA;

        .series-box{
          border:1px solid #46A3FA;
          color:#46A3FA!important;
        }
      }

    }

    input{
      outline: none!important;
      border:none!important;
    }
  }
</style>
