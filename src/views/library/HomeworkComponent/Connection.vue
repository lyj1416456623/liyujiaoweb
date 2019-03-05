<template>
  <!--<div>连线题 录入题目 -- 总分、选项</div>-->
  <div class="library-component library-connect-component">
    <el-form-item label="总分：" class="special-form-item">
      <el-input-number :disabled="true" v-model="connectConfig.totalScore" @change="setConnectConfig"></el-input-number>
    </el-form-item>
    <el-form-item label="题目：">
      <div class="connect-box">

        <div class="connect-line-box connect-title ziyue-flex">
          <div class="connect-line-item ziyue-flex-item"> &nbsp;</div>
          <div class="connect-line-item ziyue-flex-item">选项：</div>
          <div class="connect-line-item ziyue-flex-item">单空分数：</div>
        </div>
        <div class="connect-line-box connect-option ziyue-flex" v-for="(item,idx) in optionList" :key="'txt_'+idx">
          <div class="connect-line-item ziyue-flex-item">
            <el-input type="textarea" placeholder="请输入" v-model="item.left" @change="setConnectConfig"></el-input>
            <i class="iconfont icon-bangding left-link"></i>
          </div>
          <div class="connect-line-item ziyue-flex-item">
            <el-input type="textarea" placeholder="请输入" v-model="item.right" @change="setConnectConfig"></el-input>
          </div>
          <div class="connect-line-item ziyue-flex-item">
            <el-input-number v-model="item.score" :min="1" @change="setConnectConfig"></el-input-number>
            <template v-if="idx>1">
              <el-tooltip content="删除" placement="top">
                <i class="library-icon iconfont icon-guanbi" @click="delOptionFun(idx)"></i>
              </el-tooltip>
            </template>
          </div>
        </div>

        <div class="connect-line-box connect-option ziyue-flex">
          <div class="connect-line-item ziyue-flex-item">
            <div class="add-operation-box" @click="AddOptionFun"> <p>添加对应项</p></div>
          </div>
          <div class="connect-line-item ziyue-flex-item"></div>
          <div class="connect-line-item ziyue-flex-item"></div>
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
              optionList:[
                {
                  left:'',
                  right:'',
                  score:1
                },
                {
                  left:'',
                  right:'',
                  score:1
                }
              ], //答案列表

              connectConfig:{
                totalScore:2,
                leftDataList:[],
                rightDataList:[],
                scoreMap:[], //每个选项对应一个分值

              }
            }
        },
        mounted(){
          this.setConfigFromParentData();
        },
        watch: {
          connectConfig:{
            handler(val,old){
              console.log('connectConfig watch-----watch connectConfig')
              this.$emit("connectionChange",val);
            },
            deep: true
          }
        },
        methods: {
          //编辑时,把 父组件传来的数据,赋值到页面中
          setConfigFromParentData(){
            console.log('setConfigFromParentData  CONNECT',this.editToChildData);

            if(this.editToChildData && this.editToChildData.leftDataList) {

              let tmpLeft = this.editToChildData.leftDataList || [];
              let tmpRight = this.editToChildData.rightDataList || [];
              let tmpScoreList = this.editToChildData.scoreMap || [];

              let tmpOptionList = [];
              if (tmpLeft.length == tmpRight.length) {
                tmpLeft.map((item,idx)=>{
                  tmpOptionList.push({
                    left:item.replace(/<br>/g,'\n'),
                    right:tmpRight[idx].replace(/<br>/g,'\n'),
                    score:tmpScoreList[idx] || 1
                  });
                });
                this.optionList = JSON.parse(JSON.stringify(tmpOptionList));
              }
              this.connectConfig = JSON.parse(JSON.stringify(this.editToChildData));
            }
          },

          //添加选项
          AddOptionFun(){
            let that = this;
            that.optionList.push(
              {
                left:'',
                right:'',
                score:1
              }
            );
            console.log('添加选项之后----');
            that.setConnectConfig(); //这里调用,是因为分值肯定>0.如果分值可以==0的话,则不调用setxxConfig方法
          },

          //删除选项
          delOptionFun(idx){
            let that = this;
            that.optionList.splice(idx,1);
            console.log('删除选项之后----');
            that.setConnectConfig();
          },

          setConnectConfig(){
            let that = this;

            let tmpLeftList = [];
            let tmpRightList = [];
            let tmpScoreMap = [];
            let tmpTotalScore = 0;

            that.optionList.map(item => {
              tmpLeftList.push(item.left.replace(/\n/g,'<br>'));
              tmpRightList.push(item.right.replace(/\n/g,'<br>'));
              tmpScoreMap.push(item.score);
              tmpTotalScore+=item.score
            });
            that.connectConfig.totalScore = tmpTotalScore;
            that.connectConfig.leftDataList = JSON.parse(JSON.stringify(tmpLeftList));
            that.connectConfig.rightDataList = JSON.parse(JSON.stringify(tmpRightList));
            that.connectConfig.scoreMap = JSON.parse(JSON.stringify(tmpScoreMap));

            console.log('set连线Config之后  ',that.connectConfig)

          }
        }
    }
</script>
<style lang="scss" scoped>
.connect-box{
  .connect-line-box{
    margin-bottom:8px;
    .connect-line-item{
      min-height:22px;
      font-size:16px;
      color:#606060;
      line-height: 22px;

      .left-link{
        display: inline-block;
        vertical-align:middle;
        margin-top:-30px;
      }
    }
    .connect-line-item > .el-input,.connect-line-item > .el-textarea{
      width: 90%!important;
    }

  }

  .connect-title{
    margin-bottom:16px;
  }
  .connect-option{
    .add-operation-box{
      width:90%;
      border:1px dashed #E0E0E0;
      border-radius:4px;
      cursor: pointer;
      line-height: 22px;
      font-size:16px;
      color:#606060;
      padding:8px 0;
      p{
        padding:0 8px;
      }
    }
    .add-operation-box:hover{
      border:1px dashed #F08D00;
      color:#F08D00;
    }
  }


}
</style>
