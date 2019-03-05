<template>
  <div class="day-lesson-item">
    <div class="day-box">
      <p>{{eventItem.dayWeek}}</p>
      <p>{{eventItem.dayDate}}</p>
    </div>
    <div class="cus-event-item" v-for="(item,idx) in eventItem.lessons" :class="{'cus-event-item-past':item.lessonStatus=='LESSON_END'}" :key="idx">
      <p class="cus-time">{{item.time}}</p>
      <p class="cus-lesson-name">{{item.exam.name_ch + ' ' + item.subjectName}}</p>
      <p class="cus-lesson-class" :style="{color:item.color}">{{item.className}}</p>
      <p class="cus-lesson-status" :class="{'cus-lesson-offline': !item.ifOnlineLesson}"><span class="cus-dot"></span>{{item.ifOnlineLesson?'ClassIn':'线下教室'}}</p>
      <p class="cus-day-time">
        <template v-if="item.dayTime=='morning'">
          <img src="../../../static/morning_pk.png" alt="">
        </template>
        <template v-else-if="item.dayTime=='night'">
          <img src="../../../static/night_pk.png" alt="">
        </template>
        <template v-else>
          <img src="../../../static/afternoon_pk.png" alt="">
        </template>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .day-lesson-item{
    display:inline-block;
    vertical-align: top;
    width:14.28%;
    .day-box{
      margin-bottom:12px;
      margin-top:6px;
      p{
        font-size:16px;
        color:#bcc1cc;
        line-height: 24px;
        padding:6px 0;
        text-align: center;
      }
    }
  }
</style>

<script>
	export default{
		name: 'EventLessonItem',
		props: {
		  eventItem:{
		    type:Object,
        required:true
      }
    },
		components: {},
		data(){
			return {}
		},
		methods: {}
	}
</script>
