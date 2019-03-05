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
    <div class="subjective-block">
      <span>答题方式：</span>
      <div class="subjective-type">
        <i class="iconfont icon-wenzi" :class="answerText?'active':''"></i>
        <i class="iconfont icon-tupian" :class="answerImg?'active':''"></i>
        <i class="iconfont icon-luyin" :class="answerAudio?'active':''"></i>
        <i class="iconfont icon-shipin" :class="answerVideo?'active':''"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"

  export default {
    name: "Subjective",
    components: {XpAudio},
    props: ['questionData', 'idx','page'],
    data() {
      return {
        imageFlag: false,
        audioFlag: false,
        answerText: false,
        answerImg: false,
        answerAudio: false,
        answerVideo: false
      }
    },
    created() {
      for (var i = 0; i < this.questionData.title.length; i++) {
        if (this.questionData.title[i].itemType == 'IMG') {
          this.imageFlag = true;
        } else if (this.questionData.title[i].itemType == 'AUDIO') {
          this.audioFlag = true;
        }
      }
      for (var j = 0; j < this.questionData.answerWay.length; j++) {
        if (this.questionData.answerWay[j] == 'TEXT') {
          this.answerText = true;
        } else if (this.questionData.answerWay[j] == 'IMG') {
          this.answerImg = true;
        } else if (this.questionData.answerWay[j] == 'AUDIO') {
          this.answerAudio = true;
        } else if (this.questionData.answerWay[j] == 'VIDEO') {
          this.answerVideo = true;
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
    .subjective-block {
      margin-top: 24px;
      .subjective-type {
        display: inline-block;
        vertical-align: middle;
        i {
          font-size: 24px;
          color: #eee;
          margin-right: 8px;
        }
        .active {
          color: #F08D00;
        }
      }
    }
  }
</style>
