<template>
  <div class="xi-container lesson-add">
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <!--<router-link :to="{ path: '/manageIndex' }">首页</router-link>-->
        <!--<span>/</span>-->
        <router-link :to="{ path: '/courseManage' }">课程管理</router-link>
        <span>/</span>
        <router-link :to="{ path: '/courseDetail/'+courseId }">课程详情</router-link>
        <span>/</span>
        <router-link :to="{ path: '/lessonList/'+courseId +'/'+params.class+'/'+className}">课节列表</router-link>
        <span>/</span>
        <a class="current-breadcrumb" href="javascript:void(0)"> {{params.lesson == '-1'?'添加课节':'编辑课节'}}</a>
      </el-breadcrumb>
      <h4 class="common-title">{{className}}</h4>
    </el-header>
    <el-container class="common-content">

        <div class="section-box">
          <template v-if="ifBeginTimeToday">
            <!--编辑时,上课日期是今天-->
            <div class="lesson-tip-box">
              <i class="iconfont icon-gantan tip-icon"></i>
              <span class="tip-txt" v-if="ifClassing">已经开始上课了，只能更换老师哦！PS：这样做会把正在上课老师踢下台的</span>
              <span class="tip-txt" v-else>今天就要上课了，只能更换老师哦！</span>
            </div>
          </template>

          <h4 class="section-title">{{params.lesson == '-1'?'添加课节':'编辑课节'}}</h4>
          <div class="section-main">

            <div class="template-main">
              <el-form label-width="90px" class="template-form" ref="ruleForm" :model="ruleForm">
                <div class="form-flex">
                  <el-form-item label="上课日期：" prop="timeList" :class="{'is-error': !timeListValidate}">
                    <div class="class-calendar-box">

                      <Calendar ref="Calendar" :sundayStart="true" :markDate="ruleForm.timeList"
                                :agoDayHide="beforeTime" :futureDayHide="futureDayHide" v-on:choseDay="clickDay"
                                v-on:changeMonth="changeDate"></Calendar>
                      <!--:textTop="topText"-->

                      <div class="class-calendar-bottom">
                        <span class="cc-label">已选：</span>{{ ruleForm.timeList.length}} 天
                      </div>
                    </div>
                    <div class="el-form-item__error" v-show="!timeListValidate">不选日期没办法排课哦！</div>
                  </el-form-item>
                </div>
                <div class="form-flex">

                  <el-form-item label="上课时间：">
                    <el-select class="select-half" v-model="ruleForm.timeStartHour" :disabled="ifBeginTimeToday"
                                placeholder="请选择" @change="getLessonEndInfo">
                      <el-option
                        v-for="item in hourList"
                        :key="item"
                        :label="item"
                        :value="item" :disabled="ifHasToday && item<curHour">
                      </el-option>
                    </el-select>
                    <span class="time-span">点</span>
                    <el-select class="select-half" v-model="ruleForm.timeStartMinute" :disabled="ifBeginTimeToday"
                                placeholder="请选择" @change="getLessonEndInfo">
                      <el-option
                        v-for="item in minuteList"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <span class="time-span">分</span>
                    <div class="el-form-item__error" v-show="!timeStartHourValidate">上课时间与当前时间至少要相差两分钟！</div>
                  </el-form-item>

                  <el-form-item label="时长：">
                      <el-select class="select-half" v-model="ruleForm.durationHour" :disabled="ifBeginTimeToday"
                                  placeholder="请选择" @change="durationHourChange">
                      <el-option
                        v-for="item in durationHourList"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <span class="time-span">小时</span>
                    <el-select class="select-half" v-model="ruleForm.durationMinute" :disabled="ifBeginTimeToday"
                                placeholder="请选择" @change="getLessonEndInfo">
                      <el-option
                        v-for="item in durationMinuteList"
                        :key="item"
                        :label="item"
                        :value="item" :disabled="ruleForm.durationHour==0 && item<15">
                      </el-option>
                    </el-select>
                    <span class="time-span">分钟</span>
                    <!--<div class="el-form-item__error">test！</div>-->
                    <div class="lesson-end-box"> <span>{{lessonEndTip}} 下课</span></div>

                  </el-form-item>

                  <el-form-item label="老师：" prop="teacherId" :class="{'is-error': !teacherValidate}">
                    <el-select class="select-full" v-model="ruleForm.teacherId"  filterable placeholder="请选择授课老师">
                      <el-option-group
                        v-for="(group,idx) in teacherList"
                        :key="'group_'+idx" :label="idx==0?'当前课程的老师':'其他老师'">
                        <el-option
                          v-for="item in group"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-option-group>

                    </el-select>
                    <div class="el-form-item__error" v-show="!teacherValidate">你还没有选择老师呢！</div>
                  </el-form-item>


                    <el-form-item label="上台人数：">
                      <el-select class="select-full" v-model="ruleForm.comeNumber"
                                 :disabled="ifBeginTimeToday" placeholder="请选择上台人数">
                        <el-option v-for="item in comeNumberList" :key="'come'+item.value"
                                   :label="item.label" :value="item.value"></el-option>

                      </el-select>
                    </el-form-item>


                </div>
              </el-form>
            </div>

          </div>
          <div class="section-footer">
            <el-button type="primary" @click="saveLesson">保存</el-button>
            <el-button @click="cancelLesson">取消</el-button>
          </div>
        </div>

    </el-container>
  </div>
</template>

<script>

  /*
  * 补充说明:2019.1.25
  * 排课只能从明天开始;今天和之前的日期无法排课。
  * 正在上的课,只能编辑老师 ---- 提示  已经开始上课了，只能更换老师哦！PS：这样做会把正在上课老师踢下台的
  * 今天要上的课,只能编辑老师 ---- 提示 今天就要上课了，只能更换老师哦
  * 明天之后的课程,可以编辑任何内容
  * so,进入此页面后,只需要判断上课时间是否是明天就可以了。--上课时间为今天:只能修改老师。
  * */
  import Calendar from '../../vue-calendar-component/index';

  import moment from 'moment';

  //昨天
  var day1 = new Date();
  var futureDayHideTime = new Date();
  futureDayHideTime.setTime(futureDayHideTime.getTime() + 24 * 60 * 60 * 1000 * 365);
  day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);

  var dayTomoroow = day1.getTime() + 24 * 60 * 60 * 1000; //明天的日期,居居说:今天之前的日期(包括今天)都不可以排课

  //昨天的时间戳
  var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
  //一年以后的时间戳 用来给日期选择控件赋值
  var futureDayHideDate = futureDayHideTime.getFullYear() + "-" + (futureDayHideTime.getMonth() + 1) + "-" + futureDayHideTime.getDate();

  export default{
    name: '',
    props: [],
    components: {Calendar},
    data(){
      return {
        today:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
        beforeTime: new Date(dayTomoroow).getTime().toString().substr(0,10),
        futureDayHide: futureDayHideDate,
        // 以上为日期控件的数据

        params: {},//地址传过来的值  class;lesson

        className:'', //班级名称
        courseId:'', //课程id

        curHour:new Date().getHours(), //现在是几点
        ifHasToday:false, //上课日期是否包含今天

        ruleForm:{
          timeList: [],//上课日期(年月日)  eg: xxx,xxx
          timeStartHour:new Date().getHours(),//上课时间  几点  默认上课时间是当前时间往后推10分钟,分钟数不能%5=0,则减去取模后的数
          timeStartMinute:'00', //上课时间  几分
          durationHour:1, //默认时长 小时
          durationMinute:'00', //默认时长 分钟
          teacherId:'', //授课老师id
          comeNumber: '6',//上台人数
        }, //其实可以把ruleForm里面的参数提出来,因为form现在不需要表单的验证了。
        lessonEndTip:'', //下课时间
        timeListValidate:true, //上课日期是否通过验证   false--未通过;true--通过
        timeStartHourValidate:true, //上课时间 是否通关验证
        teacherValidate:true, //老师是否通过验证   false--未通过;true--通过

        hourList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], //小时列表
        minuteList:['00','05','10','15','20','25','30','35','40','45','50','55'], //分钟列表
        durationHourList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        durationMinuteList:['00','05','10','15','20','25','30','35','40','45','50','55'],
//        durationMinuteList:[
//          {label:'00',value:0},
//          {label:'05',value:5},
//          {label:'10',value:10},
//          {label:'15',value:15},
//          {label:'20',value:20},
//          {label:'25',value:25},
//          {label:'30',value:30},
//          {label:'35',value:35},
//          {label:'40',value:40},
//          {label:'45',value:45},
//          {label:'50',value:50},
//          {label:'55',value:55},
//        ],

        teacherList:[], //老师列表

        comeNumberList:[
          {
            label:'1V1',
            value:'1'
          },
          {
            label:'1V6',
            value:'6'
          },
          {
            label:'1V12',
            value:'12'
          },
        ], //上台人数列表

        editLessonInfo:{}, //编辑时,课节信息

        ifBeginTimeToday:false,//编辑时,上课时间是否是今天。true:今天--只能修改老师,其他disabled
        ifClassing:false, //编辑时,是否正在上课中,此时ifBeginTimeToday==true 提示文案不一样

        saveFlag:true,//提交flag--保存按钮用到
      }
    },
    mounted(){
      console.log(moment(),'  moment')
      let that = this;

      let params = this.$route.params;
      that.params = params;//保存地址栏传过来的值，用于页面上的判断
      if(params.lesson != -1 || params.lesson != '-1'){
        //编辑课节,获取课节信息接口,组件赋值
        that.getLessonByLessonId(params.lesson);

      }else{
        //添加课节, 需要设置上课时间的默认值
        that.setTodayDefaultHourMinute();
      }

      //获取老师列表接口
      that.getTeacherList();
      if(params.class && params.class !=-1 && params.class !='-1')
      that.getClassInfo(params.class);

    },
    watch: {
      'ruleForm.timeList':{
        handler:function(val,old){
          console.log(val,'---watch')
          let tmpToday = new Date().toLocaleDateString();
          if(val && val.indexOf(tmpToday)>-1){ //包含了今天,上课时间的小时数必须>=当前小时数
            this.ifHasToday = true;
            if(this.ruleForm.timeStartHour < new Date().getHours()){
              this.ruleForm.timeStartHour = new Date().getHours();
              this.setTodayDefaultHourMinute();
            }
          }else{
            this.ifHasToday = false;
          }

        }
      }
    },
    methods: {
      // 日历控件相关方法 begin
      clickDay(data) {
        let that = this;
        if(that.ifBeginTimeToday){ //编辑的是今天的课程,不执行任何操作
          console.log("编辑的是今天的课程,不执行任何操作");
          return false;
        }else {
          console.log(data, "选中某天"); //选中某天
          //判断如果是新建课节，可以多选日期
          if (that.params.lesson == '-1') {
            var timeList = [];
            if (that.ruleForm.timeList.length > 0) {
              for (var i = 0; i < that.ruleForm.timeList.length; i++) {
                if (that.ruleForm.timeList[i] != data) {
                  timeList.push(that.ruleForm.timeList[i]);
                }
              }
            } else {
              timeList.push(data);
            }

            if (timeList.length == that.ruleForm.timeList.length) {
              that.ruleForm.timeList.push(data);
            } else {
              that.ruleForm.timeList = JSON.parse(JSON.stringify(timeList));
            }
          } else {
            //判断如果是编辑课节，只能单选日期
            that.ruleForm.timeList = [];
            that.ruleForm.timeList.push(data);
          }
        }

      },
      changeDate(data) {
        console.log(data); //左右点击切换月份

      },
      clickToday(data) {
        console.log(data); //跳到了本月
      },

      //日历控件相关方法 end


      //时长--小时 change方法
      durationHourChange(val){
        console.log(val,'  durationHourChange');
        let that = this;
        console.log(that.ruleForm.durationMinute,'  durationMinute');
        if(val==0 || val=='0'){ //时长为0小时的时候,分钟至少为15分钟
          if(parseInt(that.ruleForm.durationMinute)<15){
            that.ruleForm.durationMinute = '15';
          }
        }
        that.getLessonEndInfo();
      },

      //设置 默认的上课时间;以及上课日期选了今天之后,
      setTodayDefaultHourMinute(){
        let that = this;

        //设置上课时间的默认值,当前时间往后推十分钟。如果分钟不能被5整除,则去前一个5的倍数。eg:1点12分,则取1点10分。
        //如果上课日期中选了选了今天,则上课时间的小时必须>=当前的小时,如果没有选今天,则不用
        let tmpTimeAfterTen = new Date(new Date().getTime()+10*60*1000); //十分钟之后的时间
        that.ruleForm.timeStartHour = tmpTimeAfterTen.getHours();
        let tmpMinute = tmpTimeAfterTen.getMinutes();
        that.ruleForm.timeStartMinute = tmpMinute-tmpMinute%5; //上课时间的分钟数,只能是5的倍数

        that.getLessonEndInfo();
      },
      //获取下课时间。 上课时间、时长  变化之后,都要调用
      getLessonEndInfo(){
        let that = this;

        let tmpToday = moment().format('L'); //今天的时间   01/24/2019

        //完整的开始时间   January 24, 2019 11:10 AM
        let tmpClassStart = moment(tmpToday+' '+that.ruleForm.timeStartHour+':'+that.ruleForm.timeStartMinute).format('LLL')

        //结束时间的毫秒数,实际对应的时间格式是: Thu Jan 24 2019 12:10:00 GMT+0800 (中国标准时间)
        let tmpLessonEndTime = new Date(tmpClassStart).getTime()+that.ruleForm.durationHour*60*60*1000+ parseInt(that.ruleForm.durationMinute)*60*1000;

        console.log(tmpLessonEndTime,'  endTime  ',new Date(tmpLessonEndTime));

        let lessonEndTipTime = moment(new Date(tmpLessonEndTime)).format('HH:mm');

        let totalHour = parseInt(that.ruleForm.timeStartHour)+parseInt(that.ruleForm.durationHour);
        if(totalHour>=24){
          that.lessonEndTip = '次日 '+lessonEndTipTime;
        }else{
          that.lessonEndTip = '当日 '+lessonEndTipTime;
        }

      },


      /*接口相关*/
      //获取老师列表
      getTeacherList(){
        let that = this;
        that.request({
          method: 'post',
          url: '/lesson/get_teacher.do',
          param: {classId:that.params.class},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
             that.teacherList = result.result;
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取老师列表失败，刷新页面重试。')
          }
        })
      },

      //根据lessonid获取课节信息---编辑
      getLessonByLessonId(lessonId){
        let that = this;
        that.request({
          method: 'post',
          url: '/lesson/get_lesson_by_id.do',
          param: {lessonId:lessonId},
          success: function (result) {
            console.log(result);

            if (result.code == 200 && result.result) {
              that.editLessonInfo = result.result;

              let tmpTomorrowDate = moment().add(1,'days').format('L'); //明天日期的年月日
              console.log(tmpTomorrowDate,'---明天日期的年月日--',new Date(tmpTomorrowDate));
              let tmpTomorrowGetTime = new Date(tmpTomorrowDate).getTime();

              let tmpBeginTime = result.result.beginTime;
              if(tmpBeginTime>=tmpTomorrowGetTime){ //明天的课程
                that.ifBeginTimeToday = false;
              }else{
                that.ifBeginTimeToday = true; //今天的课程,上课日期、时间、时长、上台人数都不能编辑
                if(tmpBeginTime >= new Date().getTime()){
                  that.ifClassing = true; //上课中
                }else{
                  that.ifClassing = false;
                }
              }

              let durationArr= result.result.durationString.split('小时'); //返回 [1,10分]
              let tmpEditForm = {
                timeList: [result.result.classDate],
                timeStartHour: new Date(result.result.beginTime).getHours(),// moment(result.result.beginTime).format('HH'),
                timeStartMinute: new Date(result.result.beginTime).getMinutes(),//moment(result.result.beginTime).format('mm'), //上课时间  几分
                durationHour: durationArr[0], //默认时长 小时
                durationMinute: durationArr[1].split('分')[0], //默认时长 分钟
                teacherId: result.result.teacher.userAccount, //授课老师id
                comeNumber: result.result.seatNum,
              };

              that.ruleForm = Object.assign({}, tmpEditForm);
              that.getLessonEndInfo();

              that.$refs.Calendar.ChoseMonth(result.result.classDate); //编辑时,跳转到classDate所在的月份,而不是当前月份

            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取课节信息失败，刷新页面重试。')
          }
        })
      },

      //获取班级信息  班级名和课程id
      getClassInfo(cid){
        let that = this;
        that.request({
          method: 'post',
          url: '/class/get_class_info_by_id.do',
          param: {classId:cid},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              that.className = result.result.className;
              that.courseId = result.result.courseId
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取班级信息失败，刷新页面重试。')
          }
        })
      },

      //保存 按钮,验证
      saveLesson(){
        let that = this;
        console.log(that.ruleForm,'----save 验证')

        if (!that.saveFlag) {
          return false;
        }
        that.saveFlag = false;

        //  判断条件是否符合保存 -- begin

        //上课日期必选
        if (that.ruleForm.timeList.length < 1) {
          that.timeListValidate = false;
          that.saveFlag = true;
          return false;
        } else {
          that.timeListValidate = true;
        }


        //验证 如果日期选了今天,则 上课时间 - 当前时间 >= 两分钟
        if(this.ifHasToday) {
          let timeDiff = true; //是否相差两分钟以上。  true--相差了两分钟;false--不到两分钟

          let tmpToday = moment().format('L'); //今天的时间   01/24/2019

          //完整的开始时间   January 24, 2019 11:10 AM
          let tmpClassStart = moment(tmpToday + ' ' + that.ruleForm.timeStartHour + ':' + that.ruleForm.timeStartMinute).format('LLL')

          let tmpMsTimeStart = new Date(tmpClassStart).getTime();
          let curMsTime = new Date().getTime();
          if (tmpMsTimeStart - curMsTime >= 2 * 60 * 1000) {
            timeDiff = true;
          }
          console.log(curMsTime - tmpMsTimeStart, '----', timeDiff);

          that.timeStartHourValidate = timeDiff;
          if (!timeDiff) {
            that.saveFlag = true;
            return false;
          }
        }


        //验证老师
        if (that.ruleForm.teacherId.length < 1) {
          that.teacherValidate = false;

          that.saveFlag = true;
          return false;
        }
        that.teacherValidate = true;

        that.saveLessonConfirm();

      },

      //确定保存课节
      saveLessonConfirm(copy) {
        let that = this;

        console.log('保存课节的接口; ');

        let dataUrl = ''; //接口地址
        let dataParam = {}; //接口参数

        if(that.params.lesson == -1 || that.params.lesson == '-1'){
          //添加
          dataUrl = '/lesson/lesson_save_batch.do';

          dataParam = {
            classId:that.params.class,
            days: that.ruleForm.timeList.join(',').replace(/\//g,'-'),
            startTime: that.ruleForm.timeStartHour+':'+that.ruleForm.timeStartMinute,
            durationOfHour:that.ruleForm.durationHour,
            durationOfMinute:that.ruleForm.durationMinute,
            teacherAccount:that.ruleForm.teacherId,
            seatNum:that.ruleForm.comeNumber
          }
        }else{
          //编辑
          dataUrl = '/lesson/lesson_update.do';
          dataParam = {
            lessonId: that.params.lesson,
            day: that.ruleForm.timeList.join(',').replace(/\//g,'-'),
            startTime: that.ruleForm.timeStartHour+':'+that.ruleForm.timeStartMinute,
            durationOfHour:that.ruleForm.durationHour,
            durationOfMinute:that.ruleForm.durationMinute,
            teacherAccount:that.ruleForm.teacherId,
            seatNum:that.ruleForm.comeNumber
          }
        }

        that.request({
          method: 'post',
          url: dataUrl,
          param: dataParam,
          success: function (result) {
            console.log(result,'------添加或编辑课节的接口,返回的数据');

            if (result.code == 200) {
              let tip = '课节编辑成功';
              if(that.params.lesson == -1 || that.params.lesson == '-1') {//添加
                tip = '课节添加成功';
              }

              that.$message({
                message: tip,
                type: 'success',
                duration:5000
              });
              that.$router.go(-1);

            } else {
              that.$message({
                message: '课节操作失败。'+result.message,
                type: 'error',
                duration:6000
              });
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            if(that.params.lesson == -1 || that.params.lesson == '-1') {
              //添加
              that.$message.error('添加课节失败。'+error.message)
            }else{
              //编辑
              that.$message.error('编辑课节失败。'+error.message)
            }
            that.saveFlag = true;

          }
        });

      },

      //取消保存课节
      cancelLesson(){
        this.$router.go(-1);
      }

    }
  }
</script>
<style lang="scss" scoped>
  .lesson-add{

  .section-box{
    width: 100%;
    background: #fff;

    /*编辑时的提示信息*/
    .lesson-tip-box{
      background:rgba(255,251,230,1);
      border-radius:4px;
      border:1px solid rgba(255,229,143,1);
      padding:9px 16px;

      .tip-icon{
        color:#FAAD14;
      }
      .tip-txt{
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:22px;
        padding-left:4px;
      }

    }

  /*编辑时的提示信息 end*/
  .section-title{
    border-bottom:1px solid #F0F0F0;
    padding:12px 24px;
    font-size:16px;
    color:#222;
    font-weight: 500;
    line-height: 24px;
  }
  .section-main{
    padding:24px;
    font-size:16px;
    font-weight:400;
    color:#606060;
    line-height:22px;

  .template-main{
    /*padding:32px 24px;*/

  .template-form {
    display: flex;

    .form-flex {
      flex: 1;
      margin-right: 20px;

    .select-half {
      width: 100px !important;
    }
    .select-full {
      width: 100% !important;
    }
    .time-span{
      display: inline-block;
      width: 40px;
      padding-left:6px;
      text-align: left;
    }
    .lesson-end-box{
      padding-top:12px;
      span{
        background: #F5F5F5;
        border-radius:4px;
        font-size:14px;
        color:#909090;
        padding:4px 6px;
      }
    }

    }

  .class-calendar-box {
    border: 1px solid #e8e8e8;
    width: auto;

    .class-calendar-bottom {
      border-top: 1px solid #e8e8e8;
      font-size: 14px;
      color: #F08D00;
      padding: 10px 24px;
      line-height: 24px;

      .cc-label {
        color: #909090;
      }

    }
  }
  .is-error .class-calendar-box {
    border: 1px solid #FF6666;
  }

  }
  } /* template-main*/

  }/* section-main */
  .section-footer{
    border-top:1px solid #F0F0F0;
    padding:12px 24px;
    text-align: right;
  }

  }/*library-main end*/

  }
</style>
