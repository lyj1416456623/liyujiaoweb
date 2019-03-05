<template>
  <div class="detail-choice">
    <div class="total-score">+{{questionData.totalScore}}分</div>
    <h5>{{idx+1+((page-1)*10)}}、
      <template v-for="item in questionData.title">
        <span v-if="item.itemType=='TEXT'" v-html="item.itemValue"></span>
      </template>
    </h5>
    <div class="icon-font">
      <i class="iconfont icon-tupian" :class="imageFlag?'active':''"></i>
      <i class="iconfont icon-yinpin" :class="audioFlag?'active':''"></i>
    </div>
    <ul class="option-list">
      <li v-for="(item,idx) in questionData.optionMap">
        <p :class="questionData.answerList.indexOf(idx+1)!=-1?'active':''">
          <template v-if="item.itemType=='TEXT'"><span v-html="item.itemValue"></span></template>
          <i v-if="item.itemType=='IMG'" class="iconfont icon-tupian"></i>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "Choice",
    components:{XpAudio},
    props:['questionData','idx','page'],
    data(){
      return{
        imageFlag:false,
        audioFlag:false
      }
    },
    created(){
      for(var i = 0;i<this.questionData.title.length;i++){
        if(this.questionData.title[i].itemType=='IMG'){
          this.imageFlag = true;
        }else if(this.questionData.title[i].itemType=='AUDIO'){
          this.audioFlag = true;
        }
      }
    },
    methods:{

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
    .icon-font{
      i{
        font-size:24px;
        vertical-align: middle;
        margin-left:4px;
        color:#E0E0E0;
      }
      .active{
        color:#F08D00;
      }
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
          line-height:25px;
          margin-bottom:8px;
          padding:3px 8px;
          min-height:25px;
          vertical-align: middle;
          background:#f5f5f5;
          i{
            color:#F08D00;
            font-size:24px;
            line-height: 44px;
          }
        }
      }
      .active{
        background:#FEF6EB;
      }
    }
  }
</style>
