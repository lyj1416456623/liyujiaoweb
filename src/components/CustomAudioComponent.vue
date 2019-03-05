<template>
    <!--<div>自定义audio播放器样式---用于作业报告中,单个题目的老师评语、学生音频</div>-->
  <div class="component-audio">
    <audio :src="audioSrc" ref="customAudio"></audio>
    <div class="custom-play-box">
      <div class="audio-custom-bg" @click="playAudio(audioSrc)">
        <img v-show="customAudioStatus=='pause'" class="audio-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.png" alt="">
        <img v-show="customAudioStatus=='play'" class="audio-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.gif" alt="">
        <span class="audio-time" v-show="customAudioTime>0">{{customAudioTime}}"</span>
      </div>
    </div>
  </div>
</template>

<script>
    export default{
        name: 'CustomAudio',
        props: ["audioSrc"],
        components: {},
        data(){
            return {
              customAudioStatus:'pause', //pause--停止播放状态;play--播放中
              customAudioTime:0, //音频时长
            }
        },
        create(){
        },
        mounted(){
          let _this = this;

          _this.$refs.customAudio.load();
          _this.$refs.customAudio.oncanplay = function () {
            _this.customAudioTime = parseInt(_this.$refs.customAudio.duration);
          }
        },
        watch: {

        },
        methods: {
          //点击 播放音频
          playAudio(src){
            let that = this;

            if(that.customAudioStatus=='pause'){
              that.$refs.customAudio.play();
              that.customAudioStatus='play'; //当前播放状态,记得修改图片
              that.$refs.customAudio.addEventListener("ended",function(){
                console.log('ended')
                that.$refs.customAudio.pause();
                that.customAudioStatus='pause';
              });
            }else{ //播放
              that.$refs.customAudio.pause();
              that.customAudioStatus='pause';
            }
          }
        }
    }
</script>
<style lang="scss" scoped>
  .component-audio{
    .custom-play-box{
      .audio-custom-bg{
        background: #46A3FA;
        border-radius: 12px;
        width: 100px;
        display: inline-block;
        padding:12px 16px;
        line-height: 24px;

        .audio-img{
          width: 20px;
          display: inline-block;
          vertical-align: middle;
        }
        .audio-time{
          padding-left:20px;
          line-height: 24px;
          display: inline-block;
          vertical-align: middle;
          color:#fff;
        }
      }
    }
  }
</style>
