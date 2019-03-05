<template>
  <!--<div>单选题录入题目 -- 总分、选项</div>-->
  <div class="library-component library-choice-component">
    <el-form-item label="总分：" class="special-form-item">
      <el-input-number :disabled="true" :min="0" v-model="choiceConfig.totalScore"></el-input-number>
    </el-form-item>

    <el-form-item label="选项：">
      <el-radio-group style="display: inline-block" v-model="choiceConfig.radioTextOption" @change="setChoiceConfig">
        <el-radio-button label="文字"></el-radio-button>
        <el-radio-button label="图片"></el-radio-button>
      </el-radio-group>

      <template v-if="choiceConfig.radioTextOption=='文字'">
        <ul class="ul-library">
          <li class="li-library" v-for="(item,idx) in optionList" :key="'txt_'+idx">
            <div class="li-first"><el-input type="textarea" placeholder="请输入" v-model="item.txt" @change="setChoiceConfig"></el-input></div>
            <div class="li-second">
              <el-input-number :min="0" v-model="item.score" @change="setChoiceConfig"></el-input-number>
              <template v-if="idx>1">
                <el-tooltip content="删除" placement="top">
                  <i class="library-icon iconfont icon-guanbi" @click="delOptionFun(idx)"></i>
                </el-tooltip>
              </template>
            </div>
          </li>
          <!--
          <li class="li-library">
            <div class="li-first"><el-input placeholder="请输入"></el-input></div>
            <div class="li-second">
              <el-input-number :min="0" ></el-input-number>
            </div>
          </li>
          <li class="li-library">
            <div class="li-first"><el-input placeholder="请输入"></el-input></div>
            <div class="li-second">
              <el-input-number :min="0" ></el-input-number> <i class="library-icon iconfont icon-guanbi"></i>
            </div>
          </li>
          -->
        </ul>
      </template>
      <template v-else>
        <ul class="ul-library">
          <li class="li-library" v-for="(item,idx) in optionList" :key="'img_'+idx">
            <div class="li-first">
              <div class="add-title-item">
                <!--:class="item.img.length<1?'add-title-item-border':''"-->
                <template v-if="item.img.length<1">
                  <i class="library-icon iconfont icon-tupian"></i>添加图片
                </template>
                <template v-else>
                  <div class="option-img-box inline-block">
                    <img class="form-img " :src="item.img" alt="">
                  </div>
                  <div class="inline-block text-right">
                    <el-tooltip content="重新上传" placement="top">
                      <i class="library-icon iconfont icon-again"></i>
                    </el-tooltip>
                  </div>
                </template>
                <input class="ipt-file" :id="'hsqFileChoiceImg'+idx" type="file"
                       accept="image/*" @change="changeUploadFun('hsqFileChoiceImg'+idx,idx)">
              </div>
            </div>
            <div class="li-second">
              <el-input-number :min="0" v-model="item.score" @change="setChoiceConfig"></el-input-number>
              <template v-if="idx>1">
                <el-tooltip content="删除" placement="top">
                  <i class="library-icon iconfont icon-guanbi" @click="delOptionFun(idx)"></i>
                </el-tooltip>
              </template>
            </div>
          </li>

        </ul>
      </template>
      <div class="add-title-item" @click="AddOptionFun">添加选项</div>
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
                  img:'',
                  score:0
                },
                {
                  txt:'',
                  img:'',
                  score:0
                }
              ], //选项列表 目前文字和图片用一个数组

              choiceConfig:{
                radioTextOption:'文字', //放在里面是为了方便edit题目的时候,从父组件传config过来
                totalScore:0,
                scoreMap:[], //各个选项对应的分值集合--单选(与多选不一样,切忌。多选-有n个正确选项，就在索引为n-1的位置放totalScore的值)
                answerList:[],//答案--单选,将最高分的选项 对应的数值传过去即可(从1开始)
                optionMap:[], //最终的optionMap
              }
            }
        },
        mounted(){
          this.setConfigFromParentData();
        },
        watch: {
          choiceConfig:{
            handler(val,old){
              this.$emit("choiceChange",val);
            },
            //immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            deep: true

          }
        },
        methods: {
          //编辑时,把 父组件传来的数据,赋值到页面中
          setConfigFromParentData(){
            console.log('setConfigFromParentData choice',this.editToChildData);

            if(this.editToChildData && this.editToChildData.optionMap) {

              let tmpOptionList = [];
              this.editToChildData.optionMap.map((item,idx)=>{
                if(this.editToChildData.radioTextOption=='文字'){
                  tmpOptionList.push({
                    txt:item.itemValue.replace(/<br>/g,'\n'),
                    img:'',
                    score:this.editToChildData.scoreMap[idx] || 0
                  });
                }else{
                  tmpOptionList.push({
                    txt:'',
                    img:item.itemValue,
                    score:this.editToChildData.scoreMap[idx] || 0
                  });
                }

              });

              this.optionList = JSON.parse(JSON.stringify(tmpOptionList));

              this.choiceConfig = JSON.parse(JSON.stringify(this.editToChildData));
            }
          },

          //添加选项
          AddOptionFun(){
            let that = this;
            that.optionList.push(
              {
                txt:'',
                img:'',
                score:0
              }
            );
            console.log('添加选项之后----');
            that.choiceConfig.optionList = JSON.parse(JSON.stringify(that.optionList));
          },

          //选项上传图片
          changeUploadFun(eleId,idx){
            let that = this;
            that.$emit("uploadChange");
            let fd = new FormData();
            fd.append("file", document.getElementById(eleId).files[0]);
            fd.append("fileType", "HOMEWORK_QUESTION");

            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/file/upload_file.do');
            xhr.onload = function () {
              let backResponse = JSON.parse(xhr.responseText);
              if (backResponse.code == 200 && backResponse.result) {
                that.optionList[idx].img=backResponse.result;
                that.setChoiceConfig();
              } else {
                console.log('单选题选项上传图片失败 changeUploadFun')
              }
              that.$emit("uploadChange");

            };
            xhr.send(fd);

          },

          //删除选项
          delOptionFun(idx){
            let that = this;
            that.optionList.splice(idx,1);
            that.setChoiceConfig();
          },

          //设置choiceConfig中的totalScore、answerList、scoreMap optionList一变动就要调用
          setChoiceConfig(){
            let that = this;
            let scoreMapTemp = [];
            let optionMapTemp = [];
            that.optionList.map(op=>{
              scoreMapTemp.push(op.score);
              if(that.choiceConfig.radioTextOption=='文字'){
                optionMapTemp.push({
                    "itemType": "TEXT",
                    "itemValue": op.txt.replace(/\n/g,'<br>')
                  });
              }else{
                optionMapTemp.push({
                    "itemType": "IMG",
                    "itemValue": op.img
                  });
              }
            });
            let tempAnswerList = [];
            let maxInScores = Math.max.apply(Math, scoreMapTemp); //最高分
            let maxIdx = scoreMapTemp.indexOf(maxInScores)+1; //最高分的索引值+1
            tempAnswerList.push(maxIdx);
            that.choiceConfig.scoreMap = JSON.parse(JSON.stringify(scoreMapTemp));
            that.choiceConfig.totalScore = maxInScores;
            that.choiceConfig.answerList = JSON.parse(JSON.stringify(tempAnswerList));
            that.choiceConfig.optionMap = JSON.parse(JSON.stringify(optionMapTemp));
            console.log(that.choiceConfig)
          }
        }
    }
</script>
<style lang="scss" scoped>


</style>
