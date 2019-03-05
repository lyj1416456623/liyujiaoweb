<template>
  <div class="wechat-content-homework">
    <div class="weui-loadmore" v-if="flag" style="margin-top:0;padding-top:10px">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="homework-content" v-if="!flag">
      <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/homework_ill.jpg" alt="">
      <h2><i class="iconfont icon-zuodian"></i><span>{{courseData.studentName}}的课后作业</span><i class="iconfont icon-youdian"></i></h2>
      <p>{{courseData.courseName}}-第{{courseData.lessonIndex}}课</p>
      <a :href="'/homework/'+lessonId+'/'+subjectId+'/'+homeworkIndex" class="start-homework-botton">开始作业</a>
      <!--<router-link :to="{path:'/homework/'+lessonId+'/'+subjectId+'/'+homeworkIndex}" class="start-homework-botton">开始作业</router-link>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "StartHomework",
    data(){
      return{
        courseData:{
          lessonIndex:0,
        },
        subjectId:'',
        homeworkIndex:'',
        lessonId:'',
        flag:true
      }
    },
    mounted(){
      var _this = this;
      this.checkWeiXinBrowser(function () {
        _this.lessonId = _this.$route.params.lessonId;
        _this.subjectId = _this.$route.params.subjectId;
        _this.homeworkIndex = _this.$route.params.homeworkIndex;
        _this.flag = false;
        _this.request({
          method: 'post',
          url: '/lesson/get_student_and_lesson.do',
          param: {lessonId: _this.lessonId},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                var data = result.result;
                _this.courseData = data;
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      })
    }
  }
</script>

<style scoped lang="scss">
  .wechat-content-homework {
    height: 100%;
    .homework-content {
      background: #fff;
      padding: 16px;
      img {
        width: 100%;
        display: block;
      }
      h2 {
        margin-top: 40px;
        margin-bottom: 24px;
        text-align: center;
        span{
          font-size: 20px;
          font-weight: 500;
          color: #222222;
          line-height: 28px;
          text-align: center;
          padding:0 15px;
        }
        i{
          color:#222222;
        }
      }
      p {
        font-size: 16px;
        color: #909090;
        line-height: 22px;
        text-align: center;
      }
      .start-homework-botton {
        height: 40px;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 16px;
        right: 16px;
        border-radius: 12px;
        color: #fff;
        bottom: 24px;
        background: #46A3FA;
        font-size: 20px;
        box-shadow: 0 2px 4px rgba(0, 120, 199, .24);
      }
    }
  }

</style>
