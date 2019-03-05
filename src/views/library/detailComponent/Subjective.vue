<template>
  <div class="detail-choice">
    <div class="total-score">+{{questionData.totalScore}}分</div>
    <template v-for="item in questionData.title">
      <h5 v-if="item.itemType=='TEXT'">{{idx+1}}、<span v-html="item.itemValue"></span></h5>
      <img v-if="item.itemType=='IMG'" :src="item.itemValue" alt="">
      <div class="audio-item" v-if="item.itemType=='AUDIO'">
        <xp-audio :audioSrc="item.itemValue"></xp-audio>
      </div>
    </template>
    <div class="subjective-block">
      <span>答题方式：</span>
      <div class="subjective-type">
        <i class="iconfont icon-wenzi" :class="textFlag?'active':''"></i>
        <i class="iconfont icon-tupian" :class="imgFlag?'active':''"></i>
        <i class="iconfont icon-luyin" :class="audioFlag?'active':''"></i>
        <i class="iconfont icon-shipin" :class="videoFlag?'active':''"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Subjective",
    components:{XpAudio},
    props:['questionData','idx'],
    data(){
      return{
        textFlag:false,
        imgFlag:false,
        audioFlag:false,
        videoFlag:false
      }
    },
    mounted(){
      for(var i=0;i<this.questionData.answerWay.length;i++){
        if(this.questionData.answerWay[i]=='TEXT'){
          this.textFlag = true;
        }else if(this.questionData.answerWay[i]=='IMG'){
          this.imgFlag = true;
        }else if(this.questionData.answerWay[i]=='AUDIO'){
          this.audioFlag = true;
        }else if(this.questionData.answerWay[i]=='VIDEO'){
          this.videoFlag = true;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .detail-choice {
    position:relative;
    .total-score{
      font-size:14px;
      color:#F08D00;
      line-height:20px;
      position:absolute;
      top:0px;
      right:0px;
    }
    h5 {
      font-size:16px;
      font-weight:500;
      color:#222222;
      line-height:24px;
      width:920px;
    }
    img{
      height:104px;
      margin-top:8px;
      display:block;
    }
    .audio-item{
      margin-top:8px;
      width:372px;
      border:1px solid #e0e0e0;
      border-radius:8px;
    }
    .subjective-block{
      margin-top:24px;
      .subjective-type{
        display:inline-block;
        vertical-align: middle;
        i{
          font-size:24px;
          color:#eee;
          margin-right:8px;
        }
        .active{
          color:#F08D00;
        }
      }
    }
  }
</style>
