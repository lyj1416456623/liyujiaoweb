<template>
  <div class="test-audio">
    <h4>手机端audio播放测试</h4>

    <p>播放mov视频: ↓</p>
    <br>
    <video src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/student_answer/video/20190110155149051751.MOV" controls></video>

    <br>
    <div class="audio-box">
      <div class="my-audio">
        <p>检测安卓手机能否播放wav--不能 : ↓</p>
        <audio ref="myAudio" controls
               src="https://ziyue-xn.oss-cn-beijing.aliyuncs.com/homework/mark/20181229192508949960.wav"></audio>
        <!--<div class="ziyue-arrow arrow-left" @click="audioClick">-->
        <!--<i class="iconfont icon-right_m"></i> <span>56"</span>-->
        <!--</div>-->
      </div>

      <br>
      <hr>
      <br>
      <div>纯video ↓</div>
      <div>
        <video src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/student_answer/video/20181225130103848350.mp4"
               controls
        ></video>
      </div>
      <br>
      <hr>
      <br>
      <div class="video-box">
        <p>playsinline 默认不全屏播放: ↓</p>
        <video src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/student_answer/video/20181225130103848350.mp4"
               controls playsinline="" webkit-playsinline="" x5-playsinline="allow" x5-video-player-fullscreen="false"

        ></video>

        <!--
        x5-video-orientation="portrait"
        x5-video-player-fullscreen="true"
        webkit-playsinline="true" playsinline="true"
        -->
        <!--http://ziyue-xn.oss-cn-beijing.aliyuncs.com/homework/question/20181221160321854622.mp4-->
      </div>

      <br>
      <hr>
      <br>
      <p>尝试安卓用flash,苹果用video</p>
      <p>当前设备 {{userAgent}}</p>
      <p style="color:#F08D00;">是否是ios ? {{ifIoS}}</p>
      <template v-if="ifIoS">
        <p>IOS 纯video</p>
        <video src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/student_answer/video/20181225130103848350.mp4"
               controls
        ></video>
      </template>
      <template v-else>
        <p>安卓 flash 貌似没有用</p>

        <object>
          <embed src="http://www.runoob.com/try/demo_source/movie.mp4" width="200" height="150">
        </object>
      </template>

      <br>
      <hr>
      <br>

    </div>
  </div>
</template>

<script>
  //  import swfObjectHs from '../../lib/swfobject'
  export default{
    name: '',
    props: [],
    components: {},
    data(){
      return {
        status: 'pause', //pause --当前停止播放状态;play--当前播放状态
        userAgent: window.navigator.userAgent,
        ifIoS: (/iPhone|iPad|iPod/i).test(navigator.userAgent),



        //https://onlinetest-public.oss-cn-beijing.aliyuncs.com/public/audio/welcome.mp3
      }
    },
    mounted(){
//      if ((/iPhone|iPad|iPod/i).test(navigator.userAgent)
    },
    watch: {},
    methods: {
      audioClick(){
        let that = this;

        if (that.status == 'pause') {
          that.$refs.myAudio.play();
          that.status = 'play';
        } else {
          that.$refs.myAudio.pause();
          that.status = 'pause';
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-audio {
    padding: 20px;

  }

  audio, video {
    display: block;
  }

  video {
    width: 100%;
    height: 200px;
  }
</style>
