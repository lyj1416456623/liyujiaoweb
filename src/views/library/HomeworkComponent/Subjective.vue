<template>
  <!--<div>简答题录入题目 -- 总分、作答方式</div>-->
  <div class="library-component library-subjective-component">
    <el-form-item label="总分：" class="special-form-item">
      <el-input-number :min="0" v-model="subjectiveConfig.totalScore" @change="changeScoreFun"></el-input-number>
    </el-form-item>
    <el-form-item label="标签：">
      <el-input v-model="subjectiveConfig.topic" class="library-el-input" ></el-input>
    </el-form-item>
    <el-form-item label="作答方式：">
      <div class="answer-type-box">

        <div class="answer-item answer-item-active">
          <i class="iconfont icon-wenzi"></i>
          <p class="text-tip">文本</p>
        </div>
        <div class="answer-item" :class="ifImgWay?'answer-item-active':''" @click="changeAnswerWay('IMG')">
          <i class="iconfont icon-tupian"></i>
          <p class="text-tip">图片</p>
        </div>
        <div class="answer-item" :class="ifAudioWay?'answer-item-active':''" @click="changeAnswerWay('AUDIO')">
          <i class="iconfont icon-luyin"></i>
          <p class="text-tip">录音</p>
        </div>
        <div class="answer-item" :class="ifVideoWay?'answer-item-active':''" @click="changeAnswerWay('VIDEO')">
          <i class="iconfont icon-shipin"></i>
          <p class="text-tip">视频</p>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
    export default{
        name: '',
        props: {
          editToChildData:{
            type:Object
          }
        },
        components: {},
        data(){
            return {
              subjectiveConfig:{
                totalScore:1, //总分
                topic:'简答题', //简答题的标签
                answerWay:["TEXT"],
                scoreMap:[1],
              },

              ifImgWay:false,
              ifAudioWay:false,
              ifVideoWay:false,
            }
        },
        mounted(){
          this.setSubjectConfigFromParent();
        },
        watch: {
          subjectiveConfig:{
            handler(val,old){
              this.$emit("subjectiveChange",val);
            },
            immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法 //必须为true,因为当简答题的总分、标签、作答方式不变,且immediate=false的时候,无法触发这个watch
            deep: true

          }
        },
        methods: {
          //编辑时,把 父组件传来的数据,赋值到页面中
          setSubjectConfigFromParent(){
            console.log('setConfigFromParentData  subjective',this.editToChildData);
            if(this.editToChildData && this.editToChildData.topic) {
              this.subjectiveConfig = JSON.parse(JSON.stringify(this.editToChildData));

              if(this.subjectiveConfig.answerWay.indexOf('IMG')!=-1){
                this.ifImgWay = true;
              }
              if(this.subjectiveConfig.answerWay.indexOf('AUDIO')!=-1){
                this.ifAudioWay = true;
              }
              if(this.subjectiveConfig.answerWay.indexOf('VIDEO')!=-1){
                this.ifVideoWay = true;
              }
            }
          },

          //修改作答方式
          changeAnswerWay(way){
            let that = this;
            let tmpIfCheck = false;
            if(way=='IMG'){
              that.ifImgWay = !that.ifImgWay;
              tmpIfCheck = that.ifImgWay;
            }else if(way=='AUDIO'){
              that.ifAudioWay = !that.ifAudioWay;
              tmpIfCheck = that.ifAudioWay;
            }else{
              that.ifVideoWay = !that.ifVideoWay;
              tmpIfCheck = that.ifVideoWay;
            }

            if(tmpIfCheck){ //选中
              that.subjectiveConfig.answerWay.push(way);
            }else{
              let wayIdx = that.subjectiveConfig.answerWay.indexOf(way);
              if(wayIdx!=-1){
                that.subjectiveConfig.answerWay.splice(wayIdx,1);
              }
            }
            console.log(that.subjectiveConfig)
          },

          //修改总分,同时也修改了scoreMap
          changeScoreFun(){
            let that = this;
            let tmpScoreMap = [];
            tmpScoreMap.push(that.subjectiveConfig.totalScore);

//            that.subjectiveConfig.scoreMap = JSON.parse(JSON.stringify(tmpScoreMap));
            that.$set(that.subjectiveConfig,'scoreMap',JSON.parse(JSON.stringify(tmpScoreMap)))
          }
        }
    }
</script>
<style lang="scss" scoped>
  .library-subjective-component{
    .library-el-input{
      width: 600px!important;
    }
    .answer-type-box{
      padding-top:40px;
      .answer-item{
        width:80px;
        height:64px;
        padding-top:16px;
        background:#f5f5f5;
        border-radius:4px;
        text-align:center;
        margin-right:16px;
        display:inline-block;
        line-height:12px;
        cursor:pointer;

        .iconfont{
          font-size:32px;
          color:#bdbdbd;
          line-height: 1;
        }
        .text-tip{
          display: block;
          font-size:12px;
          color:#bdbdbd;
          line-height: 22px;
        }
      }
      .answer-item:first-child{
        cursor: default;
      }
      .answer-item:last-child{
        margin-right:0;
      }
      .answer-item-active{
        background:rgba(240,141,0,0.12);
        .iconfont{
          color:#F08D00;
        }
        .text-tip{
          color:#F08D00;
        }
      }
      .answer-item:hover{

      }
    }
  }
</style>
