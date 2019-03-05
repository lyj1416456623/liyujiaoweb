<template>
  <div class="ziyue-page-content" :class="courseList.length>0?'':'white-bg'">
    <template v-if="courseList.length>0">
      <div class="course-soldout-bg"></div>
      <router-link class="course-list" :to="{path:'/course/detail/'+item.id+'/'+item.subjectId}"
                   v-for="item in courseList" :key="item.id">
        <h3><div></div><span>{{item.courseName}}</span></h3>
        <p class="course-list-message">{{item.className}}</p>
        <p><span
          class="lesson-num">共<span>{{item.lessonsCount.complete+item.lessonsCount.unComplete}}</span>节课</span><span
          class="lesson-num">已学<span>{{item.lessonsCount.complete}}</span>节课</span></p>
        <div class="right-arrow"></div>
      </router-link>
    </template>
    <template v-if="courseList.length<1 && courseFlag">
      <div class="course-no-list">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
        <h3>家长您好，您尚无法查看课程：</h3>
        <p>原因是已经购买却尚未绑定学习微信，或者是尚未购买课程 </p>
        <h2>您可以： </h2>
        <router-link class="submit-button" :to="{path:'/bindwechat'}">已经购买，去绑定</router-link>
        <a class="submit-button jump-button" href="https://wxa3becc7a3fff143d.h5.xiaoe-tech.com">尚未购买，去选课</a>
      </div>
    </template>
  </div>
</template>

<script>
  import {TopTips} from 'we-vue'

  export default {
    name: "Index",
    data() {
      return {
        courseList: [],//我的课程列表
        courseFlag:false
      }
    },
    mounted() {
      var _this = this;
      this.checkWeiXinBrowser(function () {
        console.log("this is wechat");
        _this.getCourseList();
      })
    },
    methods: {
      //获取我的课程列表
      getCourseList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/student/course/get_student_course.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                _this.courseList = result.result;
                if(_this.courseList.length<1){
                  _this.courseFlag = true;
                }
              }
            }else{
              _this.courseFlag = true;
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.courseFlag = true;
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
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
    .course-list {
      display: block;
      padding: 16px;
      background: #fff;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .16);
      position: relative;
      h3 {
        font-size: 18px;
        font-weight: 500;
        color: #262626;
        line-height: 18px;
        margin-bottom: 10px;
        display:flex;
        align-items: top;
        width:88%;
        div{
          width:6px;
          height:16px;
          background:#F08D00;
          border-radius:4px;
          margin-right:8px;
        }
        span{
          flex:1;
        }
      }
      .course-list-message {
        font-size: 12px;
        color: #909090;
        line-height: 14px;
        margin-bottom: 12px;
        width:88%;
      }
      .lesson-num {
        font-size: 12px;
        color: #909090;
        line-height: 14px;
        margin-right: 16px;
        span {
          color: #F08D00;
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
    .course-no-list{
      padding-top:48px;
      img{
        width:85px;
        margin:0 auto;
        display:block;
      }
      h3{
        font-size:18px;
        font-weight:400;
        color:#333333;
        line-height:25px;
        margin-top:30px;
        margin-bottom:20px;
      }
      p{
        font-size:16px;
        color:#999999;
        line-height:32px;
      }
      h2{
        font-size:20px;
        color:#002B5D;
        font-weight:400;
        line-height:28px;
        margin:40px 0 45px;
      }
      .submit-button {
        height: 44px;
        background: #F18D00;
        text-align: center;
        line-height: 44px;
        border-radius: 8px;
        color: #fff;
        display:block;
        margin-bottom:24px;
      }
      .jump-button{
        border:1px solid #F18D00;
        background:#fff;
        color:#F18D00
      }
    }
  }
  .white-bg{
    background:#fff;
  }
</style>
