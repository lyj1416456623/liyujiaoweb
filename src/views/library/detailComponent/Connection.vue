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
    <div class="connection-block">
      <div class="connection-item" v-for="(item,idx) in questionData.leftDataList">
        <div class="connection-left">
          <div class="point-num">{{idx+1}}</div>
          <div class="left-content" v-html="item"></div>
        </div>
        <i class="iconfont icon-bangding"></i>
        <div class="connection-right">
          <div class="point-num">{{idx+1}}</div>
          <div class="left-content" v-html="questionData.rightDataList[idx]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Connection",
    components:{XpAudio},
    props:['questionData','idx'],
    data(){
      return{

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
    .connection-block{
      margin-top:24px;
      .connection-item{
        display:flex;
        align-items: center;
        margin-bottom:16px;
        .connection-left,.connection-right{
          width:360px;
          min-height:40px;
          border:1px solid #E0E0E0;
          border-radius:4px;
          display:flex;
          align-items: top;
          font-size:16px;
          color:#606060;
          line-height:22px;
          .point-num{
            width:40px;
            min-height:40px;
            line-height: 40px;
            text-align: center;
            border-right:1px solid #E0E0E0;
          }
          .left-content{
            flex:1;
            padding:9px 16px;
          }
        }
        i{
          margin: 0 8px;
          font-size:24px;
          color:#000;
        }
      }
    }
  }
</style>
