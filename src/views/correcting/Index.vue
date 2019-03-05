<template>
  <div>
    <el-container>
      <el-header class="auth-header statistics-header">
        <el-breadcrumb class="ziyue-breadcrumb">
          <router-link :to="{ path: '/manageIndex' }">首页</router-link>
          <span>/</span>
          <router-link :to="{ path: '/correcting' }">批改</router-link>
        </el-breadcrumb>
        <h4 class="auth-title">批改</h4>
        <el-tabs v-model="activeName" @tab-click="resetData" class="tabs-header">
          <el-tab-pane label="未批改" name="NOCORRECT"></el-tab-pane>
          <el-tab-pane label="已批改" name="CORRECT"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container class="management-content">
        <el-main>
          <div class="header-tool">
            <el-input
              debounce
              @change="searchEmployee"
              :placeholder="placeholder"
              v-model="searchText">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="main-organ" v-if="activeName=='NOCORRECT'">
            <el-table :data="nocorrectTableData">
              <el-table-column label="学生名">
                <template slot-scope="scope">
                  <span>{{scope.row.studentName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业名">
                <template slot-scope="scope">
                  <span>{{scope.row.homeworkName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName" label="作业内容">
                <template slot-scope="scope">
                  <span>{{ scope.row | questionTitleFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName" label="提交日期">
                <template slot-scope="scope">
                  <span>{{formatDate(scope.row.endTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="see-detail" @click="goCorrect(scope.row)" v-if="activeName=='NOCORRECT'">批改</span>
                </template>
              </el-table-column>
              <div slot="empty" v-if="searchText==''">
                <p>还没有需要批改的作业哦！</p>
              </div>
              <div slot="empty" v-if="searchText!=''">
                <p>没有你要找的作业哦！</p>
              </div>
            </el-table>
            <div class="block" v-if="nocorrectTotal!=0">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="nocorrectCurrectPage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="nocorrectTotal">
              </el-pagination>
            </div>
          </div>
          <div class="main-organ" v-if="activeName=='CORRECT'">
            <el-table :data="correctTableData">
              <el-table-column label="学生名">
                <template slot-scope="scope">
                  <span>{{scope.row.studentName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业名">
                <template slot-scope="scope">
                  <span>{{scope.row.homeworkName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName" label="作业内容">
                <template slot-scope="scope">
                  <span>{{ scope.row | questionTitleFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName" label="提交日期">
                <template slot-scope="scope">
                  <span>{{formatDate(scope.row.endTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="see-detail" @click="goCorrect(scope.row)" v-if="activeName=='CORRECT'">重新批改</span>
                </template>
              </el-table-column>
              <div slot="empty" v-if="searchText==''">
                <p>还没有需要批改的作业哦！</p>
              </div>
              <div slot="empty" v-if="searchText!=''">
                <p>没有你要找的作业哦！</p>
              </div>
            </el-table>
            <div class="block" v-if="correctTotal!=0">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="correctCurrectPage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="correctTotal">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {timeFormate} from '../../lib/date'

  export default {
    name: "Index",
    props: {
      userPermission: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        activeName: 'NOCORRECT', //NOCORRECT未批改  CORRECT已批改
        tableData: [],//表格
        nocorrectCurrectPage: 1,
        correctCurrectPage: 1,
        nocorrectTotal: 0,//未批改总数
        correctTotal: 0,//批改总数
        nocorrectTableData: [],
        correctTableData: [],
        searchText: '',//搜索文字
        placeholder: '搜索作业名/学生名',//搜索框placeholder
        currentTable: [],
        pageSize: 10, //一页多少条数据
      }
    },
    mounted() {
      //批改页面权限
      var activeName = localStorage.getItem("correct");
      if (activeName) {
        this.activeName = activeName;
      } else {
        this.activeName = 'NOCORRECT';
      }
      this.getNoCorrectData();
    },
    watch: {
      activeName(val) {
        console.log(val);
        this.currentTable = [];
        this.searchText = '';
        localStorage.setItem("correct", val);
        if (val == 'NOCORRECT') {
          this.nocorrectCurrectPage = 1;
          this.getNoCorrectData();
        } else {
          this.correctCurrectPage = 1;
          this.getCorrectData();
        }
      }
    },
    filters:{
      //作业显示的题目内容,eg: TPO2-阅读-Passage 1
      questionTitleFilter(item){
        console.log(item,"item");
        let show = '';
        let qtype = item.type?item.type.toUpperCase():'OTHER';
        switch(qtype){
          case 'SSAT':
            show = item.ssatPaperName;
            break;
          case 'SUBJECTIVE':
            show = '自定义主观题';
            break;
          default:
            if(qtype=='ALL'){
              show += '整套模考-';
              show += item.subjectName?item.subjectName.replace('_real_test','真题').toUpperCase():'other';
            }else{
              if(qtype=='READING'){
                show += '阅读-';
                show += item.subjectName?item.subjectName.replace('_real_test','真题').toUpperCase():'other';
                show += '-'+item.articleNum>0?'- Passage '+item.articleNum:'- ALL';
              }else if(qtype=='LISTENING'){
                show += '听力-';
                show += item.subjectName?item.subjectName.replace('_real_test','真题').toUpperCase():'other';
                show += '-'+item.otherData.toUpperCase();
              }else if(qtype=='SPEAKING'){
                show += '口语-';
                show += item.subjectName?item.subjectName.replace('_real_test','真题').toUpperCase():'other';
                show += '-'+item.otherData;
              }else{
                show += '写作-';
                show += item.subjectName?item.subjectName.replace('_real_test','真题').toUpperCase():'other';
                show += '-'+item.otherData;
              }

            }

            break;
        }

        return show;
      }
    },
    methods: {
      formatDate(time) {
        return timeFormate(time)
      },
      //点击tab 重置搜索框，日期
      resetData() {
        this.searchText = "";
      },
      handleCurrentChange(val) {//currentPage 改变时会触发  第几页
        if (this.activeName == 'NOCORRECT') {
          this.nocorrectCurrectPage = val;
          this.getNoCorrectData();
        } else {
          this.correctCurrectPage = val;
          this.getCorrectData();
        }
      },
      //获取未批改列表
      getNoCorrectData() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-homework/correct/get_correct_list.do',
          param: {
            "query": _this.searchText,
            "ifCorrect": false,
            "page": _this.nocorrectCurrectPage,
            "rows": _this.pageSize
          },
          success: function (result) {
            console.log(result.result);
            if (result.code == 200) {
              if (result.result) {
                var data = result.result;
                _this.nocorrectTableData = data.data;
                _this.currentTable = data.data;
                _this.nocorrectTotal = data.total;
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
      //获取批改列表
      getCorrectData() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-homework/correct/get_correct_list.do',
          param: {
            "query": _this.searchText,
            "ifCorrect": true,
            "page": _this.correctCurrectPage,
            "rows": _this.pageSize
          },
          success: function (result) {
            console.log(result.result);
            if (result.code == 200) {
              if (result.result) {
                var data = result.result;
                _this.correctTableData = data.data;
                _this.currentTable = data.data;
                _this.correctTotal = data.total;
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
      //搜索
      searchEmployee(val) {
        this.searchText = val;
        if (this.activeName == 'NOCORRECT') {
          this.nocorrectCurrectPage = 1;
          this.getNoCorrectData();
        } else {
          this.correctCurrectPage = 1;
          this.getCorrectData();
        }
      },
      goCorrect(data) {
        console.log(data, "批改");
        if (data.type == 'SUBJECTIVE') {
          this.$router.push("/correctingsubject/score/" + data.homeworkRecordId);
        }else{
          //模考口语、写作的批改地址
          let mockPiUrl = '';
          if(data.type == 'SPEAKING'){
            mockPiUrl = '/mock/pages/home/#/ScoreDetail/speaking/'+data.examIdentity+'/'+new Date(data.endTime).toISOString()+'/'+data.subjectName+'/'+data.studentName+'/speaking';
          }else if(data.type == 'WRITING'){
            mockPiUrl = '/mock/pages/home/#/ScoreDetail/writing/'+data.examIdentity+'/'+new Date(data.endTime).toISOString()+'/'+data.subjectName+'/'+data.studentName+'/writing';
          }

          var xiLoginToken = localStorage.getItem("token");
          let tmpHref = '';
          if(location.host.indexOf('preinner.topschool.com')!=-1){ //预发环境
            tmpHref =  'http://preopen.topschool.com/pclogin?xiLoginToken='+xiLoginToken+'&xipage='+ encodeURIComponent(mockPiUrl);
          }else if(location.host.indexOf('x.topschool.com')!=-1){ //线上环境
            tmpHref =  'http://xi.topschool.com/pclogin?xiLoginToken='+xiLoginToken+'&xipage='+encodeURIComponent(mockPiUrl);
          }

          window.open(tmpHref);
        }

      }
    }
  }
</script>

<style scoped lang="scss">
  .header-tool {
    display: flex;
    float: right;
    width: 220px;
    margin-bottom: 10px;
  }

  .auth-header {
    height: auto !important;
    position: relative;
    padding: 24px 24px 0 24px;
    background: #fff;

  }

  .auth-title {
    font-size: 20px;
    margin: 12px 0;
    line-height: 1.4;
    color: #262626;
  }

  /*content*/
  .management-content {
    margin: 24px;
    background: #fff;
  }

  .see-detail {
    color: #F08D00;
    cursor: pointer;
  }

  .block .el-pagination {
    text-align: right;
    padding-top: 10px;
  }
</style>
<style>
  .tabs-header .el-tabs__header {
    margin-bottom: 0;
  }
</style>

