<template>
  <div class="lunbo-block">
    <div class="slider-stage">
      <ul ref='sli' class="slider">
        <!--无缝需要-->
        <li>
          <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
        </li>
        <li>
          <img src="http://pic22.nipic.com/20120714/9622064_105642209176_2.jpg" alt="">
        </li>
        <li>
          <img src="http://t8.baidu.com/it/u=3660968530,985748925&fm=191&app=48&wm=1,17,90,45,20,7&wmo=0,0&n=0&g=0n&f=JPEG?sec=1853310920&t=9b4f100f0eedfe853fad24a58a4e1ad7" alt="">
        </li>
        <!--图片-->
        <li>
          <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
        </li>
        <li>
          <img src="http://pic22.nipic.com/20120714/9622064_105642209176_2.jpg" alt="">
        </li>
        <li>
          <img src="http://t8.baidu.com/it/u=3660968530,985748925&fm=191&app=48&wm=1,17,90,45,20,7&wmo=0,0&n=0&g=0n&f=JPEG?sec=1853310920&t=9b4f100f0eedfe853fad24a58a4e1ad7" alt="">
        </li>
        <!--end-->
        <!--无缝需要-->
        <li>
          <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="">
        </li>
        <li>
          <img src="http://pic22.nipic.com/20120714/9622064_105642209176_2.jpg" alt="">
        </li>
        <li>
          <img src="http://t8.baidu.com/it/u=3660968530,985748925&fm=191&app=48&wm=1,17,90,45,20,7&wmo=0,0&n=0&g=0n&f=JPEG?sec=1853310920&t=9b4f100f0eedfe853fad24a58a4e1ad7" alt="">
        </li>
      </ul>
    </div>
    <div class="arrow left-arrow" @click="leftLoop()" @mouseover="clearInterval()" @mouseout="autoLoop()"><</div>
    <div class="arrow right-arrow" @click="rightLoop()" @mouseover="clearInterval()" @mouseout="autoLoop()">></div>
  </div>
</template>

<script>
  export default {
    name: "carousel",
    data() {
      return {
        index: 3,
        timed:null,
      }
    },
    created() {
      this.autoLoop()
    },
    destroyed(){
      clearInterval(this.timed);
    },
    methods: {
      //自动轮播
      autoLoop() {
        var _this = this;
        _this.timed = setInterval(()=>{
          this.index++;
          this.moveLoop();
        },2000)
      },
      //清除Interval
      clearInterval(){
        clearInterval(this.timed);
      },
      leftLoop(){
        clearInterval(this.timed);
        this.index--;
        this.moveLoop();
      },
      moveLoop(){
        this.$refs.sli.style.left = -300*this.index + 'px'
        this.$refs.sli.style.transition= "all 0.5s"
        if(parseInt(this.$refs.sli.style.left)>=-600){
          setTimeout(()=>{
            //这个setTimeout是因为left=-1500px，transition有0.5s执行动画，需要等它执行完成后，再设置left=0，
            //否则，直接跳到left=0,动画生硬，
            this.$refs.sli.style.left = -1500 + 'px'
            this.$refs.sli.style.transition= "all 0s"
            this.index = 5
          },500)
        }
        if(parseInt(this.$refs.sli.style.left) <= -1800){
          setTimeout(()=>{
            //这个setTimeout是因为left=-900px，transition有0.5s执行动画，需要等它执行完成后，再设置left=0，
            //否则，直接跳到left=0,动画生硬，
            this.$refs.sli.style.left = -900 + 'px'
            this.$refs.sli.style.transition= "all 0s"
            this.index = 3
          },500)
        }
      },
      rightLoop(){
        clearInterval(this.timed);
        this.index++;
        this.moveLoop();
      }
    }
  }
</script>
<style scoped lang="scss">
  .lunbo-block{
    position:relative;
    min-width: 1000px;
    .arrow{
      position:absolute;
      top:50%;
      width:50px;
      margin-top:-40px;
      height:80px;
      line-height: 80px;
      text-align: center;
      background:#000000;
      color:#fff;
      cursor: pointer;
    }
  }
  .left-arrow{
    left:0px;
  }
  .right-arrow{
    right:0;
  }


  .slider-stage {
    width: 900px;
    height: 150px;
    background-color: rgba(134, 134, 134, 0.33);
    /*border: 10px grey solid;*/
    margin: 200px auto;
    position: relative;
    overflow: hidden;
  }
  .slider {
    position: absolute;
    width: 300%;
    height: 100px;
    left: -900px;
    top: 0;
  }
  .slider li {
    list-style: none;
    float: left;
  }
  .slider img {
    width: 300px;
    height: 150px;
    display:block;
  }

</style>
