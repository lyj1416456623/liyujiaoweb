<template>
  <div class="detail-choice">
    <div class="total-score">+{{detailQustionData.totalScore}}分</div>
    <template v-for="item in detailQustionData.title">
      <h5 v-if="item.itemType=='TEXT'">{{idx}}、<span v-html="item.itemValue"></span></h5>
      <img v-if="item.itemType=='IMG'" :src="item.itemValue" alt="">
      <div class="audio-item" v-if="item.itemType=='AUDIO'">
        <xp-audio :audioSrc="item.itemValue"></xp-audio>
      </div>
    </template>
    <div class="blank-block">
      <div class="blank-item" v-for="(option,opidx) in detailQustionData.answerList">
        <span class="series-box">{{opidx+1}}、</span>
        <div class="answer-txt" v-html="option">{{option}}</div>
      </div>
    </div>
    <div class="parsing">
      <p>解析：</p>
      <p class="parse-detail">
        <template v-for="item in detailQustionData.explainList">
          <span v-if="item.itemType=='TEXT'" v-html="item.itemValue"></span>
          <img v-if="item.itemType=='IMG'" :src="item.itemValue">
        </template>
      </p>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Connection",
    components: {XpAudio},
    props:['detailQustionData','idx'],
    data() {
      return {}
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
    }
    img {
      height: 104px;
      margin-top: 8px;
      display: block;
    }
    .audio-item {
      margin-top: 8px;
      width:372px;
      border:1px solid #e0e0e0;
      border-radius:8px;
    }
    .blank-block{
      .blank-item{
        margin-top:16px;
        font-size:14px;
        color:#606060;
        line-height:22px;
        display: flex;
        align-items: top;
        .answer-txt{
          display:inline-block;
          width:240px;
          padding-bottom:3px;
          border-bottom:1px solid #E0E0E0;
        }
        .score{
          color:#F08D00;
          margin-left:24px;
        }
      }
    }
    .parsing{
      width:600px;
      padding:16px;
      background:#FAFAFA;
      border-radius:4px;
      box-sizing: border-box;
      font-size:16px;
      color:#606060;
      line-height:24px;
      margin-top:16px;
      .parse-detail{
        margin-top:8px;
      }
    }
  }
</style>
