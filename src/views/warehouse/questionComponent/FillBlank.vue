<template>
  <div class="detail-choice">
    <div class="total-score">+{{questionData.totalScore}}分</div>
    <h5>{{idx+1+((page-1)*10)}}、
      <template v-for="item in questionData.title">
        <span v-if="item.itemType=='TEXT'" v-html="item.itemValue"></span>
      </template>
    </h5>
    <div class="icon-block">
      <i class="iconfont icon-tupian" :class="imageFlag?'active':''"></i>
      <i class="iconfont icon-yinpin" :class="audioFlag?'active':''"></i>
    </div>
    <div class="blank-block">
      <div class="blank-item" v-for="(option,opidx) in questionData.answerList">
        <span class="series-box">{{opidx+1}}、</span>
        <div class="answer-txt" v-html="option"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Connection",
    components: {XpAudio},
    props:['questionData','idx','page'],
    data() {
      return {
        imageFlag:false,
        audioFlag:false
      }
    },
    mounted(){
      for(var i = 0;i<this.questionData.title.length;i++){
        if(this.questionData.title[i].itemType=='IMG'){
          this.imageFlag = true;
        }else if(this.questionData.title[i].itemType=='AUDIO'){
          this.audioFlag = true;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .detail-choice {
    position: relative;
    .total-score {
      font-size: 14px;
      color: #F08D00;
      line-height: 20px;
      position: absolute;
      top: 0px;
      right: 0px;
    }
    h5 {
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      line-height: 24px;
      width:920px;
    }
    .icon-block{
      i{
        font-size:24px;
        vertical-align: middle;
        margin-left:8px;
        color:#E0E0E0;
      }
      .active{
        color:#F08D00;
      }
    }
    .blank-block{
      .blank-item{
        margin-top:16px;
        font-size:14px;
        color:#606060;
        line-height:22px;
        .answer-txt{
          display:inline-block;
          width:240px;
          padding-bottom:3px;
          border-bottom:1px solid #E0E0E0;
        }
      }
    }

  }
</style>
