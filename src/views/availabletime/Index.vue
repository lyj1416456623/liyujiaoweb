<template>
  <el-container>
    <el-header class="el-menu-xi">
      <div class="menu">
        <img src="//onlinetest-public.oss-cn-beijing.aliyuncs.com/xiniao/xi-logo.png" class="header-logo">
        <div class="header-photo">
          <div class="el-dropdown-link">
            <img :src="userData.avatar||'//ts-dingup-onlinetest.oss-cn-beijing.aliyuncs.com/img/home/default.png'">
            <div class="header-name">{{userData.userName}}</div>
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <div class="available-content">
        <h2 class="available-title">可用时间查询
          <el-popover
            placement="top"
            width="296"
            trigger="hover"
          >
            <div class="available-popover">
              <p class="title-discript">1、你可以选择一个老师或一个科目查看他们的可用时间<br>2、可用时长不同会有不同的样式</p>
              <div class="available-popover-block">
                <div class="available-popover-item">
                  <p class="popover-time">2h</p>
                  <p class="popover-time-discript"> >2h</p>
                </div>
                <div class="available-popover-item">
                  <p class="popover-time popover-time-half">1.5h</p>
                  <p class="popover-time-discript"> 1h-2h</p>
                </div>
                <div class="available-popover-item">
                  <p class="popover-time popover-time-little">0.5h</p>
                  <p class="popover-time-discript"> <1h</p>
                </div>
              </div>
            </div>
            <i class="iconfont icon-bangzhu1" slot="reference" style="font-size:18px;color:#C0C0C0;cursor: pointer"></i>
          </el-popover>
        </h2>
        <div class="available-container">
          <div class="available-container-block">
            <el-form :model="formAvailable" label-position="left">
              <el-form-item label="科目:" label-width="48px">
                <el-select v-model="subjectId" filterable placeholder="请选择科目" style="width: 320px;">
                  <el-option
                    v-for="item in subjectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="老师:" label-width="48px">
                <el-select v-model="teacherId" filterable placeholder="请选择老师" style="width: 320px;">
                  <el-option
                    v-for="item in teacherList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期">
                <span style="color:#909090">（已选{{dateList.length}}天）</span>
                <Calendar ref="Calendar" :sundayStart="true" :markDate="dateList" :agoDayHide="beforeTime"
                          v-on:choseDay="clickDay"
                          v-on:changeMonth="changeDate"
                          :textTop="topText" class="available-calender"></Calendar>
              </el-form-item>
              <el-form-item label="时间范围：">
                <div class="block" style="margin-top:40px;">
                  <el-slider
                    v-model="timeRange"
                    range
                    show-stops
                    :format-tooltip="formatTooltip"
                    :max="23">
                  </el-slider>
                </div>
              </el-form-item>
              <el-form-item style="text-align: right;margin-top:35px">
                <el-button type="primary" @click="onSubmit" :disabled="!searchFlag">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="available-container-block available-result">
            <template v-if="!resultFlag">
              <div class="available-search">
                <img src="http://xiniao.oss-cn-beijing.aliyuncs.com/img/avaliabletime.png" alt="">
                <p>查看科目或某一个老师的可用时间</p>
              </div>
            </template>
            <template v-if="resultFlag">
              <h2 class="result-title"><span v-if="subjectName!=''&&teacherName==''">{{subjectName}}老师</span><span v-if="teacherName!=''">{{teacherName}}老师</span>的可用时间（{{startTime}}～{{endTime}}）</h2>
              <template v-if="subjectResult.length==0">
                <div class="available-search">
                  <img src="http://xiniao.oss-cn-beijing.aliyuncs.com/img/avaliableman.png" alt="">
                  <p>现在没有老师教{{subjectName}}哦！</p>
                </div>
              </template>
              <div class="available-result-block" v-for="item in subjectResult" v-if="subjectResult.length>0">
                <h3>{{item.month}}</h3>
                <div class="available-result-item" v-for="dayItem in item.data">
                  <p>{{dayItem.day}}日<span v-if="teacherName==''">·{{dayItem.teacherName}}</span></p>
                  <div class="popover-time-block">
                    <div class="popover-time-item" v-for="hourItem in dayItem.timeIntervals" v-if="dayItem.timeIntervals.length>0">
                      <span class="popover-time" v-if="hourItem.hour>=2">{{hourItem.hour}}h</span>
                      <span class="popover-time popover-time-half" v-if="hourItem.hour<2&&hourItem.hour>=1">{{hourItem.hour}}h</span>
                      <span class="popover-time popover-time-little" v-if="hourItem.hour<1">{{hourItem.hour}}h</span>
                      {{hourItem.hourBefore}}～{{hourItem.hourAfter}}
                    </div>
                    <p v-if="dayItem.timeIntervals.length==0">这天老师请假了哦！</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-container>
  </el-container>
</template>
<script>
  import Calendar from '../../vue-calendar-component/index';
  //昨天
  var day1 = new Date();
  day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
  export default {
    name: "Index",
    data() {
      return {
        resultFlag:false,
        userData: {},
        formAvailable: {},
        subjectId: 0,
        teacherId: '',
        timeRange:[8,22],
        beforeTime: new Date(day1).getTime().toString().substr(0,10),
        topText: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        dateList: [],//日期列表
        subjectList: [],//科目列表
        teacherList: [],//老师列表
        subjectResult:{},//查询结果
        teacherObj:{},//老师对象
        teacherName:"",//老师
        startTime:"",//开始时间
        endTime:"",//结束时间
        subjectName:"",//科目名称
        subjectListObj:{},//科目对象
      }
    },
    components: {Calendar},
    created(){
      var params = this.$route.params;
      localStorage.setItem("token",params.token);
    },
    mounted() {
      // this.getuserData();
      // this.getAllSubject();
      // this.getTeacherList();
    },
    watch:{
      subjectId(val){
        this.teacherId = "";
        this.getTeacherList();
      }
    },
    methods: {
      formatTooltip(val){
        return val+':00';
      },
      clickDay(data) {
        data = data.replace(/\//g,"-");
        console.log(data, "选中某天"); //选中某天
        var dateList = [];
        if (this.dateList.length > 0) {
          for (var i = 0; i < this.dateList.length; i++) {
            if (this.dateList[i] != data) {
              dateList.push(this.dateList[i]);
            }
          }
        } else {
          dateList.push(data);
        }
        if (dateList.length == this.dateList.length) {
          this.dateList.push(data);
        } else {
          this.dateList = JSON.parse(JSON.stringify(dateList));
        }
      },
      changeDate(data) {
        console.log(data); //左右点击切换月份
      },
      clickToday(data) {
        console.log(data); //跳到了本月
      },
      //获取用户信息
      getuserData() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/user/get_user_message.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
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
      getAllSubject(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-pk/auxiliary/get_all_sys_subjects.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              var data = result.result;
              _this.subjectList = data;
              for(var i =0;i<data.length;i++){
                _this.subjectListObj[data[i].value] = data[i];
              }
              _this.subjectList.unshift({"label":"全部","value":0});
              console.log(_this.subjectList,"sullll");
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      },
      getTeacherList(){
        var _this = this;
        var data = {};
        if(_this.subjectId != 0){
          data.subjectId = _this.subjectId;
        }
        _this.request({
          method: 'post',
          url: '/p-pk/auxiliary/get_teacher_by_subject_id.do',
          param: data,
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              var data = result.result;
              _this.teacherList = data;
              for(var i =0;i<data.length;i++){
                _this.teacherObj[data[i].value] = data[i];
              }
              console.log(_this.teacherObj,"老师");
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      },
      //格式化时间
      formatTime(val){
        if(val>=10){
          return val+":00:00";
        }else{
          return "0"+val+":00:00";
        }
      },
      //查询
      onSubmit(){
        var _this = this;
        console.log(_this.formatTime(_this.timeRange[0]),_this.formatTime(_this.timeRange[1]),"时间");
        var data = {
          "day":_this.dateList,
          "before":_this.formatTime(_this.timeRange[0]),
          "after":_this.formatTime(_this.timeRange[1])
        }
        if(_this.subjectId != 0){
          data.sysSubjectId = _this.subjectId;
        }
        if(_this.teacherId!=""){
          data.teacherId = _this.teacherId;
        }
        console.log(data,"时间");
        _this.request({
          method: 'post',
          url: '/p-pk/auxiliary/get_teacher_available_time.do',
          param: data,
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              _this.subjectResult = result.result;
              _this.resultFlag = true;
              _this.startTime = _this.formatTooltip(_this.timeRange[0]);
              _this.endTime =  _this.formatTooltip(_this.timeRange[1]);
              if(_this.teacherId!=""){
                _this.teacherName = _this.teacherObj[_this.teacherId].label;
              }
              console.log(_this.teacherName);
              if(_this.subjectId!=0){
                _this.subjectName = _this.subjectListObj[_this.subjectId].label;
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      }
    },
    computed:{
      searchFlag(){
        if(this.subjectId!= 0 && this.dateList.length>0){
          return true;
        }else if(this.subjectId == 0 &&this.teacherId!='' && this.dateList.length>0){
          return true;
        }else{
          return false;
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .menu {
    width: 1154px;
    margin: 0 auto;
    line-height: 60px;
    .header-logo {
      width: 100px;
      float: left;
      margin-top: 15px;
      margin-right: 52px;
    }
    .el-menu-demo {
      width: auto !important;
      float: left;
    }
    .header-photo {
      float: right;
      cursor: pointer;
      img {
        width: 32px;
        height: 32px;
        float: left;
        border-radius: 16px;
        display: block;
        margin-top: 16px;
        margin-right: 8px;
      }
      .header-name {
        float: left;
      }
    }
  }

  .menu:after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
    visibility: hidden;
  }

  /*中间内容*/
  .available-content {
    padding: 10px;
    width: 1154px;
    margin: 0 auto;
    .available-title {
      font-size: 20px;
      font-weight: 500;
      color: #262626;
      line-height: 28px;
      margin: 12px 0;
    }
    .available-container {
      width: 100%;
      height: 795px;
      display: flex;
      .available-container-block {
        padding: 24px;
        width: 424px;
        height: 100%;
        background: #fff;
        margin-right: 8px;
        border-radius: 2px;
        box-sizing: border-box;
        .available-calender{
          border:1px solid #E8E8E8;
        }
      }
      .available-result {
        width: 720px;
        margin-right: 0;
        overflow-y:auto;
        .available-search{
          width:242px;
          height:272px;
          margin:214px auto 0;
          img{
            width:175px;
            display:block;
            margin:0 auto;
          }
          p{
            margin-top:48px;
            text-align: center;
            font-size:16px;
            color:#C0C0C0;
            line-height:24px;
          }
        }
        .result-title{
          font-size:16px;
          font-weight:500;
          color:#262626;
          line-height:24px;
          margin-bottom:20px;
        }
        .available-result-block{
          margin-bottom:24px;
          border:1px solid #e8e8e8;
          border-radius:2px;
          h3{
            padding:12px 0 12px 20px;
            background:#FAFAFA;
            font-size:16px;
            font-weight:400;
            color:#262626;
            line-height:22px;
            border-bottom:1px solid #e8e8e8;
          }
          .available-result-item{
            padding:16px 24px 0;
            .popover-time-block{
              font-size:16px;
              font-weight:400;
              color:#262626;
              line-height:24px;
              padding-bottom:16px;
              border-bottom:1px solid #e8e8e8;
              p{
                margin-top:16px;
                color:#C0C0C0;
                font-size:16px;
                line-height:24px;
              }
              .popover-time-item{
                float:left;
                margin-right:58px;
                margin-top:16px;
              }

            }
            .popover-time-block:after{
              clear: both;
              content: '';
              display: block;
              width: 0;
              height: 0;
              visibility: hidden;
            }
            .popover-time-block:last-child{
              border:0;
            }
          }
          .popover-time {
            margin: 0 auto;
            width: 48px;
            height: 24px;
            font-size: 16px;
            font-weight: 400;
            color: #F08D00;
            line-height: 24px;
            background: #F0ECFD;
            border-radius: 2px;
            display:inline-block;
            text-align: center;
            margin-right:8px;
          }
          .popover-time-half {
            background: none;
            border-bottom: 12px solid #F0ECFD;
            box-sizing: border-box;
          }
          .popover-time-little {
            background: none;
            border-bottom: 1px solid #F0ECFD;
            box-sizing: border-box;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .el-menu-xi {
    padding: 0 !important;
    background: #fff;
  }

  .available-popover {
    padding: 12px;
    box-sizing: border-box;
    .title-discript {
      font-size: 12px;
      font-weight: 400;
      color: #606060;
      line-height: 20px;
    }
    .available-popover-block {
      width: 100%;
      display: flex;
      margin-top: 16px;
      .available-popover-item {
        flex: 1;
        text-align: center;
        .popover-time {
          margin: 0 auto;
          width: 48px;
          height: 24px;
          font-size: 16px;
          font-weight: 400;
          color: #F08D00;
          line-height: 24px;
          background: #F0ECFD;
          border-radius: 2px;
        }
        .popover-time-discript {
          width: 48px;
          height: 20px;
          margin: 4px auto 0;
          font-size: 12px;
          font-weight: 400;
          color: #606060;
          line-height: 20px;
        }
        .popover-time-half {
          background: none;
          border-bottom: 12px solid #F0ECFD;
          box-sizing: border-box;
        }
        .popover-time-little {
          background: none;
          border-bottom: 1px solid #F0ECFD;
          box-sizing: border-box;
        }
      }
    }
  }

</style>
