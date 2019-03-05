<template>
  <!--<div> 填空题  录入题目 -- 总分、选项</div>-->
  <div class="library-component library-fill-component">
    <el-form-item label="总分：" class="special-form-item">
      <el-input-number :disabled="true" v-model="fillConfig.totalScore"></el-input-number>
    </el-form-item>
    <el-form-item label="设置答案：">
      <el-checkbox v-model="ifAnswerWithOrderNot">乱序匹配</el-checkbox>

        <ul class="ul-library">
          <li class="li-library" v-for="(item,idx) in optionList" :key="'txt_'+idx">
            <div class="li-first">
              <el-input type="textarea" placeholder="请输入" v-model="item.txt" @change="setFillConfig"></el-input>
            </div>
            <div class="li-second">
              <el-input-number :min="1" v-model="item.score" @change="setFillConfig"></el-input-number>
              <template v-if="idx>0">
                <el-tooltip content="删除" placement="top">
                  <i class="library-icon iconfont icon-guanbi" @click="delOptionFun(idx)"></i>
                </el-tooltip>
              </template>
            </div>
          </li>

        </ul>


      <div class="add-title-item" @click="AddOptionFun">添加一空</div>
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
                  txt:'',
                  score:1
                }

              ], //答案列表
              ifAnswerWithOrderNot:false, //是否乱序  true--乱序;false--有序

              fillConfig:{
                ifAnswerWithOrder:true, //  true--有序;false--乱序匹配
                totalScore:2,
                scoreMap:[], //填空题,每个选项对应一个分值
                answerList:[],//答案--简答题的选项 集合
              }
            }
        },
        mounted(){
          this.setConfigFromParentData();
        },
        watch: {
          ifAnswerWithOrderNot(val,old){
            this.fillConfig.ifAnswerWithOrder = !val;
            this.setFillConfig();
          },
          fillConfig:{
            handler(val,old){
              console.log('fillconfig watch-----watch fillconfig')
              this.$emit("fillBlankChange",val);
            },
            deep: true
          }
        },
        methods: {
          //添加选项
          AddOptionFun(){
            let that = this;
            that.optionList.push(
              {
                txt:'',
                score:1
              }
            );
            console.log('添加选项之后----');
            that.setFillConfig(); //这里调用,是因为分值肯定>0.如果分值可以==0的话,则不调用setxxConfig方法
          },

          //删除选项
          delOptionFun(idx){
            let that = this;
            that.optionList.splice(idx,1);
            console.log('删除选项之后----');
            that.setFillConfig();
          },

          //设置fillConfig
          setFillConfig(){
            let that = this;

            let tmpTotalScore = 0;
            let tmpScoreMap = [];
            let tmpAnswerList = [];
            that.optionList.map(item=>{
              tmpTotalScore+=item.score;
              tmpScoreMap.push(item.score);
              tmpAnswerList.push(item.txt.trim().replace(/\n/g,'<br>'));
            });

            that.fillConfig.totalScore = tmpTotalScore;
            that.fillConfig.scoreMap = JSON.parse(JSON.stringify(tmpScoreMap));
            that.fillConfig.answerList = JSON.parse(JSON.stringify(tmpAnswerList));
            console.log('setFillConfig之后 answerList trim了下  ',that.fillConfig)
          },

          //编辑时,把 父组件传来的数据,赋值到页面中
          setConfigFromParentData(){
            console.log('setConfigFromParentData ',this.editToChildData);
            if(this.editToChildData && this.editToChildData.answerList) {
              let parentAnswer = this.editToChildData.answerList || [];
              let parentScore = this.editToChildData.scoreMap || [];

              let tmpOptionList = [];
              if (parentAnswer.length == parentScore.length) {
                parentAnswer.map((item,idx)=>{
                  tmpOptionList.push({
                    txt:item.replace(/<br>/g,'\n'),
                    score:parentScore[idx]
                  });
                });
                this.optionList = JSON.parse(JSON.stringify(tmpOptionList));
              }
              this.ifAnswerWithOrderNot = !this.editToChildData.ifAnswerWithOrder;
              this.fillConfig.totalScore = this.editToChildData.totalScore;
            }
          },
        }
    }
</script>
<style lang="scss" scoped>
.library-fill-component{
  .ul-library {


    .li-library {
      list-style:decimal;
    }

  }
}
</style>
