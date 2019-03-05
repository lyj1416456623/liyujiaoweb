<template>
  <!--图文详情-->
  <div class="detail-block">
    <h2>正文</h2>
    <div class="detail-item">
      <template v-for="item in detailQustionData.info">
        <div class="text-item" v-if="item.itemType=='TEXT'" v-html="item.itemValue"></div>
        <div class="img-item" v-if="item.itemType=='IMG'">
          <img :src="item.itemValue" alt="">
        </div>
        <div class="audio-item" v-if="item.itemType=='AUDIO'">
          <xp-audio
            :audioSrc="item.itemValue"></xp-audio>
        </div>
        <div class="video-block" v-if="item.itemType == 'VIDEO'">
          <video controls="controls" poster="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/poster-video.png"
                 playsinline="" webkit-playsinline="" x5-playsinline="allow">
            <source :src="item.itemValue"/>
          </video>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"

  export default {
    name: "ImageTextDetail",
    components: {XpAudio},
    props:['detailQustionData'],
  }
</script>

<style scoped lang="scss">
  /*正文*/
  .detail-block {
    border: 1px solid #EEEEEE;
    border-radius: 2px;
    h2 {
      font-size: 14px;
      font-weight: 500;
      color: #606060;
      line-height: 48px;
      background: #F5F5F5;
      padding-left: 24px;
    }
    .detail-item {
      padding: 0 24px;
      .text-item {
        padding: 16px 0;
        font-size: 14px;
        color: #606060;
        line-height: 22px;
        border-top: 1px solid #eeeeee;
      }
      .img-item {
        border-top: 1px solid #eeeeee;
        padding: 16px 0;
        img {
          height: 104px;
        }
      }
      .audio-item {
        padding: 16px 0;
        border-top: 1px solid #eeeeee;
      }
      .video-block {
        border-top: 1px solid #eeeeee;
        padding: 16px 0;
        video {
          width: 300px;
          border: 1px solid #eeeeee;
        }
      }
    }
  }
</style>
