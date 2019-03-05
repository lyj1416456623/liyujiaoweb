<template>
    <!--<div>多选题录入题目 -- 总分、选项</div>
    注意:
    "scoreMap": [0,10,0,0], //分值———有n个正确选项，就在索引为n-1的位置放totalScore的值
    -->
  <div class="library-component">
    <el-form-item label="总分：" class="special-form-item">
      <el-input-number v-model="choiceMulConfig.totalScore" :min="1" @change="setChoiceMulConfig"></el-input-number>
    </el-form-item>
    <el-form-item label="选项：">
      <el-radio-group style="display: inline-block" v-model="choiceMulConfig.radioTextOption">
        <el-radio-button label="文字"></el-radio-button>
        <el-radio-button label="图片"></el-radio-button>
      </el-radio-group>

      <template v-if="choiceMulConfig.radioTextOption=='文字'">
        <ul class="ul-library">
          <li class="li-library" v-for="(item,idx) in optionList" :key="'txt_'+idx">
            <div class="li-first">
              <el-input type="textarea" placeholder="请输入" v-model="item.txt" @change="setChoiceMulConfig"></el-input>
            </div>
            <div class="li-second">
              <el-checkbox v-model="item.ifChecked" @change="setChoiceMulConfig">设置为答案</el-checkbox>
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
              <el-checkbox>设置为答案</el-checkbox>
            </div>
          </li>
          <li class="li-library">
            <div class="li-first"><el-input placeholder="请输入"></el-input></div>
            <div class="li-second">
              <el-checkbox>设置为答案</el-checkbox> <i class="library-icon iconfont icon-guanbi"></i>
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
                <input class="ipt-file" :id="'hsqFileMulChoiceImg'+idx" type="file"
                       accept="image/*" @change="changeUploadFun('hsqFileMulChoiceImg'+idx,idx)">
              </div>
            </div>
            <div class="li-second">
              <el-checkbox v-model="item.ifChecked" @change="setChoiceMulConfig">设置为答案</el-checkbox>
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
                  ifChecked:false
                },
                {
                  txt:'',
                  img:'',
                  ifChecked:false
                }
              ], //选项列表 目前文字和图片用一个数组

              choiceMulConfig:{
                radioTextOption:'文字', //放在里面是为了方便edit题目的时候,从父组件传config过来
                totalScore:1,
                scoreMap:[], //各个选项对应的分值集合--多选-有n个正确选项，就在索引为n-1的位置放totalScore的值
                answerList:[],//答案--多选,将答案的数值传过去(从1开始)
                optionMap:[],
              }
            }
        },
        mounted(){
          this.setConfigFromParentData();
        },
        watch: {
          choiceMulConfig:{
            handler(val,old){
              this.$emit("multipleChoiceChange",val);
            },
            //immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            deep: true

          }
        },
        methods: {
          //编辑时,把 父组件传来的数据,赋值到页面中
          setConfigFromParentData(){
            console.log('setConfigFromParentData multiple',this.editToChildData);

            if(this.editToChildData && this.editToChildData.optionMap) {
              let tmpOptionList = [];
              this.editToChildData.optionMap.map((item,idx)=>{
                let tmpChecked = this.editToChildData.answerList.indexOf(idx+1)!=-1?true:false;

                if(this.editToChildData.radioTextOption=='文字'){
                  tmpOptionList.push({
                    txt:item.itemValue.replace(/<br>/g,'\n'),
                    img:'',
                    ifChecked:tmpChecked
                  });
                }else{
                  tmpOptionList.push({
                    txt:'',
                    img:item.itemValue,
                    ifChecked:tmpChecked
                  });
                }

              });
              this.optionList = JSON.parse(JSON.stringify(tmpOptionList));

              this.choiceMulConfig = JSON.parse(JSON.stringify(this.editToChildData));
            }
          },

          //添加选项
          AddOptionFun(){
            let that = this;
            that.optionList.push(
              {
                txt:'',
                img:'',
                ifChecked:false
              }
            );
            that.choiceMulConfig.optionList = JSON.parse(JSON.stringify(that.optionList));
          },

          //选项上传图片
          changeUploadFun(eleId,idx){
            console.log(eleId,'----',idx);
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
                that.setChoiceMulConfig();
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
            console.log('删除选项之后----');
            that.setChoiceMulConfig();
          },

          //设置 choiceMulConfig 中的 answerList、scoreMap optionList一变动就要调用
          setChoiceMulConfig(){
            console.log('set多选config  setChoiceMulConfig ')
            let that = this;
            let scoreMapTemp = []; //多选,分数集合---有几个答案,totalScore就放在第几
            let tempAnswerList = [];
            let optionMapTemp = [];

            that.optionList.map((item,idx) => {
              scoreMapTemp.push(0);
              if(item.ifChecked){
                tempAnswerList.push(idx+1);
              }
              if(that.choiceMulConfig.radioTextOption=='文字'){
                optionMapTemp.push({
                  "itemType": "TEXT",
                  "itemValue": item.txt.replace(/\n/g,'<br>')
                });
              }else{
                optionMapTemp.push({
                  "itemType": "IMG",
                  "itemValue": item.img
                });
              }
            });

            scoreMapTemp[tempAnswerList.length-1] = that.choiceMulConfig.totalScore;
            that.choiceMulConfig.scoreMap = JSON.parse(JSON.stringify(scoreMapTemp));
            that.choiceMulConfig.answerList = JSON.parse(JSON.stringify(tempAnswerList));
            that.choiceMulConfig.optionMap = JSON.parse(JSON.stringify(optionMapTemp));
            console.log(that.choiceMulConfig)
          }
        }
    }
</script>
<style>

</style>
