<template>
  <div class="time-line">
      <div class="time-line-timed float-left">
        <p class="time-year">{{recordList.createTimeString.split(" ")[0]}}</p>
        <p class="time-clock">{{recordList.createTimeString.split(" ")[1]}}</p>
      </div>
      <div class="time-line-line float-left">
        <!--删除页面-->
        <div class="dot" v-if="recordList.type=='DELETE'"></div>
        <!--身份与权限页面-->
        <div class="dot create-color" v-if="recordList.type=='ADD'"></div>
        <div class="dot del-warn-color" v-if="recordList.type=='ROLE_DELETE'"></div>
        <div class="dot add-color" v-if="recordList.type=='ROLE_ADD'"></div>
        <div class="dotted-line"></div>
      </div>
      <div class="time-line-desc float-left" v-bind:style="recordType">
        <p v-if="recordList.type=='DELETE'">{{recordList.createUserName}}{{recordList.content}}<p>
        <p v-if="recordList.type!='DELETE'">{{recordList.createUserName}}<br>{{recordList.content}}</p>
      </div>

  </div>

</template>

<script>
    export default {
        name: "TimeLine",
        data(){
          return{

          }
        },
        props:{
          recordList:{
            type:Object,
            required:true
          },
          recordType:{
            type:String,
            required:true
          }
        }
    }
</script>

<style scoped lang="scss">
  .time-line{
    position:relative;
    .float-left{
      float: left;
    }
    .time-line-timed{
      width:84px;
      padding-right:30px;
    }
    .time-year{
      font-size: 16px;
      text-align: right;
      color: #606060;
    }
    .time-clock{
      font-size: 12px;
      text-align: right;
      color: #c0c0c0;
      margin-top:4px;
    }
    .time-line-line{
      width:8px;
      margin:0 17px;
      position:absolute;
      left:80px;
      top:0px;
      height:100%;
      .dot{
        width: 8px;
        height: 8px;
        border-radius:4px;
        background-color: #f5222d;
        position:absolute;
        top:8px;
        left:0;
        z-index:1;
      }
      .create-color{
        background-color:#F08D00;
      }
      .add-color{
        background-color:#52C41A;
      }
      .del-warn-color{
        background-color:#FFBF00;
      }
      .dotted-line{
        width:1px;
        height:100%;
        border-left:2px dotted #ddd;
        position:absolute;
        top:0;
        left:3px;
      }
    }
    .time-line-desc{
      font-size: 16px;
      color: #606060;
      padding-bottom:20px;
    }
  }
  .time-line:after{
    clear:both;
    content:'';
    display:block;
    width:0;
    height:0;
    visibility:hidden;
  }

</style>
