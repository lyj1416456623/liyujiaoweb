<template>
  <div class="wechat-content-homework">
    <div class="course-soldout-bg"></div>
    <div class="homework-content">
      <div class="before-class-title" >
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/zongjie.png" alt="">
        <p>第{{homeworkIndex}}课 课后总结</p>
      </div>
      <template v-for="item in beforeClassData">
        <div class="before-content" v-if="item.itemType == 'TEXT'" v-html="item.itemValue"></div>
        <div class="img-content" v-if="item.itemType == 'IMG'" @click="previewImgWx(item.itemValue)">
          <img :src="item.itemValue" alt="">
        </div>
        <xm-audio v-if="item.itemType == 'AUDIO'" :audioSrc="item.itemValue"></xm-audio>
        <div class="video-block" v-if="item.itemType == 'VIDEO'">
          <video controls="controls" poster="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/poster-video.png" playsinline="" webkit-playsinline="" x5-playsinline="allow">
            <source :src="item.itemValue" />
          </video>
        </div>
        <!--这如果是pdf的话需要pdf链接-->
        <a v-if="item.itemType == 'PDF'" :href="item.itemValue" :download="item.itemValue" class="audio-block pdf-block">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/pdf.png" alt="">
          <p>点击查看</p>
        </a>
      </template>
    </div>
    <div class="report-footer">
      <router-link :to="{path:'/course/detail/'+params.classId+'/'+params.subjectId}" class="back-btn">返回课程</router-link>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import XmAudio from "@/components/AudioComponent"
  export default {
    name: "ClassConclusion",
    data() {
      return {
        homeworkIndex:'',//第几课
        params:{},//地址栏传过来的数据
        beforeClassData:[],
        classId:'',
      }
    },
    components:{ XmAudio },
    watch: {
      '$refs.music.currentTime': function () {
        console.log(this.$refs.music.currentTime)
      }
    },
    mounted() {
      var _this = this;
      this.checkWeiXinBrowser(function () {
        _this.params = _this.$route.params;
        _this.homeworkIndex = Number(_this.params.homeworkIndex);
        _this.getBeforeClassData();
        _this.confirmLesson();
      })
    },
    methods: {
      confirmLesson(){
        console.log(this.params,"params");
        let _this = this;
        _this.request({
          method: 'post',
          url: '/student/lesson/confirm_lesson_task.do',
          param: {"lessonId":this.params.lessonId,"type":"MESSAGE_LESSON_URL_SUMMARIZE"},
          success: function (result) {
            console.log(result);
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      getBeforeClassData(){
        let _this = this;
        _this.request({
          method: 'post',
          url: '/homework/get_question.do',
          param: {"subjectId":this.params.subjectId,"homeworkIndex":this.params.homeworkIndex},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              console.log(result,"课前预习");
              _this.beforeClassData = result.result.summaryInfoList;
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课后总结失败,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //微信预览图片
      previewImgWx(url){
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .wechat-content-homework {
    height: 100%;
    position: relative;
    .homework-content {
      background: #fff;
      padding: 16px;
      padding-bottom:60px;
      .before-class-title{
        display:flex;
        height:42px;
        line-height: 42px;
        margin-bottom:26px;
        img{
          width:41px;
        }
        p{
          font-size:18px;
          color:#F2980B;
          margin-left:19px;
        }
      }
      .before-content{
        font-size:18px;
        color:#222222;
        line-height:26px;
      }
      .img-content{
        img{
          width:100%;
        }
        margin-bottom:16px;
      }
      .audio-block{
        margin-top:16px;
        padding:23px 24px 0;
        box-sizing: border-box;
        height:79px;
        border-radius:8px;
        background:linear-gradient(165deg,#FFCD55, #FFB64E);
        display:flex;
        .play{
          font-size:32px;
          line-height: 32px;
          color:#fff;
          text-shadow: 2px 2px 6px rgba(137,81,0,.24);
        }
        .line{
          height:32px;
          width:2px;
          background:#fff;
          margin-left:19px;
        }
        .slider-audio{
          width:100%;
          flex:1;
          margin-left:15px;
        }
      }
      .video-block{
        margin-top:16px;
        width:100%;
        video{
          width:100%;
        }
      }
      .pdf-block{
        height:auto;
        display:flex;
        align-content: center;
        align-items: center;
        padding:16px;
        background:#fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.2);
        img{
          width:54px;
        }
        p{
          color:#bdbdbd;
          flex:1;
          text-align: right;
        }
      }
    }
  }
  .report-footer{
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    background: #fff;
    padding:8px 16px;
    z-index: 10000;
    box-shadow:0px -1px 4px 0px rgba(0,0,0,0.08);
    .back-btn{
      display: block;
      border:1px solid #F08D00;
      border-radius: 8px;
      font-size:20px;
      color:#F08D00;
      text-align: center;
      line-height: 28px;
      padding:6px 0;
    }
  }
</style>
<style>
  .slider-audio .el-slider__runway{
    background: #ffffff !important;
    margin: 13px 0!important;
  }
  .slider-audio .el-slider__button{
    border: solid 5px #fff;
    background-color: #FFBD5F;
    box-shadow: 2px 2px 6px rgba(137,81,0,.24);
    margin-left:10px;
  }
</style>
