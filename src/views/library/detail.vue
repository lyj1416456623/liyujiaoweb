<template>
  <el-container>
    <el-header class="common-header" style="height:92px;">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/library' }">套题</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">{{typeValue}}</a>
      </el-breadcrumb>
      <h4 class="common-title" style="height:44px">{{courseName}}</h4>
      <div class="header-tag">
        <span>第{{lessonNum}}课</span>
        <span>{{typeValue}}</span>
      </div>
      <!--<div class="update-user">最后编辑人：{{updateUser}}</div>-->
    </el-header>
    <el-container class="common-content">
      <div class="empty-content" v-if="!lessonData.title">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/homeworkkong.png" alt="">
        <p>这节课没有{{typeValue}}哦！</p>
        <el-button type="primary" plain @click="jumpAddImageText">录入题目</el-button>
      </div>
      <div class="detail-content" v-if="lessonData.title">
        <div class="close-block iconfont icon-shanchu" @click="delQuestion"></div>
        <h2><span class="title-span"></span><span v-html="lessonData.title.length>14?lessonData.title.substring(0,14)+'...':lessonData.title"></span></h2>
        <div class="grade-block">
          <p><span>年级：</span>{{lessonData.gradeValue}}</p>
          <p><span>难度：</span>
            <el-rate
            v-model="lessonData.difficultLevel"
            disabled
            :colors="['#F08D00', '#F08D00', '#F08D00']">
          </el-rate>
          </p>
        </div>
        <div class="point-block">
          <p>知识点：</p>
          <div class="point-item">
            <span v-for="point in lessonData.points">{{point.name}}</span>
          </div>
        </div>
        <div class="detail-block">
          <h2>正文</h2>
          <div class="detail-item">
            <template v-for="item in detailQustionData">
              <div class="text-item" v-if="item.itemType=='TEXT'" v-html="item.itemValue"></div>
              <div class="img-item" v-if="item.itemType=='IMG'">
                <img :src="item.itemValue" alt="">
              </div>
              <div class="audio-item" v-if="item.itemType=='AUDIO'">
                <xp-audio
                  :audioSrc="item.itemValue"></xp-audio>
              </div>
              <div class="video-block" v-if="item.itemType == 'VIDEO'">
                <video controls="controls" poster="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/poster-video.png"
                       playsinline="" webkit-playsinline="" x5-playsinline="allow">
                  <source :src="item.itemValue"/>
                </video>
              </div>
            </template>
          </div>
        </div>
      </div>
      <el-footer class="library-footer">
        <el-button @click="goback">返回</el-button>
        <!--<el-button type="primary" plain>预览</el-button>-->
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import XpAudio from "@/components/AudioLibraryComponent"
  export default {
    name: "detail",
    data(){
      return{
        updateUser:'',//最后编辑人
        courseName:'',//课程名称
        typeValue:'课前预习',
        lessonNum:'',//第几课
        courseId:'',
        grade:'',//年级
        lessonData:{},//题目数据
        detailQustionData:[],
        lessonQuestionType:'PREVIEW',
      }
    },
    components:{XpAudio},
    mounted(){
      var params = this.$route.params;
      this.lessonNum = params.idx;
      this.lessonQuestionType = params.type;
      this.courseName = params.coursename;
      this.courseId = params.courseId;
      this.grade = params.grade;
      console.log(params.type);
      if(params.type=='PREVIEW'){
        this.typeValue = '课前预习'
      }else if(params.type=='SUMMARY'){
        this.typeValue = '课后总结'
      }else if(params.type=='EXPAND'){
        this.typeValue = '课后拓展'
      }
      this.getQuestion();
    },
    methods:{
      goback(){
      //  返回
        this.$router.go(-1);
      },
      //添加图文
      jumpAddImageText(){
        this.$router.push('/inputImageText/'+this.lessonQuestionType+'/'+this.courseId+'/'+this.lessonNum+'/'+this.grade+'/libraryhw/null');
      },
      //获取课节题
      getQuestion(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/question/course/get_question_for_course_lesson.do',
          param: {
            courseId:_this.courseId,
            lessonIndex:_this.lessonNum,
            lessonQuestionType:_this.lessonQuestionType
          },
          success: function (result) {
            if (result.code == 200&&result.result) {
              console.log(result.result);
              if(result.result.length>0){
                _this.lessonData = result.result[0];
                _this.detailQustionData = result.result[0].questionDataObject.info;
              }else{
                _this.lessonData = {};
                _this.detailQustionData =[];
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取套题失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //删除图文
      delQuestion(data) {
        console.log(data, "班级数据");
        var _this = this;
        this.$confirm('确定要删除这份图文内容嘛？', '删除图文', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //  删除调接口
          _this.request({
            method: 'post',
            url: '/question/course/update_question_for_course_lesson.do',
            param: {
              courseId:_this.courseId,
              lessonIndex:_this.lessonNum,
              lessonQuestionType:_this.lessonQuestionType,
              questionDataId:[]
            },
            success: function (result) {
              if (result.code == 200) {
                if (result.result) {
                  _this.getQuestion();
                }
              }else if(result.code==501){
                _this.$message.error('不能修改当前套题哦~');
              }
            },
            error: function (error) {
              //服务器异常
              _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        }).catch(() => {
          console.log("取消删除");
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  .header-tag{
    font-size:12px;
    color:#606060;
    line-height:24px;
    margin-top:8px;
    span{
      padding:5px 10px;
      background:#F5F5F5;
      border-radius:4px;
      margin-right:8px;
    }
  }
  .update-user{
    position:absolute;
    bottom:8px;
    right:26px;
    font-weight:400;
    color:#BDBDBD;
    font-size:12px;
  }
  .common-content{
    min-height:600px;
    overflow-y:auto;
    background:#fff;
    margin-bottom:80px;
    position:relative;
    .close-block{
      position:absolute;
      top:24px;
      right:24px;
      font-size:24px;
      color:#BDBDBD;
      cursor:pointer;
    }
    .close-block:hover{
      color:#F08D00;
    }
    .empty-content{
      text-align: center;
      margin: 0 auto;
      padding-top:70px;
      img{
        width:227px;
        height:193px;
        margin: 0 auto;
        display:block;
      }
      p{
        padding:36px 0 64px;
        font-size:16px;
        color:#BDBDBD;
        line-height:24px;
      }
    }
    .detail-content{
      padding:24px;
      h2{
        display:flex;
        align-items: center;
        font-size:16px;
        font-weight:500;
        color:#222222;
        line-height:24px;
        .title-span{
          width:4px;
          height:16px;
          background:#F08D00;
          border-radius:2px;
          display:block;
          margin-right:8px;
        }
      }
      /*年级*/
      .grade-block{
        margin-top:24px;
        p{
          font-size:14px;
          color:#606060;
          line-height:22px;
          float:left;
          margin-right:64px;
          display:flex;
          span{
            margin-right:16px;
            flex:1;
          }
        }
      }
      .grade-block:after{
        clear: both;
        content: '';
        display: block;
        width: 0;
        height: 0;
        visibility: hidden;
      }
      /*知识点*/
      .point-block{
        display:flex;
        align-items: top;
        margin-top:16px;
        font-size:14px;
        color:#606060;
        p{
          line-height:22px;
          margin-right:8px;
          margin-top:6px;
        }
        .point-item{
          line-height:20px;
          flex:1;
          span{
            padding:6px 8px;
            background:#F5F5F5;
            border-radius:4px;
            margin-right:4px;
            display:inline-block;
            margin-bottom:8px;
          }
        }
      }
      /*正文*/
      .detail-block{
        border:1px solid #EEEEEE;
        border-radius:2px;
        margin-top:10px;
        h2{
          font-size:14px;
          font-weight:500;
          color:#606060;
          line-height:48px;
          background:#F5F5F5;
          padding-left:24px;
        }
        .detail-item{
          padding:0 24px;
          .text-item{
            padding:16px 0;
            font-size:14px;
            color:#606060;
            line-height:22px;
          }
          .img-item{
            border-top:1px solid #eeeeee;
            padding:16px 0;
            img{
              height:104px;
            }
          }
          .audio-item{
            padding:16px 0;
            border-top:1px solid #eeeeee;
          }
          .video-block{
            border-top:1px solid #eeeeee;
            padding:16px 0;
            video{
              width:300px;
              border:1px solid #eeeeee;
            }
          }
        }
      }
    }
  }
</style>
