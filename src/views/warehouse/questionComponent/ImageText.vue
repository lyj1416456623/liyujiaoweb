<template>
  <div class="image-text">
    <h5>{{idx+1+((page-1)*10)}}、<span  v-html="imageTextData.title.length>14?imageTextData.title.substring(0,14)+'...':imageTextData.title"></span></h5>
    <div class="img-list">
      <i class="iconfont icon-wenzi" :class="textFlag?'active':''"></i>
      <i class="iconfont icon-tupian" :class="imageFlag?'active':''"></i>
      <i class="iconfont icon-yinpin" :class="audioFlag?'active':''"></i>
      <i class="iconfont icon-shipin" :class="videoFlag?'active':''"></i>
    </div>
  </div>
</template>

<script>
    export default {
      name: "ImageText",
      props:['imageTextData','idx','page'],
      data(){
        return{
          textFlag:false,//是否有图文
          imageFlag:false,//是否有图片
          audioFlag:false,//是否有音频
          videoFlag:false,//是否有视频
        }
      },
      mounted(){
        console.log(this.imageTextData.questionDataObject.info);
        var questionData = this.imageTextData.questionDataObject.info;
        for (var j = 0; j < questionData.length; j++) {
          if (questionData[j].itemType == 'TEXT') {
            this.textFlag = true;
          } else if (questionData[j].itemType == 'IMG') {
            this.imageFlag = true;
          } else if (questionData[j].itemType == 'AUDIO') {
            this.audioFlag = true;
          } else if (questionData[j].itemType == 'VIDEO') {
            this.videoFlag = true;
          }
        }
      }
    }
</script>
<style scoped lang="scss">
  .image-text{
    .img-list{
      margin-top:40px;
      i{
        font-size:24px;
        color:#E0E0E0;
      }
      .active{
        color:#F08D00;
      }
    }
  }
</style>
