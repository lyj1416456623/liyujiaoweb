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
    <ul class="option-list">
      <li v-for='(item,idx) in questionData.optionMap'>
        <template>
          <p :class="questionData.answerList.indexOf(idx+1)!=-1?'active':''">
            <template v-if="item.itemType=='TEXT'"><span v-html="item.itemValue"></span></template>
            <img v-if="item.itemType=='IMG'" :src="item.itemValue" />
          </p>
          <span v-if="questionData.scoreMap[idx]&&questionData.scoreMap[idx]!='0'">+{{questionData.scoreMap[idx]}}分</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Choice",
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
    .option-list{
      padding-left:24px;
      margin-top:24px;
      li{
        list-style:upper-alpha;
        p{
          display:inline-block;
          width:550px;
          font-size:14px;
          color:#606060;
          line-height:22px;
          margin-bottom:8px;
          padding:3px 8px;
          vertical-align: top;
        }
        img{
          display:block;
          margin:0;
          padding:3px 0;
        }
        span{
          display:inline-block;
          vertical-align: top;
          margin-left:8px;
          font-size:14px;
          color:#F08D00;
          line-height:20px;
        }
      }
      .active{
        background:#FEF6EB;
      }
    }
  }
</style>
