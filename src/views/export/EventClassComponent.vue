<template>
  <div class="day-class-lesson">
    <div class="date-box">
      <p>{{eventItem.dayWeek}}</p>
      <p>{{eventItem.dayDate}}</p>
    </div>
    <div class="lesson-date-box">
      <div class="lesson-morning-box" :style="{height: morningHeight+'px'}">
        <div class="event-class-item" v-for="(amItem,amIdx) in eventItem.lessons.am" :key="amIdx" :class="{'cus-event-item-past':amItem.lessonStatus=='LESSON_END'}">
          <p class="eci-time">{{amItem.time}}</p>
          <p class="eci-subject" :style="{color: getSubjectColor(amItem.subjectName)}">{{amItem.subjectName}}</p>
          <p class="eci-room">{{amItem.ifOnlineLesson?'ClassIn':'线下课'}}</p>
        </div>
        <!--<div class="event-class-item">-->
          <!--<p class="eci-time">10:00～11:00</p>-->
          <!--<p class="eci-subject">科目2</p>-->
          <!--<p class="eci-room">线下课</p>-->
        <!--</div>-->
      </div>
      <div class="lesson-afternoon-box">
        <div class="event-class-item" v-for="(pmItem,pmIdx) in eventItem.lessons.pm" :key="pmIdx" :class="{'cus-event-item-past':pmItem.lessonStatus=='LESSON_END'}">
          <p class="eci-time">{{pmItem.time}}</p>
          <p class="eci-subject" :style="{color: getSubjectColor(pmItem.subjectName)}">{{pmItem.subjectName}}</p>
          <p class="eci-room">{{pmItem.ifOnlineLesson?'ClassIn':'线下课'}}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .day-class-lesson{
    display:inline-block;
    vertical-align: top;
    width:14.28%;

    /*日期*/
    .date-box{
      background: #fafafc;
      text-align: center;
      margin:4px 0;
      p{
        font-size:16px;
        color:#BCC1CC;
        line-height: 24px;
        text-align: center;
        display: block;
      }
    }

    /*课节列表*/
    .lesson-date-box{
      .lesson-morning-box{
        /*border-bottom:1px solid #f90;*/
        border-bottom:1px solid #F6F5F7;
        border-right:1px solid #F6F5F7;
        border-left:1px solid #F6F5F7;
        min-height: 72px;
      }
      .lesson-afternoon-box{
        border-left:1px solid #F6F5F7;
        border-right:1px solid #F6F5F7;
        min-height: 72px;
      }

      .border-right-none{
        border-right:0!important;
      }
      .event-class-item{
        padding:6px;
        font-size:16px;
        color:#262626;
        line-height:24px;
        border-bottom:1px solid #F6F5F7;
        text-align:center;

        .eci-time{
          font-size:16px;
          color:#262626;
          line-height:24px;
        }
        .eci-subject{
          font-size:16px;
          color:#909090;
          font-weight: bold;
        }
        .eci-room{
          font-size:12px;
          color:#D9D9D9;
          line-height: 12px;
        }
      }

      .lesson-morning-box .event-class-item:last-child,.lesson-afternoon-box .event-class-item:last-child{
        border-bottom:0;
      }
    }

  }
</style>

<script>
	export default{
		name: 'EventClassItem', //导出班级课表时,event
		props: {
		  //每一天的课节列表
      eventItem:{
        type:Object,
        required:true
      },

      //科目对应的颜色列表 {name:'',color:'#fff'}
      classSubjectList:{
        type:Array,
        required:true
      },

      //每行最大的课节个数
      classAmMaxCount:{
        type:Array,
        required:true
      },

      //当前是第几天的课程(从0开始)
      dayIndex:{
        type:Number,
        required:true
      }
    },
		components: {},
		data(){
			return {
        morningHeight:this.getMorningHeight(this.classAmMaxCount,this.dayIndex), //上午课的默认高度,最小72
      }
		},
    watch:{
      classAmMaxCount(val,old){
        this.morningHeight = this.getMorningHeight(this.classAmMaxCount,this.dayIndex);
      }
    },
		methods: {

      //根据科目名称,设置科目颜色
      getSubjectColor(val){
        let _this = this;
        let returnVal = '';
        if(val){
          for(var k in _this.classSubjectList){
            let tmpSubObj = _this.classSubjectList[k];
            if(tmpSubObj.name == val){
              returnVal = tmpSubObj.color;
              break;
            }
          }
        }else{
          returnVal = '#909090';
        }

        return returnVal;
      },

      //获得每一行的am-morning 最小的高度
      getMorningHeight(classAmMaxCount,dayIndex){
        let _this = this;
        let height = 72; //默认 72
        if(classAmMaxCount.length==0){
          height = 72;
        }else{

          let quotient = dayIndex / 7;
          quotient = parseInt(quotient); //商
          height =  classAmMaxCount[quotient]*72 || 72;
        }

        return height;
      },

    }
	}
</script>
