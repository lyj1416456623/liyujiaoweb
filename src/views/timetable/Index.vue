<template>
  <div>
    <div class="time-header">
      <div class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{path:''}">课程表</router-link>
      </div>
      <h4 class="auth-title">我的课程表</h4>
      <p class="auth-discript">课表</p>
      <template v-if="hasExportFlag">

        <el-button type="primary" class="btn-export" @click.native="goExport">导出课表</el-button>
      </template>
    </div>
    <div class="time-calendar">
      <div class="xi-fullcalendar">
        <full-calendar ref="calendar" :event-sources="eventSources" @event-selected="eventSelected" @event-created="eventCreated" :config="config"></full-calendar>
      </div>
      <div class="time-calendar-child-bg">
        <img src="//xiniao.oss-cn-beijing.aliyuncs.com/img/schedulebg.png" alt="" width="100%">
      </div>
    </div>

    <div v-if="lessonComing.id" role="alert" class="el-message el-message--warning el-my-tip-alert" style="z-index: 2000;">
      <i class="el-message__icon el-icon-warning"></i>
      <p class="el-message__content">你有一节ClassIn的课即将上课，请提前进入教室做好准备工作 <a v-if="eeoRoomLink" class="el-to-room" :href="eeoRoomLink" target="_blank">进入教室</a></p>
    </div>

  </div>
</template>

<script>
//  import fullCalendar from 'vue-fullcalendar'
  import FullCalendar from '../../vue-fullcalendar-component/index';
  import moment from 'moment';

	export default{
		name: 'TimeTableCourse', //课程表
		props: {
//      userPermission:{
//        type:Object,
//        required: true
//      }
    },
		components: {FullCalendar},
		data(){
			return {
//			  curStart:'',//当前周的周一日期
//        curEnd:'', //当前周的周日日期
			  startDate:'', //显示数据的周一的日期
        endDate:'', //显示数据的周日的日期
        hasExportFlag:true, //是否有导出课表的权限
        lessonComing:{
          id:'', //课节id
        }, //即将开始的课节的信息
        events: [],
        config: {
          editable:false, //不可拖动
          eventClick: (event) => {
            this.selected = event;
          },
          customButtons: {
            todayYear:{
              text:moment().year(),
            },
            preArrow: {
              text: '<',
              click: (pre) => {
                let tmpMonday = this.startDate;
                let prevDay = this.AddDays(tmpMonday,-3); //前3天
                this.setWeekDate(new Date(prevDay));
                this.$refs.calendar.$emit('goto-prev-event');
              }
            },
            nextArrow: {
              text: '>',
              click: (next) => {
                let tmpSunday = this.endDate;
                let nextDay = this.AddDays(tmpSunday,3);
                this.setWeekDate(new Date(nextDay));
                this.$refs.calendar.$emit('goto-next-event');
              }
            },
            goToToday: {
              text: '回到今天',
              click: () => {
                // $calendar.fullCalendar('today');
                this.setWeekDate(new Date());
                this.$refs.calendar.$emit('goto-today-event');
              },
            },
          },
          defaultView: 'basicWeek',
          locale: 'zh-cn',
          header: {
            left: 'todayYear',
            center: '',
            right: 'goToToday, preArrow title nextArrow',
          },
          firstDay: 1, //默认周一开始(周日0;周一1;)
          timeFormat: 'H:mm',
          eventRender: function (event, element) {
            var tmp_title = '';
            tmp_title += event.title;
            element.html(tmp_title);
          },

        },

        eeoRoomLink:'', //进入eeo教室的链接
      }
		},
    mounted(){
		  this.setWeekDate(new Date());
    },
		methods: {

      //根据nowDate得到周一和周日
      setWeekDate(nowDate){
        let curStart = this.getWeekDate(0,nowDate); // 1--周日 ; 0--周一
        let curEnd = this.getWeekDate(-6,nowDate); // -6 周日
        this.startDate = curStart;
        this.endDate = curEnd;

        console.log('setWeekDate 周一  ',curStart,'  周日 ',curEnd)
        this.getEvents(curStart,curEnd);

      },

      //得到nowDate这个日期所在周 的周一(n==0)和周日(n==-6) -- tool
      getWeekDate:function(n,nowDate){
        let now= nowDate;
        let year=now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        let month=now.getMonth()+1;
        let date=now.getDate();
        let day=now.getDay();

        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if(day!==0){
          n=n+(day-1);
        }
        else{
          n=n+day;
        }
        if(day){
          //这个判断是为了解决跨年的问题
          if(month>1){
            month=month;
          }
          //这个判断是为了解决跨年的问题,月份是从0开始的
          else{
            year=year-1;
            month=12;
          }
        }
        now.setDate(now.getDate()-n);
        year=now.getFullYear();
        month=now.getMonth()+1;
        date=now.getDate();

        let s = year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
        return s;
      },

      //在时间nowDateStr(2011-11-2)基础上加几天dayIn(可以为负数) -- tool
      AddDays:function(nowDateStr,dayIn) {
        let date=new Date(nowDateStr);
        let myDate=new Date(date.getTime()+dayIn*24*60*60*1000);
        let year=myDate.getFullYear();
        let month=myDate.getMonth()+1;
        let day=myDate.getDate();
        let CurrentDate=year+"-";
        if(month>=10)
        {
          CurrentDate=CurrentDate+month+"-";
        }
        else
        {
          CurrentDate=CurrentDate+"0"+month+"-";
        }
        if(day>=10)
        {
          CurrentDate=CurrentDate+day;
        }
        else
        {
          CurrentDate=CurrentDate+"0"+day;
        }
        return CurrentDate;
      },

      //导出课表按钮
      goExport(){
        this.$router.push("/exportLesson")
      },

      /* 日历相关 */
      //获取所有event
      getEvents(start,end){
        let _this = this;
        let tmpEvents=[];

        _this.request({
          url: '/p-pk/curriculum/get_curriculum_schedule.do',
          param: {'before': start,'after':end,'ifTeacher':true},
          method: 'post',
          success: function (data) {
            if(data.code ==200){
              if(data.result && data.result.length>0){
                let tmpListLesson = data.result;
                for(let i=0;i<tmpListLesson.length;i++){

                  let tmpItem = tmpListLesson[i];

                  let tmpEventClass = ''; //cus-event-item 对应的上完的课程和即将开始的课程的样式
                  let tmpStatusClass = ''; //cus-lesson-stuats 对应的线下课的样式
                  let tmpStatusText = ''; //cus-lesson-stuats 对应的线下课或者线下课的文案
                  let tmpDayTimeImg = '//xiniao.oss-cn-beijing.aliyuncs.com/img/'+(tmpItem.dayTime || 'morning')+'_pk.png'; //早中晚对应的图片的url

                  if(tmpItem.ifGoingToClass){ //即将开始的课
                    tmpEventClass = ' cus-event-item-coming';
                  }else{
                    if(tmpItem.lessonStatus && tmpItem.lessonStatus == 'LESSON_UNSTART'){
                      tmpEventClass = ' '; //未开始的课
                    }else{
                      tmpEventClass = ' cus-event-item-past'; //已上过的课
                    }
                  }
                  if(tmpItem.ifOnlineLesson){
                    tmpStatusText = 'ClassIn';
                  }else{
                    tmpStatusText = '线下课';
                    tmpStatusClass = ' cus-lesson-offline';
                  }

                  let tmp_title_html = '<div class="cus-event-item '+tmpEventClass+'">' +
                    '<p class="cus-time">'+tmpItem.time+'</p>' +
                    '<p class="cus-lesson-name">'+tmpItem.exam.name_ch+' '+tmpItem.subjectName+'</p>' +
                    '<p class="cus-lesson-class" style="color:'+tmpItem.color+'">'+tmpItem.className+'</p>' +
                    '<p class="cus-lesson-status '+tmpStatusClass+'"><span class="cus-dot"></span>'+tmpStatusText+'</p>' +
                    '<p class="cus-day-time"><img src="'+tmpDayTimeImg+'" alt=""></p>' +
                    '</div>';


                  let tmp_event = {
                    id: tmpItem.id, //课节id
                    title: tmp_title_html,
                    start: moment(new Date(tmpItem.beginTime)).format('YYYY-MM-DD'),
                  }
                  if(tmpItem.ifGoingToClass){ //即将要上课的课节
                    _this.lessonComing={
                      id:tmpItem.id
                    }
                    _this.getEeoRoomInfo(tmpItem.id);
                  }

                  tmpEvents.push(tmp_event);

                } //end for

                _this.events = tmpEvents;
              }else{
                _this.$message({message:'您在这段时间里没有要上的课哦',type:'warning',duration:5000});
              }
            }

          },
          error: function (err) {
            console.log(err);
            _this.$message.error('获取本周课节失败,刷新页面重试');
          }
        });

      },

      //获取进入eeo教室时,一些参数
      getEeoRoomInfo(id){
        let _this = this;

        _this.request({
          url: '/p-pk/curriculum/get_login_linked.do',
          param: {'lessonId': id},
          method: 'post',
          success: function (data) {
            if (data.code == 200) {
              if(data.result){
                _this.eeoRoomLink = data.result;
              }
            }
          },
          error: function (err) {
            console.log(err);
            _this.$message.error('获取EEO信息失败,刷新页面重试');
          }
        });
      },

      refreshEvents() {
        this.$refs.calendar.$emit('refetch-events');
      },

      removeEvent() {
        this.$refs.calendar.$emit('remove-event', this.selected);
        this.selected = {};
      },

      eventSelected(event) {
        this.selected = event;
      },

      eventCreated(...test) {
        console.log(test);
      },

    },
    computed: {
      eventSources() {
        const self = this;
        return [
          {
            events(start, end, timezone, callback) {
              setTimeout(() => {
                callback(self.events);
              }, 1000);
            },
          },
        ];

      },
    },

	}
</script>

<style lang="scss" scoped>

  .time-header {
    background:#fff;
    padding:18px 48px 18px 24px;
    position:relative;
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
  }

  /*日历*/
  .time-calendar{
    margin:18px;
    background: #fff;
    .xi-fullcalendar{
      padding:20px 20px;
    }
    .time-calendar-child-bg{
      padding: 0;
      margin:0;
    }
  }

  /*进入教室*/
  .el-my-tip-alert{
    .el-message__content{
      line-height: 24px!important;
    }
    .el-to-room{
      padding:0 0 0 40px;
      font-size:14px;
      color:#FFBF00;
      float: right;
    }
  }

</style>
<style>
  @import "../../style/xifullcalendar.css";
</style>

