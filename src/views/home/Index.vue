<template>
    <div class="home">
      <el-header class="common-header" style="height:0">
        <el-breadcrumb class="ziyue-breadcrumb">
          <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        </el-breadcrumb>
      </el-header>
      <div class="header-home">
        <div class="header-avater">
          <img :src="userData.dingTalkHeadUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'" alt="">
          <span>你好，{{userData.dingTalkNickName}}老师，要开心每一天哦！</span>
        </div>
      </div>
      <div class="home-main">
        <div class="home-title">
          <p>你有<span>{{correctTotal}}</span>份作业需要批改</p>
          <router-link :to="{path:'/classManage'}" class="history-homework">历史作业</router-link>
        </div>
        <div class="table-main">
          <el-table :data="correctHomeworkData" style="width: 100%">
            <el-table-column label="学生" min-width="15%">
              <template slot-scope="scope">
                <span>{{scope.row.studentName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程" min-width="20%">
              <template slot-scope="scope">
                <span>{{scope.row.courseName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="班级" min-width="20%">
              <template slot-scope="scope">
                <span>{{scope.row.className}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课节" min-width="15%">
              <template slot-scope="scope">
                <span>{{scope.row.lessonName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="老师" min-width="10%">
              <template slot-scope="scope">
                <span>{{scope.row.teacherName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <router-link class="option-button" :to="{path:'/correctDetail/'+scope.row.homeworkRecordId+'/'+scope.row.studentName+'/'+scope.row.courseName}">批改</router-link>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>还没有要批改的作业哦！</p>
            </div>
          </el-table>
          <div class="block" v-if="correctTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="correctTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "Index",
      data(){
        return{
          userData:{},
          page:1,
          pageSize:10,
          correctTotal:0,
          correctHomeworkData:[],//未批改的作业
        }
      },
      mounted(){
        this.getuserData();
        this.getRelatedHomework();
      },
      methods:{
        handleCurrentChange(val){
          this.page = val;
          this.getRelatedHomework();
        },
        getuserData(){
          var _this = this;
          _this.request({
            method:'post',
            url: '/user/get_user_message.do',
            param: {},
            success: function (result) {
              console.log(result,"ddd");
              if(result.code == 200){
                var data = result.result;
                _this.userData = data;
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
            }
          })
        },
        //  获取未批改的作业
        getRelatedHomework(){
          var _this = this;
          _this.request({
            method:'post',
            url: '/manage/homework/list_homework_record.do',
            param: {"pageNum":_this.page,"pageSize":_this.pageSize},
            success: function (result) {
              console.log(result,"ddd");
              if(result.code == 200){
                var data = result.result;
                _this.correctHomeworkData = data.infoList;
                _this.correctTotal = data.total;
                console.log(data,"未批改的作业");
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .home{
    position:relative;
    .header-home{
      padding-left:32px;
      background:#fff;
      .header-avater{
        padding:16px 0;
        height:64px;
        line-height:64px;
        img{
          width:64px;
          height:64px;
          border-radius:50%;
          float:left;
        }
        span{
          float:left;
          margin-left:16px;
          font-size:20px;
          color:#262626;
        }
      }
    }
    .home-main {
      margin:24px;
      background:#fff;
      border-radius:8px;
      .home-title{
        display:flex;
        padding:16px 32px;
        border-bottom:1px solid #F0F0F0;
        p{
          flex:1;
          font-size:16px;
          font-weight:500;
          color:#262626;
          line-height:24px;
          span{
            color:#F08D00;
          }
        }
        .history-homework{
          font-size:14px;
          color:#F08D00;
          line-height:22px;
        }
      }
      .table-main{
        padding:28px 24px;
        .option-button{
          color:#F08D00;
        }
      }
    }
  }
  .block{
    margin-top:10px;
    text-align: right;
  }
</style>
