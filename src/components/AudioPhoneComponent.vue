<template>
  <!--<div>自定义audio播放器样式---作业中学生提交的音频、老师评语的音频</div>-->
  <div class="summary-audio" :class="!ifArrow?'summary-audio-no':''">
    <audio ref="audio" class="dn"
           :src="url" :preload="audio.preload"
           @play="onPlay"
           @error="onError"
           @waiting="onWaiting"
           @pause="onPause"
           @timeupdate="onTimeupdate"
           @loadedmetadata="onLoadedmetadata"
    ></audio>
    <div class="ziyue-arrow arrow-left" @click="startPlayOrPause" v-if="ifArrow">
      <img v-show="!audio.playing" class="audio-img"
           src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.png" alt="">
      <img v-show="audio.playing" class="audio-img"
           src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.gif" alt="">
      <span class="audio-time" v-show="audio.maxTime>0">{{audio.maxTime}}"</span>
    </div>
    <div class="ziyue-arrow arrow-no-left" @click="startPlayOrPause" v-if="!ifArrow">
      <img v-show="!audio.playing" class="audio-img"
           src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.png" alt="">
      <img v-show="audio.playing" class="audio-img"
           src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/audio.gif" alt="">
      <span class="audio-time" v-show="audio.maxTime>0">{{audio.maxTime}}"</span>
    </div>
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

  export default {
    name: 'AudioPhoneComponent',
    props: ["audioSrc","ifArrow"],
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
        theControlList: 'onlyOnePlaying'
      }
    },
    methods: {
      setControlList() {
        let controlList = this.theControlList.split(' ');
        controlList.forEach((item) => {
          if (this.controlList[item] !== undefined) {
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
      onPause() {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError() {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting(res) {
        console.log(res)
      },
      // 当音频开始播放
      onPlay(res) {
        this.audio.playing = true;
        this.audio.loading = false;
        if (!this.controlList.onlyOnePlaying) {
          return
        }
        let target = res.target;
        let audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
          if (item !== target) {
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        this.audio.currentTime = res.target.currentTime;
        if (res.target.currentTime == res.target.duration) {
          this.audio.currentTime = 0;
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
  .summary-audio {
    width: 125px;
    display: inline-block;
    height: 48px;
    background: #46A3FA;
    border-radius: 8px;
    vertical-align: middle;
    margin-left: 16px;

    .ziyue-arrow {
      .audio-img {
        width: 20px;
        display: inline-block;
        vertical-align: middle;
      }
      .audio-time {
        padding-left: 20px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .summary-audio-no{
    margin:0;
  }
</style>
