<template>
  <div class="ziyue-page-content">
    <div class="lesson-title">
      <h2>第{{lessonIndex}}课</h2>
      <p>{{day}}上课</p>
    </div>
    <template v-for="item in homeworkList">
      <router-link  class="lesson-block" v-if="item.type =='MESSAGE_LESSON_INFLATED'" :to="{path:'/beforeclass/'+subjectId+'/'+lessonIndex+'/'+lessonId+'/'+classId}">
        <div class="lesson-item">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/before.png" alt="">
          </div>
          <div class="lesson-detail">课前预习</div>
          <div class="lesson-botton" v-if="!item.ifRetrieval">去预习</div>
        </div>
      </router-link>
      <div class="lesson-block" v-if="item.type =='MESSAGE_LESSON_URL_REPLAY'">
        <a class="lesson-item" :href="item.url||'javascript::(void)'" target="_blank">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/reverse.png" alt="">
          </div>
          <div class="lesson-detail">课程回放</div>
        </a>
      </div>
      <a class="lesson-block" v-if="item.type =='MESSAGE_LESSON_HOMEWORK'&&!finishHomework" :href="'/homework/'+lessonId+'/'+subjectId+'/'+lessonIndex">
        <div class="lesson-item">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/homework.png" alt="">
          </div>
          <div class="lesson-detail">课后作业</div>
          <div class="lesson-botton" v-if="!finishHomework">做作业</div>
        </div>
      </a>
      <router-link class="lesson-block" v-if="item.type =='MESSAGE_LESSON_HOMEWORK'&&finishHomework" :to="{path:'/homeworkReport/'+lessonId+'/'+subjectId+'/'+lessonIndex+'/2'}">
        <div class="lesson-item">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/homework.png" alt="">
          </div>
          <div class="lesson-detail">课后作业</div>
          <div class="lesson-botton" v-if="ifMarked">查看报告</div>
        </div>
      </router-link>
      <router-link class="lesson-block" v-if="item.type =='MESSAGE_LESSON_URL_SUMMARIZE'" :to="{path:'/classconclusion/'+subjectId+'/'+lessonIndex+'/'+lessonId+'/'+classId}">
        <div class="lesson-item">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/zongjie.png" alt="">
          </div>
          <div class="lesson-detail">课后总结</div>
          <div class="lesson-botton lesson-botton-block"  v-if="!item.ifRetrieval">去完成</div>
        </div>
      </router-link>
      <router-link class="lesson-block" v-if="item.type =='MESSAGE_LESSON_EXPANSION'" :to="{path:'/classexpand/'+subjectId+'/'+lessonIndex+'/'+lessonId+'/'+classId}">
        <div class="lesson-item">
          <div class="lesson-img">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/tuozhan.png" alt="">
          </div>
          <div class="lesson-detail">课后拓展</div>
          <div class="lesson-botton lesson-botton-block" v-if="!item.ifRetrieval">拓展一下</div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script>
  export default {
    name: "lessonDetail",
    data() {
      return {
        homeworkList: [],
        lessonId: '',
        lessonIndex: '',
        classId:'',//班级id
        subjectId: '',
        day: '',
        finishHomework: false,
        ifMarked:false
      }
    },
    mounted() {
      var _this = this;
      this.checkWeiXinBrowser(function () {
        _this.lessonId = _this.$route.params.lessonId;
        _this.subjectId = _this.$route.params.subjectId;
        _this.gethomeworkList();
      })
    },
    methods: {
      //获取我的作业列表
      gethomeworkList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/student/lesson/get_lesson_task.do',
          param: {lessonId: _this.lessonId},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                _this.day = result.result.day;
                _this.lessonIndex = result.result.lessonIndex;
                var lessonIndex = _this.lessonIndex;
                document.title = "第" + lessonIndex + "课";
                _this.homeworkList = result.result.task;
                _this.gethomeworkRecord();
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取作业记录
      gethomeworkRecord() {
        var _this = this;
        let param = {
          "lessonId": _this.lessonId,
          "subjectId": _this.subjectId,
          "homeworkIndex": _this.lessonIndex,
        };
        _this.request({
          method: 'post',
          url: '/homework/record/get_homework_record.do',
          param: param,
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                _this.classId = result.result.classId;
                if (result.result.ifFinishAnswer) { //作业已完成
                  console.log('作业已经做完并提交了了');
                  _this.finishHomework = true;
                } else {
                  _this.finishHomework = false;
                }
                if(result.result.ifMarked){
                  _this.ifMarked = true;
                }else{
                  _this.ifMarked = false;
                }
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .ziyue-page-content {
    position: relative;
    height: 100%;
    padding-bottom: 20px;
  }

  .lesson-title {
    padding: 24px 16px;
    h2 {
      height: 24px;
      font-size: 24px;
      font-weight: 500;
      color: #222222;
      line-height: 24px;
      display:inline-block;
      border-bottom: 8px solid #F2C480;
      box-sizing: border-box;
    }
    p {
      font-size: 12px;
      color: #909090;
      line-height: 12px;
      margin-top: 12px;
    }
  }

  .lesson-block {
    padding: 0 16px;
    display:block;
    .lesson-item {
      padding: 16px;
      background: #fff;
      margin-bottom: 16px;
      border-radius: 12px;
      display: flex;
      align-content: center;
      align-items: center;
      box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
      .lesson-img {
        width: 48px;
        height: 48px;
        img {
          width: 100%;
        }
      }
      .lesson-detail {
        margin-left: 16px;
        font-size: 16px;
        color: #606060;
        font-weight: 500;
        flex: 1;
      }
      .lesson-botton {
        width: 80px;
        height: 36px;
        border-radius: 12px;
        line-height: 36px;
        text-align: center;
        background: #F08D00;
        color: #fff;
      }
      .lesson-botton-block {
        border: 1px solid #F08D00;
        background: #fff;
        color: #F08D00;
      }
    }
  }
</style>
