<template>
  <div class="export-lesson">
    <!--<el-container>-->
      <div class="export-header">
        <div class="ziyue-breadcrumb">
          <router-link :to="{ path: '/manageIndex' }" class="active">首页</router-link>
          <span>/</span>
          <router-link :to="{path:'/timetable'}" class="active">课程表</router-link>
          <span>/</span>
          <router-link :to="{path:''}">导出课表</router-link>
        </div>
        <h4 class="export-title">导出课表</h4>

        <el-form :inline="true">
          <el-form-item label="导出： ">
            <el-radio-group v-model="radioExportType" size="small">
              <el-radio-button label="班级课表"></el-radio-button>
              <el-radio-button label="老师课表"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div></div>
          <template v-if="ifClassSearch==false">
            <el-form-item label="老师： ">
              <el-select v-model="searchId" filterable placeholder="搜索老师" filterable size="small">
                <el-option
                  v-for="item in teacherList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="班级： ">
              <el-select v-model="searchId" filterable placeholder="搜索班级" filterable size="small">
                <el-option
                  v-for="item in classList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <el-form-item label="时间范围： ">
            <el-date-picker
              v-model="searchDate" size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchFun" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="operation-box">
        <el-form :inline="true">
          <el-form-item label="日历展示： ">
            <el-radio-group v-model="radioOnlyLesson" size="small">
              <el-radio-button label="全日期"></el-radio-button>
              <el-radio-button label="仅有课"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="float: right;">

            <el-button plain type="primary" size="small" @click.native="saveAsImg">导出</el-button>
            <a id="j_download_img" href="" target="_blank" :download="searchName+'.png'" style="display: none;">下载</a>
            <el-button type="primary" size="small" @click.native="printFun">打印</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pagination-box">
        <!--<el-pagination-->
          <!--background-->
          <!--@size-change="handleSizeChange"-->
          <!--@current-change="handleCurrentChange"-->
          <!--:current-page.sync="currentPage"-->
          <!--:page-size="14"-->
          <!--layout="total, pager"-->
          <!--:total="16">-->
        <!--</el-pagination>-->
      </div>
      <div class="canvas-box" id="j_canvas_origin">
        <template v-if="ifClassSearch">
          <!--班级课表-->
          <div class="lesson-user-box" style="margin-bottom: 20px;">
            <div class="title-left">
              <p class="teacher-title">{{searchName}}的课表</p>
              <p class="sub-color-box">
                <span class="sub-color-item" v-for="(sub,idx) in classSubjectList" :key="idx"><span class="color-gap" :style="{background:sub.color}"></span>{{sub.nameShow}}</span>
              </p>
            </div>
            <div class="title-year">
              <span>{{calendarTitleYear}}</span>
              <img class="title-year-img" src="../../../static/topschool.png" alt="">
            </div>
          </div>
          <div class="xi-fullcalendar lesson-list-box">
            <event-class :classAmMaxCount="classAmMaxCount" v-for="(obj,o) in lessonDataPage" :eventItem="obj" :dayIndex="o" :classSubjectList="classSubjectList" :key="o"></event-class>
          </div>
        </template>
        <template v-else>
          <!--老师课表-->
          <div class="lesson-user-box">
            <div class="title-left">
              <p class="teacher-title">{{searchName}}的课表</p>
              <!--<p>互帮月阅读讲解、楼洁敏SAT阅读、月考试定制版0915阅读 等13个班级</p>-->
            </div>
            <div class="title-year">
              <span>{{calendarTitleYear}}</span>
              <img class="title-year-img" src="../../../static/topschool.png" alt="">
            </div>
          </div>
          <div class="xi-fullcalendar lesson-list-box">
            <event-teacher v-for="(obj,o) in lessonDataPage" :eventItem="obj" :key="o"></event-teacher>
          </div>
        </template>
      </div>
      <div id="j_print_box" style="display: none;">
        <img ref="print" :src="printImgUrl" id="j_canvas_img" alt="">
      </div>

    <!--</el-container>-->
  </div>
</template>

<script>
  import myHtml2Canvas from '../../lib/html2canvas'
  import EventTeacher from './EventComponent.vue'  //老师课表的组件
  import EventClass from './EventClassComponent.vue' //班级课表的组件

	export default{
		name: 'ExportLesson',
		props: [],
    components: {EventTeacher,EventClass},
		data(){
			return {
        radioExportType:'老师课表', //导出的课表类型(是班级课表还是老师课表)
        ifClassSearch:false, //true--搜索的是班级课表;false--搜索的老师课表

        searchId:'', //搜索框对应的id
			  searchName:'', //搜索框显示的文案
        searchDate:'',//时间范围
        searchStart:'', //搜索的开始时间
        searchEnd:'', //搜索的结束时间
        calendarTitleYear:new Date().getFullYear(), //课表日历背景显示的年份
        teacherList:[], //老师列表-- for 搜索 {value:1,label:'名字'}
        classList:[], //老师列表--for 搜索
        radioOnlyLesson:'全日期', // 日历展示 全日期 or 仅有课
        ifFull:true, //true--全日期,false--仅有课
        currentPage: 1, //当前第几页

        //这个返回的数据,需要一次返回14天,分两行显示
        lessonDataPage:[], //显示的课表数据
        classSubjectList:[], //班级课表的科目列表
        subjectColorList:['#D58B8B','#DCA86D','#7A8FCC','#8FAE97','#AA91C2'], //科目颜色列表
        classAmMaxCount:[], //班级课表时,上午课节最长的个数 分两行,因为最多显示14天
        printImgUrl:'', //要打印的课表的图片地址(base64)
      }
		},
    mounted(){
		  this.getTeacherList();
      this.getClassList();
    },
    watch:{
      //导出的课表类型(班级、老师)更换
      radioExportType(val,old){
        console.log('warch  ExportType  ',val)
        this.ifClassSearch = !this.ifClassSearch; //true--搜索的班级课表;false--搜索的老师课表

        //清空之前的数据
        this.searchId = '';
        this.searchName = ''; //切换导出的课表类型后,搜索框要清空
        this.searchDate = '';
        this.searchStart = '';
        this.searchEnd = '';
        this.lessonDataPage = [];
        this.classSubjectList = [];
        this.printImgUrl = '';
        this.calendarTitleYear = new Date().getFullYear();
        this.classAmMaxCount = [];
      },

      //全日期 or 仅有课
      radioOnlyLesson(val,old){
        this.ifFull = !this.ifFull;
        this.searchFun(); //调用查询方法
      },

      searchId(val,old){
        console.log(val,'   searchId')
        if(val){
          let obj = {};
          if(this.ifClassSearch){
            obj = this.classList.find((item)=>{
              return item.value === val;
            });
          }else{
            obj = this.teacherList.find((item)=>{
              return item.value === val;
            });
          }
          this.searchName = obj.label;

        }
      },

      //搜索的实际范围
      searchDate(val,old){
        // val [Date,Date]
        // eg:[Mon Oct 15 2018 00:00:00 GMT+0800 (中国标准时间),Fri Oct 26 2018 00:00:00 GMT+0800 (中国标准时间)]
        console.log(val,' searchDate ')
        if(val) {
          this.searchStart = val[0].getTime();
          this.searchEnd = val[1].getTime();
          this.calendarTitleYear = val[0].getFullYear();
        }
      }


    },
		methods: {

		  //获取所有的老师列表
		  getTeacherList(){
        let _this = this;
        _this.request({
          url: '/p-pk/curriculum/get_all_teacher.do',
          param: {},
          method: 'post',
          success: function (data) {
            if (data.code == 200) {
              if (data.result && data.result.length>0) {
                _this.teacherList = data.result;
              }
            }
          },
          error:function (err) {
            console.log(err);
            _this.$message.error('获取老师列表失败,刷新页面重试');
          }
        });
      },

      //获取所有的班级列表
      getClassList(){
        let _this = this;
        _this.request({
          url: '/p-pk/curriculum/get_all_class.do',
          param: {},
          method: 'post',
          success: function (data) {
            if (data.code == 200) {
              if (data.result && data.result.length>0) {
                _this.classList = data.result;
              }
            }
          },
          error:function (err) {
            console.log(err);
            _this.$message.error('获取班级列表失败,刷新页面重试');
          }
        });
      },

      //查询课表接口
      searchFun(){

        let _this = this;

        //默认查询老师课表
        let url = '/p-pk/curriculum/get_curriculum_schedule_for_teacher.do';
        let param = {
          teacherId:_this.searchId,
          before:_this.searchStart,
          after:_this.searchEnd,
          ifFull:_this.ifFull
        };
        if(_this.ifClassSearch){ //查询班级课表
          url = '/p-pk/curriculum/get_curriculum_schedule_for_class.do';
          param = {
            classId:_this.searchId,
            before:_this.searchStart,
            after:_this.searchEnd,
            ifFull:_this.ifFull
          };
        }

        _this.request({
          url: url,
          param: param,
          method: 'post',
          success: function (data) {
            if (data.code == 200 && data.result) {
              if(_this.ifClassSearch) { //查询班级课表
                if(data.result.dayInfos){

                  let tmpClassAmMaxCount = [];

                  let tmpMaxAmCount = 1; //默认am有几节课
                  for(var dl in data.result.dayInfos){
                    dl = parseInt(dl);
                    console.log(dl,'  dl');
                    let eventObj = data.result.dayInfos[dl];
                    if(eventObj && eventObj.lessons) {
                      let objLength = 0;
                      if(eventObj.lessons.am){
                        objLength = eventObj.lessons.am.length || 0;
                      }

                      if (objLength > tmpMaxAmCount) {
                        tmpMaxAmCount = objLength;
                      }

                      if(_this.ifFull){ //全日期
                        if(dl%7==6){ //每一行最后一个,一行显示7个
                          tmpClassAmMaxCount.push(tmpMaxAmCount);
                          tmpMaxAmCount = 1;

                          console.log(tmpClassAmMaxCount,'  全日期');
                        }
                      }else{
                        //仅有课
                        if(dl%7==6 || dl==data.result.dayInfos.length-1){ //每一行最后一个,一行显示7个
                          tmpClassAmMaxCount.push(tmpMaxAmCount);
                          tmpMaxAmCount = 1;

                          console.log(tmpClassAmMaxCount,'  仅有课');
                        }
                      }

                    }
                  }//end for

                  _this.classAmMaxCount = tmpClassAmMaxCount;
                  console.log(_this.classAmMaxCount,'  classAmMaxCount');
                  _this.lessonDataPage = data.result.dayInfos;

                }
                if(data.result.subjectMessages){
                  let tmpSubList = [];
                  for(let j=0;j<data.result.subjectMessages.length;j++){
                    let tmpSubObj = data.result.subjectMessages[j];
                    let subItemName = tmpSubObj.subjectName.toString();
                    let tmpSubColor = {};
                    if(j<5){
                      tmpSubColor = {'name':subItemName,'nameShow':subItemName+' '+tmpSubObj.teacherName+' '+tmpSubObj.classHour+'h','color':_this.subjectColorList[j]}
                    }else{
                      tmpSubColor = {'name':subItemName,'nameShow':subItemName+' '+tmpSubObj.teacherName+' '+tmpSubObj.classHour+'h','color':'#909090'}
                    }
                    tmpSubList.push(tmpSubColor);
                  } // end for
                  _this.classSubjectList = tmpSubList

                }
                this.searchName = data.result.className || '';

              }else{
                // 老师课表
                _this.lessonDataPage = data.result;
              }

              setTimeout(() => {
                //每次查询接口后,都要自动绘成新的canvas img
                _this.transHtml2Img();
              }, 1000);

            }else{
              _this.printImgUrl='';
              _this.$message.error(data.message);
            }
          },
          error:function (err) {
            console.log(err);
            _this.printImgUrl='';
            _this.$message.error('查询课节列表失败,刷新页面重试');
          }
        });

      },

      //html-to-canvas Img
      transHtml2Img(){
        let _this = this;

        let content_html = document.getElementById('j_canvas_origin');　　　　//要转化的div
        let width = 1075; //content_html.offsetWidth;
        let height = 1568; //content_html.offsetHeight;
        let offsetTop = content_html.offsetTop;
        let canvas = document.createElement("canvas");
        let context = canvas.getContext('2d');

        // 屏幕的设备像素比
        let devicePixelRatio = window.devicePixelRatio || 1;

        // 浏览器在渲染canvas之前存储画布信息的像素比
        let backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio ||  context.backingStorePixelRatio || 1;

        // canvas的实际渲染倍率
        let scaleBy = devicePixelRatio / backingStoreRatio;

        canvas.width = width*scaleBy;
        canvas.height = (height)*scaleBy;
        context.scale(scaleBy,scaleBy);
        var opts = {
          allowTaint:true,//允许加载跨域的图片
          tainttest:true, //检测每张图片都已经加载完成
          scale:scaleBy, // 添加的scale 参数
          canvas:canvas, //自定义 canvas
          logging: false, //日志开关，发布的时候记得改成false
          width:width, //dom 原始宽度
          height:height //dom 原始高度
        };
        myHtml2Canvas(content_html,opts).then(function (canvas) {

          canvas.style.width = width+'px';
          canvas.style.height = height+"px";
          _this.printImgUrl = canvas.toDataURL("image/png");

          //显示预览图
          document.getElementById('j_canvas_img').setAttribute('src',  _this.printImgUrl);
          document.getElementById('j_canvas_img').style.width=canvas.width/scaleBy+'px';
          document.getElementById('j_canvas_img').style.height=canvas.height/scaleBy+'px';

          //debug 上线的时候,需要隐藏掉代码
          //document.getElementById('j_print_box').style='display:block'; //要打印的图片容器 显示出来  opacity:1

        });
      },

      //导出为图片
      saveAsImg(){
        let _this = this;
        document.getElementById('j_download_img').setAttribute('href', _this.printImgUrl);
        document.getElementById('j_download_img').click();
      },

      //打印
      printFun(){
        let _this = this;
        let img = new Image(); //多加这个img.onload是为了避免在钉钉里面打印的时候,打印空白
        img.src = _this.printImgUrl;
        img.onload = function () {
          console.log('print img onload')
          setTimeout(function () {
            _this.$print(_this.$refs.print)
          },500);
        };
      },

      //分页相关
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

    }
	}
</script>

<style lang="scss" scoped>
  .export-header{
    background: #fff;
    padding:18px 48px 18px 24px;
    .auth-title {
      font-size: 20px;
      margin: 12px 0;
      line-height: 1.4;
      color: #262626;
    }

    .auth-discript {
      font-size: 14px;
      line-height: 1.57;
      color: #606060;
    }
    .btn-export{
      position: absolute;
      top: 46px;
      right: 48px;
    }

    .export-title{
      font-size:20px;
      color:#262626;
      line-height: 28px;
      padding-bottom: 8px;
    }
  }

  /*导出、打印操作*/
  .export-lesson .operation-box{
    margin:24px;
    padding:24px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .el-form-item{
      margin-bottom: 0!important;
    }
  }

  /*分页*/
  .export-lesson .pagination-box{
    margin:24px 24px 14px;
  }

  /*要导出的canvas-box*/
  .export-lesson .canvas-box{
    margin:0 24px;
    background: #fff;

    .lesson-user-box{
      display: flex;
      display: -webkit-flex;
      align-items:center;
      padding:15px 32px 32px;
      border-bottom:2px solid #f7f7f7;

      .title-left{
        flex: 1;
        font-size:14px;
        color:#c0c0c0;;

        .teacher-title{
          font-size:24px;
          color:#363647;
          font-weight: bold;
          border-left:8px solid #F08D00;
          line-height: 22px;
          padding-left:12px;
          margin-top: 16px;
        }

        .sub-color-box{
          padding-top:15px;
          .sub-color-item{
            font-size:14px;
            color:#c0c0c0;
            padding:4px 24px 4px 0;
            line-height: 14px;
            display: inline-block;
            vertical-align: middle;
            .color-gap{
              width:14px;
              height: 14px;
              display: inline-block;
              vertical-align: middle;
              background:#909090;
              border-radius: 2px;
              margin-right:8px;
            }
          }
        }
      }
      .title-year{
        width:200px;
        text-align: right;
        font-family: "Helvetica Neue",sans-serif;
        font-size:70px;
        color:#EAEAF2;
        font-weight:bold;
        line-height: 70px;
        position:relative;
        /*background:url(../../../static/topschool.png) left bottom -20px no-repeat;*/
        /*background-size:180px 56px;*/

        span{
          position: relative;
          top:0;
          right:0;
          z-index: 401;
        }
        .title-year-img{
          height: 56px;
          position: absolute;
          top:30px;
          left:-18px;
          z-index: 402;
        }
      }
    }

    .lesson-list-box{
      padding: 0 32px 50px;
      background: #fff;
      /*padding: 0 32px 297px;*/
      /*background: url(../../../static/schedulebg.png) bottom center no-repeat #fff;*/
      /*background-size:contain;*/
    }
  }

</style>
<style lang="scss">
  @import "../../style/xifullcalendar.css";
  .export-header {

    .el-input__inner {
      width: 210px !important;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 255px !important;
    }

  }

  .lesson-list-box .cus-event-item {
      border:1px solid #f9f9f9!important;
  }
</style>
