<template>
  <div id="dialogs" v-if="dialogData.show">
    <div class="js_dialog" id="iosDialog1">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd" v-if="dialogData.title!=''"><strong class="weui-dialog__title">{{dialogData.title}}</strong></div>
        <div class="weui-dialog__bd">{{dialogData.message}}</div>
        <div class="weui-dialog__ft">
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" :style="{ color:cancelButtonColor }" @click="closeMyself">{{ dialogData.cancelButtonText || '取消'}}</a>
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" :style="{ color:countColor }" v-if="countDown>0">{{dialogData.confirmButtonText || '确定'}}<span>（{{countDown}}）</span></a>
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" :style="{ color:countColor }" @click="confirmButton" v-if="dialogData.countdown && countDown== 0">{{dialogData.confirmButtonText || '确定'}}</a>
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" :style="{ color:confirmButtonColor }" @click="confirmButton" v-if="!dialogData.countdown">{{dialogData.confirmButtonText || '确定'}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Dialog",
    props: ['dialogData'],
    data() {
      return {
        confirmButtonColor:"#46A3FA",
        cancelButtonColor:"#666",
        countColor:"#F5222D",
        countDown:0,
      }
    },
    updated(){
      this.confirmButtonColor = this.dialogData.confirmButtonColor+'!important';
    },
    mounted(){
      //判断如果有倒计时，就赋值
      if(this.dialogData.countdown){
        this.countDown = this.dialogData.countdown;
      }
      if(this.dialogData.countdown && this.dialogData.countdown!=0){
        this.countColor = "#FFC7C4!important";
      }
      if(this.dialogData.confirmButtonColor) {
        this.confirmButtonColor = this.dialogData.confirmButtonColor + '!important';
      }
      if(this.dialogData.cancelButtonColor) {
        this.cancelButtonColor = this.dialogData.cancelButtonColor + '!important';
      }

      var count;
      console.log(this.countDown,"setTimeoutsetTimeout");
      if(this.dialogData.show && this.countDown>0){
        count = setInterval(()=>{
          this.countDown--;
          if(this.countDown == 0){
            clearTimeout(count);
            this.countColor = "#F5222D!important";
          }
        },1000)
      }
    },
    methods: {
      closeMyself() {
        this.dialogData.show = false;
      },
      confirmButton(){
        this.dialogData.show = false;
        this.$emit("onConfirm");
      }
    }
  }
</script>

<style scoped>
  .weui-dialog__bd{
    color: #353535;
    padding: 2.7em 20px 1.7em;
  }

</style>
