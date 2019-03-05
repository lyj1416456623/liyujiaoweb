<template>
  <div class="ziyue-page-content">
    <div class="banner-block">
      <img
        src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/WechatIMG17.png" alt="">
      <div class="banner-text">
        <h2>{{courseName}}</h2>
        <p>{{className}}</p>
      </div>
    </div>
    <div class="lesson-block lesson-next" v-if="nextCourse.length>0">
      <div class="lesson-title">
        <span class="line-block"></span><span class="title">下一节课</span>
      </div>
      <router-link class="lesson-item" v-for="item in nextCourse" :to="{path:'/lesson/detail/'+item.id+'/'+subjectId}"
                   :key="item.id">
        <div class="lesson-date">
          <p>{{item.day.substring(0,7)}}</p>
          <h3>{{item.day.substring(8)}}</h3>
        </div>
        <div class="lesson-detail">
          <h3>第{{item.lessonIndex}}课</h3>
          <div class="lesson-detail-time">
            {{item.timeSlot}}
          </div>
        </div>
        <div class="right-arrow"></div>
      </router-link>
    </div>
    <div class="lesson-block" v-if="beforeCourse.length>0">
      <div class="lesson-title">
        <span class="line-block"></span><span class="title">已学课节</span>
      </div>
      <router-link class="lesson-item" v-for="item in beforeCourse" :to="{path:'/lesson/detail/'+item.id+'/'+subjectId}"
                   :key="item.id">
        <div class="lesson-date">
          <p>{{item.day.substring(0,7)}}</p>
          <h3>{{item.day.substring(8)}}</h3>
        </div>
        <div class="lesson-detail">
          <h3>第{{(item.lessonIndex)}}课</h3>
          <div class="lesson-detail-time">
            {{item.timeSlot}}
          </div>
        </div>
        <div class="right-arrow"></div>
      </router-link>
    </div>
    <div class="no-course" v-if="nextCourse.length<1&&beforeCourse.length<1">
      <p>课程还没有开始哦！</p>
      <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongzicover.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "Detail",
    data() {
      return {
        nextCourse: [],
        beforeCourse: [],
        classId: '',
        className: '',
        lessonName: '',
        subjectId: '',
        courseName: '',
      }
    },
    mounted() {
      var _this = this;
      this.checkWeiXinBrowser(function () {
        _this.classId = _this.$route.params.classId;
        _this.subjectId = _this.$route.params.subjectId;
        _this.getCourseById();
      })

    },
    methods: {
      getCourseById() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/student/lesson/get_lesson_by_class_id.do',
          param: {classId: _this.classId},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                var data = result.result;
                _this.className = data.className;
                _this.courseName = data.courseName;
                _this.nextCourse = data.next || [];
                _this.beforeCourse = data.previous || [];
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
    }
  }
</script>

<style scoped lang="scss">
  .ziyue-page-content {
    position: relative;
    height: 100%;
    padding-bottom: 20px;
  }

  .banner-block {
    position: relative;
    img {
      width: 100%;
      display: block;
    }
    .banner-text {
      position: absolute;
      bottom: 6px;
      left: 16px;
      h2 {
        font-size: 18px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 26px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.32);
      }
      p {
        font-size: 10px;
        color: #FFFFFF;
        line-height: 18px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.32);
      }
    }
  }

  .lesson-block {
    margin-top: 24px;
    padding: 0 16px;
    .lesson-title {
      margin-bottom: 8px;
      .line-block {
        width: 4px;
        height: 10px;
        display: inline-block;
        background: #F08D00;
        margin-right: 8px;
        border-radius: 2px;
      }
      .title {
        font-size: 12px;
        color: #606060;
      }
    }
    .lesson-item {
      padding: 16px;
      background: #fff;
      margin-bottom: 16px;
      border-radius: 12px;
      display: flex;
      position: relative;
      box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
      .lesson-date {
        border-right: 1px solid #F5F5F5;
        padding-right: 18px;
        p {
          font-size: 10px;
          color: #909090;
          line-height: 10px;
        }
        h3 {
          font-size: 32px;
          font-weight: 500;
          color: #606060;
          line-height: 32px;
          margin-top: 6px;
        }
      }
      .lesson-detail {
        padding-left: 16px;
        h3 {
          font-size: 16px;
          font-weight: 500;
          color: #606060;
          line-height: 16px;
        }
        .lesson-detail-time {
          width: 88px;
          height: 20px;
          border-radius: 10px;
          font-size: 12px;
          color: #909090;
          line-height: 20px;
          background: #EEEEEE;
          text-align: center;
          margin-top: 12px;
        }
      }
      .right-arrow {
        width: 8px;
        height: 8px;
        position: absolute;
        top: 50%;
        right: 32px;
        margin-top: -4px;
        border-top: 2px solid #EEEEEE;
        border-right: 2px solid #EEEEEE;
        transform: rotate(45deg);
      }
    }
    /*下一节课的时间颜色  color:#FA9600;*/
  }

  .lesson-next .lesson-date h3 {
    color: #fa9600 !important;
  }

  .no-course {
    p {
      margin: 64px 0 40px;
      font-size: 16px;
      color: #BDBDBD;
      line-height: 24px;
      text-align: center;
    }
    img {
      width: 196px;
      margin: 0 auto;
      display: block;
    }
  }
</style>
