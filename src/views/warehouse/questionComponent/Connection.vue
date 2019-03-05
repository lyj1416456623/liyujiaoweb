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
    props:['questionData','idx','page'],
    data(){
      return{
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
