<template>
  <!--<div>自定义audio播放器样式---用于作业报告中,单个题目的老师评语、学生音频</div>-->
  <div class="audio-block">
    <audio ref="audio" class="dn"
           :src="url" :preload="audio.preload"
           @play="onPlay"
           @error="onError"
           @waiting="onWaiting"
           @pause="onPause"
           @timeupdate="onTimeupdate"
           @loadedmetadata="onLoadedmetadata"
    ></audio>
    <div class="iconfont play" :class="audio.playing ?'icon-zanting':'icon-bofang'"  @click="startPlayOrPause"></div>
    <div class="line"></div>
    <el-slider v-model="sliderTime" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider slider-audio-p" style="width: 100%;"></el-slider>
  </div>
</template>

<script>
  function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)
      var hours = Math.floor(second / 3600)
      second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60
      return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '0:00:00'
    }
  }
  export default{
    name: 'AudioView',
    props: ["audioSrc"],
    data() {
      return {
        url: this.audioSrc,
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'auto'
        },

        sliderTime: 0,
        volume: 100,
        controlList: {
          // 只能播放一个
          onlyOnePlaying: false,
        },
        theControlList:'onlyOnePlaying'
      }
    },
    methods: {
      setControlList () {
        let controlList = this.theControlList.split(' ');
        controlList.forEach((item) => {
          if(this.controlList[item] !== undefined){
            this.controlList[item] = true
          }
        })
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index)
        return '进度条: ' + realFormatSecond(index)
      },
      // 播放跳转
      changeCurrentTime(index) {
        this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        this.$refs.audio.play()
      },
      // 暂停
      pausePlay() {
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause () {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError () {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting (res) {
        console.log(res)
      },
      // 当音频开始播放
      onPlay (res) {
        this.audio.playing = true;
        this.audio.loading = false;
        if(!this.controlList.onlyOnePlaying){
          return
        }
        let target = res.target;
        let audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
          if(item !== target){
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        this.audio.currentTime = res.target.currentTime;
        this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100);
        if(res.target.currentTime==res.target.duration){
          this.audio.currentTime = 0;
          this.sliderTime = 0;
          this.audio.loading = false;
        }
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      onLoadedmetadata(res) {
        this.audio.waiting = false;
        this.audio.maxTime = parseInt(res.target.duration);
      }
    },
    filters: {
      formatSecond(second = 0) {
        return realFormatSecond(second)
      },
    },
    created() {
      this.setControlList()
    }
  }
</script>
<style lang="scss" scoped>
  .audio-block{
    width:372px;
    margin-top:16px;
    padding:16px;
    box-sizing: border-box;
    background:#FFFFFF;
    border-radius:12px;
    border:1px solid #E0E0E0;
    display:flex;
    .play{
      font-size:32px;
      line-height: 32px;
      color:rgba(253,193,108,1);
      text-shadow:1px 1px 4px 0px rgba(137,81,0,0.24);
    }
    .line{
      height:32px;
      width:2px;
      background:#fff;
      margin-left:8px;
    }
    .slider-audio-p{
      width:100%;
      flex:1;
      margin-left:15px;
      margin-top:-2px;

    }
  }
</style>
<style>
  .slider-audio-p .el-slider__runway{
    background:rgba(240,141,0,0.32);
  }
</style>
