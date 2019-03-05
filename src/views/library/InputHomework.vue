<template>
  <div>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <template v-if="prePage=='libraryhw'">
          <!--套题的课后作业页面-->
          <router-link :to="{ path: '/library' }">套题</router-link>
          <span>/</span>
          <a @click="goBackFun">课后作业</a>
        </template>
        <template v-else>
          <!--题库页面-->
          <router-link :to="{ path: '/warehouse' }">题库</router-link>
        </template>

        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">录入题目</a>
      </el-breadcrumb>
      <h4 class="common-title">录入题目</h4>
    </el-header>
    <div class="page-main">

        <div class="library-main">
          <h4 class="section-title">标签</h4>
          <div class="section-main">
            <div class="section-form">
              <div class="section-item">
                <label class="item-title">题型：</label>
                <div class="item-cont">
                  <el-select v-model="type" placeholder="请选择" @change="changeQuesTypeFun">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="section-item">
                <label class="item-title">年级：</label>
                <div class="item-cont">
                  <el-select v-model="grade" placeholder="请选择">
                    <el-option
                      v-for="item in gradeList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="section-item">
                <label class="item-title">难度：</label>
                <div class="item-cont">
                  <el-rate v-model="difficultLevel"></el-rate>
                </div>
              </div>
            </div>
            <div class="section-form">
              <div class="section-item" style="display:flex">
                <label class="item-title" style="margin-top:8px;">知识点：</label>
                <div class="item-cont" style="flex:1">
                  <div class="point-item" v-for="(point,idx) in pointTextArr" :key="idx">
                    {{point}} <i class="iconfont icon-guanbi remove-point" @click="delPointFun(idx)"></i>
                  </div>
                  <template v-if="pointTextArr.length<5">
                    <el-popover
                      ref="popAddPoint"
                      placement="bottom"
                      title="添加知识点"
                      width="246" v-model="pointVisible">
                      <el-cascader
                        ref="cascaderPoint"
                        expand-trigger="click"
                        :show-all-levels="false"
                        :options="pointList"
                        v-model="pointCascader"
                        style="width:245px;">
                      </el-cascader>
                      <div style="text-align: right; margin:16px 0 0 0">
                        <el-button size="mini" type="text" @click="pointCancel">取消</el-button>
                        <el-button type="primary" size="mini" @click="pointAdd">确定</el-button>
                      </div>
                      <div class="point-add-box"  slot="reference"><i class="iconfont icon-jiahao"></i> 添加</div>
                    </el-popover>
                  </template>
                  <template v-else>
                    <el-tooltip content="最多添加5个知识点哦" placement="top">
                      <div class="point-add-box point-add-box-disabled"><i class="iconfont icon-jiahao"></i> 添加</div>
                    </el-tooltip>
                  </template>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="library-main">
          <h4 class="section-title">内容</h4>
          <div class="section-main">
            <el-form ref="form"  label-width="90px" class="library-form">
              <!--:model="form"-->
              <el-form-item label="题干：" :class="ifTitleError?'is-error':''">
                <el-input type="textarea"
                          placeholder="请输入" style="width:600px;" v-model="titleList.txt"></el-input>
                <div class="library-add-box" v-if="titleList.img.length<1">
                  <div class="add-title-item inline-block">
                    <i class="iconfont icon-tupian"></i>添加图片
                    <input class="ipt-file" id="hsqFileTitleImg" type="file"
                           accept="image/*" @change="changeFileFunc('img','title','hsqFileTitleImg')">
                  </div>
                </div>

                <div class="library-add-box" v-if="titleList.img.length>0">
                  <div class="add-title-item inline-block add-title-item-border">
                    <div class="option-img-box inline-block">
                      <img class="form-img " :src="titleList.img" alt="">
                    </div>
                    <input class="ipt-file" id="hsqFileTitleImg1" type="file"
                           accept="image/*" @change="changeFileFunc('img','title','hsqFileTitleImg1')">
                    <div class="inline-block text-right">
                      <el-tooltip content="重新上传" placement="top">
                        <i class="iconfont icon-again"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="inline-block">
                    <el-tooltip content="删除" placement="top">
                      <i class="iconfont icon-guanbi" @click="delFileFun('img','title')"></i>
                    </el-tooltip>
                  </div>
                </div>


                <div class="library-add-box" v-if="titleList.audio.length<1">
                  <div class="add-title-item inline-block">
                    <i class="iconfont icon-luyin"></i>添加音频
                    <input class="ipt-file" id="hsqFileTitleAudio" type="file"
                           accept="audio/mpeg" @change="changeFileFunc('audio','title','hsqFileTitleAudio')">
                  </div>
                </div>

                <div class="library-add-box" v-if="titleList.audio.length>0">
                  <div class="add-title-item inline-block add-title-item-border">
                    <input class="ipt-file" id="hsqFileTitleAudio1" type="file"
                           accept="audio/mpeg" @change="changeFileFunc('audio','title','hsqFileTitleAudio1')">
                    <div class="option-img-box inline-block">
                      <audio :src="titleList.audio" controls></audio>
                    </div>
                    <div class="inline-block text-right">
                      <el-tooltip content="重新上传" placement="top">
                        <i class="iconfont icon-again"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="inline-block">
                    <el-tooltip content="删除" placement="top">
                      <i class="iconfont icon-guanbi" @click="delFileFun('audio','title')"></i>
                    </el-tooltip>
                  </div>
                </div>

              </el-form-item>

              <div class="el-form-item" :class="ifOptionError?'is-error':''">
                <template v-if="editId!=null && editId!='null'">
                  <!--编辑题目-->
                  <template v-if="type=='CHOICE'">
                    <choice-library @choiceChange="childComponentChange" @uploadChange="childUploadChange"
                                    v-if="editToChildData.optionMap"
                                    :editToChildData="editToChildData"></choice-library>
                  </template>
                  <template v-if="type=='MULTIPLE_CHOICE'">
                    <multiple-library @multipleChoiceChange="childComponentChange" @uploadChange="childUploadChange"
                                      v-if="editToChildData.optionMap"
                                      :editToChildData="editToChildData"></multiple-library>
                  </template>
                  <template v-if="type=='FILL_THE_BLANKS'">
                    <fillblank-library @fillBlankChange="childComponentChange" v-if="editToChildData.answerList"
                                       :editToChildData="editToChildData"></fillblank-library>
                  </template>
                  <template v-if="type=='CONNECTION_PROBLEM'">
                    <connect-library @connectionChange="childComponentChange" v-if="editToChildData.leftDataList"
                                     :editToChildData="editToChildData"></connect-library>
                  </template>
                  <template v-if="type=='SUBJECTIVE'">
                    <subjective-library @subjectiveChange="childComponentChange" v-if="editToChildData.topic"
                                        :editToChildData="editToChildData"></subjective-library>
                  </template>
                </template>
                <template v-else>
                  <!--添加-->
                  <template v-if="type=='CHOICE'">
                    <choice-library @choiceChange="childComponentChange" @uploadChange="childUploadChange"></choice-library>
                  </template>
                  <template v-if="type=='MULTIPLE_CHOICE'">
                    <multiple-library @multipleChoiceChange="childComponentChange" @uploadChange="childUploadChange"></multiple-library>
                  </template>
                  <template v-if="type=='FILL_THE_BLANKS'">
                    <fillblank-library @fillBlankChange="childComponentChange"></fillblank-library>
                  </template>
                  <template v-if="type=='CONNECTION_PROBLEM'">
                    <connect-library @connectionChange="childComponentChange"></connect-library>
                  </template>
                  <template v-if="type=='SUBJECTIVE'">
                    <subjective-library @subjectiveChange="childComponentChange"></subjective-library>
                  </template>
                </template>
              </div>
              <el-form-item label="解析：">
                <el-input type="textarea" placeholder="请输入" style="width:600px;" v-model="explainList.txt"></el-input>
                <div class="library-add-box" v-if="explainList.img.length<1">
                  <div class="add-title-item inline-block">
                    <i class="iconfont icon-tupian"></i>添加图片
                    <input class="ipt-file" :id="'hsqFileExplainImg'" type="file"
                           accept="image/*" @change="changeFileFunc('img','explain','hsqFileExplainImg')">
                  </div>
                </div>

                <div class="library-add-box" v-if="explainList.img.length>0">
                  <div class="add-title-item inline-block add-title-item-border">
                    <div class="option-img-box inline-block">
                      <img class="form-img " :src="explainList.img" alt="">
                    </div>
                    <input class="ipt-file" :id="'hsqFileExplainImg1'" type="file"
                           accept="image/*" @change="changeFileFunc('img','explain','hsqFileExplainImg1')">
                    <div class="inline-block text-right">
                      <el-tooltip content="重新上传" placement="top">
                        <i class="iconfont icon-again"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="inline-block">
                    <el-tooltip content="删除" placement="top">
                      <i class="iconfont icon-guanbi" @click="delFileFun('img','explain')"></i>
                    </el-tooltip>
                  </div>
                </div>

                <!--
                刘不知小伙伴说,解析里面一般没有视频。所以,这里先隐藏。-->
                <div class="library-add-box" v-if="explainList.audio.length<1">
                  <div class="add-title-item inline-block">
                    <i class="iconfont icon-luyin"></i>添加音频
                    <input class="ipt-file" :id="'hsqFileExplainAudio'" type="file"
                           accept="audio/mpeg" @change="changeFileFunc('audio','explain','hsqFileExplainAudio')">
                  </div>
                </div>

                <div class="library-add-box" v-if="explainList.audio.length>0">
                  <div class="add-title-item inline-block add-title-item-border">
                    <input class="ipt-file" :id="'hsqFileExplainAudio1'" type="file"
                           accept="audio/mpeg" @change="changeFileFunc('audio','explain','hsqFileExplainAudio1')">
                    <div class="option-img-box inline-block">
                      <audio :src="explainList.audio" controls></audio>
                    </div>
                    <div class="inline-block text-right">
                      <i class="iconfont icon-again"></i>
                    </div>
                  </div>
                  <div class="inline-block">
                    <i class="iconfont icon-guanbi" @click="delFileFun('audio','explain')"></i>
                  </div>
                </div>


              </el-form-item>
            </el-form>
          </div>
        </div>


    </div>
    <el-footer class="library-footer">
      <el-button plain @click="goBackFun">返回</el-button>
      <el-button type="primary" @click="saveFun">保存</el-button>
    </el-footer>

    <!--上传中-->
    <div class="uploading-box" v-show="ifShowUploading">
      <div class="uploading-bg"></div>
      <div class="uploading-main">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/uploading.gif" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import AudioPc from '@/components/AudioComponent'
  import ChoiceLibrary from './HomeworkComponent/Choice.vue'
  import MultipleLibrary from './HomeworkComponent/MultipleChoice.vue'
  import FillblankLibrary from './HomeworkComponent/FillBlank.vue'
  import ConnectLibrary from './HomeworkComponent/Connection.vue'
  import SubjectiveLibrary from './HomeworkComponent/Subjective.vue'
  export default{
    name: '',
    props: [],
    components: {AudioPc,ChoiceLibrary,MultipleLibrary,FillblankLibrary,ConnectLibrary,SubjectiveLibrary},
    data(){
      return {
        courseId:null, //prepage==libraryhw 时,课程id
        lessonNum:null, // prepage==libraryhw 时,第几节课
        prePage:'', //从哪个页面过来  libraryhw--套题的课后作业; warehouse--题库
        editId:null, // prepage==warehouse 时,编辑题目

        typeList:[
          {
            value: 'CHOICE',
            label: '单选题'
          },
          {
            value: 'MULTIPLE_CHOICE',
            label: '多选题'
          },
          {
            value: 'FILL_THE_BLANKS',
            label: '填空题'
          },
          {
            value: 'CONNECTION_PROBLEM',
            label: '连线题'
          },
          {
            value: 'SUBJECTIVE',
            label: '简答题'
          }
        ], //题型列表
        gradeList:[], //年级列表
        pointList:[], //知识点列表
        pointCascader:[],//当前知识点el-cascader选择的value集合(value与id必须一致,集合格式是【父id,子id,孙id,....】)

        pointTextArr:[], //已选择的知识点 文字 集合 --用于展示
        pointIdArr:[],//已选择的知识点 id 集合 ---- 格式[[fu,zi,sun...],[fu,zi,sun...],...] --估计之后就用不到了
        pointLastIdArr:[],//已选择的知识点 最后一个id 集合,格式【id,id,id...】,length==pointIdArr.length
        pointVisible:false, //知识点对应的popover是否显示

        type: "CHOICE", //题型:单选、多选、简答、填空、。。。。
        grade: "GRADE_THREE",//年级
        difficultLevel: 1,

        titleList:{
          txt:'',
          img:'',
          audio:''
        }, //题干列表,文案、图片、音频
        ifTitleError:false, //题干的文案输入框是否要标红(标红表示没有填写)
        ifOptionError:false, //选项 是否要标红(标红表示没有填写)

        explainList:{
          txt:'',
          img:'',
          audio:'' // 解析中没有audio
        }, //解析列表,文案、图片、音频

        childParam:{},//子组件传过来的数据 childComponentChange

        editToChildData:{}, //编辑时,传给子组件的书,格式与childParam一样

        ifShowUploading:false, //上传中 loading

      }
    },
    mounted(){
      let that = this;

      that.getPointList(); //获取知识点
      that.getGradeList(); //获取班级列表

      let params = that.$route.params;
      if(params.courseId){
        that.courseId = params.courseId;
      }
      if(params.idx){
        that.lessonNum = params.idx;
      }
      if(params.grade && params.grade!='null'){
        that.grade = params.grade;
      }

      if(params.page){
        that.prePage = params.page;
      }
      if(params.editId){
        that.editId = params.editId;
      }
      if(that.editId!=null && that.editId != 'null'){
        that.getQuestionInfo();
      }

    },
    watch: {
    },
    methods: {
      //子组件上传图片的时候,显示loading
      childUploadChange(){
        console.log('childUploadChange.......');
        let tmpShowLoading = this.ifShowUploading;
        this.ifShowUploading = !tmpShowLoading;
      },

      //题型切换
      changeQuesTypeFun(){
        let that = this;

        that.ifOptionError = false; //false--选项不标红框
        that.childParam = {}; //切换时,子组件传来的参数应该清空

        //编辑+切换题型,传递给子组件的数据应该变为默认值
        if(that.editId!=null && that.editId!='null'){
          console.log('编辑时,切换题型了');
          that.editToChildData = {};

          let tmpChildParam = {};
          switch (that.type) {
            case 'SUBJECTIVE':
              tmpChildParam = {
                totalScore:1, //总分
                topic:'简答题', //简答题的标签
                answerWay:["TEXT"],
                scoreMap:[1],
              };

              break;
            case 'CHOICE':
            case 'MULTIPLE_CHOICE':
              tmpChildParam = {
                radioTextOption:'文字', //放在里面是为了方便edit题目的时候,从父组件传config过来
                totalScore:0,
                scoreMap:[0,0], //各个选项对应的分值集合--单选(与多选不一样,切忌。多选-有n个正确选项，就在索引为n-1的位置放totalScore的值)
                answerList:[],//答案--单选,将最高分的选项 对应的数值传过去即可(从1开始)
                optionMap:[
                  {itemType: "TEXT", itemValue: ""},
                  {itemType: "TEXT", itemValue: ""}
                ], //最终的optionMap
              };

              break;
            case 'FILL_THE_BLANKS':
              tmpChildParam = {
                ifAnswerWithOrder:true, //  true--有序;false--乱序匹配
                totalScore:2,
                scoreMap:[1,1], //填空题,每个选项对应一个分值
                answerList:['',''],//答案--简答题的选项 集合
              };

              break;
            case 'CONNECTION_PROBLEM':
              tmpChildParam={
                totalScore:2,
                leftDataList:['',''],
                rightDataList:['',''],
                scoreMap:[1,1], //每个选项对应一个分值
              };
              break;
          }
          that.editToChildData = JSON.parse(JSON.stringify(tmpChildParam));
          console.log(tmpChildParam, '--- 编辑题目时,切换题型')
        }
      },

      //编辑题目时,获取题目信息
      getQuestionInfo(){
        let that = this;
        that.request({
          method: 'post',
          url: '/question/get_question_by_id.do',
          param: {id:that.editId},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              let tmpEditData = result.result;
//              that.editData = tmpEditData;
//              console.log(that.editData, '------ that.editData');

              that.setChildConfig(tmpEditData); //设置传给子组件的数据

            } else {
              that.$message.error('获取题目信息失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取题目信息失败,解决错误后,刷新重试。')

          }
        });
      },

      //编辑题目时,设置传递给子组件的参数,要与子组件传过来的childparam一致
      setChildConfig(data){
        let that = this;
        let tmpEditData = data;

        //设置数据
        that.type = tmpEditData.type;
        that.grade = tmpEditData.grade;
        that.difficultLevel = tmpEditData.difficultLevel;

        let tmpPointIds = [];
        let tmpPointTxts = [];
        if(tmpEditData.points){
          tmpEditData.points.map(item=>{
            tmpPointIds.push(item.id.toString());
            tmpPointTxts.push(item.name);
          });
        }
        that.pointLastIdArr = JSON.parse(JSON.stringify(tmpPointIds));
        that.pointTextArr = JSON.parse(JSON.stringify(tmpPointTxts));
        if(tmpEditData.questionDataObject) {
          //题目
          if (tmpEditData.questionDataObject.title) {
            tmpEditData.questionDataObject.title.map(item=> {
              if (item.itemType == 'TEXT') {
                that.titleList.txt = item.itemValue.replace(/<br>/g,'\n');
              }
              if (item.itemType == 'IMG') {
                that.titleList.img = item.itemValue;
              }
              if (item.itemType == 'AUDIO') {
                that.titleList.audio = item.itemValue;
              }
            });
          }

          //解析
          if (tmpEditData.questionDataObject.explainList) {
            tmpEditData.questionDataObject.explainList.map(item=> {
              if (item.itemType == 'TEXT') {
                that.explainList.txt = item.itemValue.replace(/<br>/g,'\n');
              }
              if (item.itemType == 'IMG') {
                that.explainList.img = item.itemValue;
              }
              if (item.itemType == 'AUDIO') {
                that.explainList.audio = item.itemValue;
              }
            });
          }

          //传给子组件的数据childParam
          let tmpChildParam = {};
          switch (tmpEditData.type) {
            case 'SUBJECTIVE':
              tmpChildParam['totalScore'] = tmpEditData.questionDataObject.totalScore;
              tmpChildParam['scoreMap'] = tmpEditData.questionDataObject.scoreMap;
              tmpChildParam['topic'] = tmpEditData.questionDataObject.topic;
              tmpChildParam['answerWay'] = tmpEditData.questionDataObject.answerWay;

              break;
            case 'CHOICE':
            case 'MULTIPLE_CHOICE':
              tmpChildParam['totalScore'] = tmpEditData.questionDataObject.totalScore;
              tmpChildParam['scoreMap'] = tmpEditData.questionDataObject.scoreMap;
              tmpChildParam['answerList'] = tmpEditData.questionDataObject.answerList;
              tmpChildParam['optionMap'] = tmpEditData.questionDataObject.optionMap;

              let tmpRadio = '文字';
              try{
                tmpRadio = tmpEditData.questionDataObject.optionMap[0].itemType=='TEXT'?'文字':'图片';
              }catch(e){

              }
              tmpChildParam['radioTextOption']= tmpRadio;

              break;
            case 'FILL_THE_BLANKS':
              tmpChildParam['totalScore'] = tmpEditData.questionDataObject.totalScore;
              tmpChildParam['scoreMap'] = tmpEditData.questionDataObject.scoreMap;
              tmpChildParam['ifAnswerWithOrder'] = tmpEditData.questionDataObject.ifAnswerWithOrder;
              tmpChildParam['answerList'] = tmpEditData.questionDataObject.answerList;

              break;
            case 'CONNECTION_PROBLEM':
              tmpChildParam['totalScore'] = tmpEditData.questionDataObject.totalScore;
              tmpChildParam['scoreMap'] = tmpEditData.questionDataObject.scoreMap;
              tmpChildParam['leftDataList'] = tmpEditData.questionDataObject.leftDataList;
              tmpChildParam['rightDataList'] = tmpEditData.questionDataObject.rightDataList;
              break;
          }

          that.editToChildData = JSON.parse(JSON.stringify(tmpChildParam));
          console.log(tmpChildParam, '--- tmpChildparam')
        }else{
          console.log(tmpEditData);
          alert('返回的数据不全');

        }

      },

      //获取知识点列表
      getPointList(){
        let that = this;
        that.request({
          method: 'post',
          url: '/question/point/get_points.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              that.pointList = result.result;
              console.log(that.pointList, '------ that.pointList');
            } else {
              that.$message.error('获取知识点失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取知识点失败,刷新重试。')

          }
        });
      },

      //获取年级列表
      getGradeList(){
        let that = this;
        that.request({
          method: 'post',
          url: '/course/get_grade.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              that.gradeList = result.result;
              console.log(that.gradeList, '------ that.gradeList');
            } else {
              that.$message.error('获取年级列表失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('获取年级列表失败,刷新重试。')

          }
        });
      },

      //知识点--确认添加
      pointAdd(){
        let that = this;
        let tmpIds = that.pointCascader; //['1','3','4']
        let tmpLabels = that.$refs['cascaderPoint'].currentLabels; //["基础", "填空", "语法"]
        console.log(tmpLabels,' labels');

        if(tmpIds.length>0 && tmpLabels.length>0){
          let pointTempId = tmpIds[tmpIds.length-1];
          let pointTempText = tmpLabels[tmpLabels.length-1];
          if(that.pointLastIdArr.length<1 || that.pointLastIdArr.indexOf(pointTempId)==-1){
            that.pointLastIdArr.push(pointTempId);
            that.pointTextArr.push(pointTempText);
            that.pointIdArr.push(tmpIds);
            console.log('add 知识点。。。。。')
            console.log(that.pointIdArr,'    pointIdArr')
            console.log(that.pointTextArr)
            console.log(that.pointLastIdArr, '   pointLastIdArr')
          }
        }

        that.pointClear();

      },

      //知识点--取消添加
      pointCancel(){
        this.pointClear();
      },

      //知识点相关数据恢复为默认
      pointClear(){
        this.pointVisible = false; //知识点popover不显示
        this.pointCascader = []; //当前知识点cascader选择的value(与id必须一致)
      },

      //知识点--删除操作
      delPointFun(idx){
        let that = this;
        that.pointTextArr.splice(idx,1);
        that.pointIdArr.splice(idx,1);
        that.pointLastIdArr.splice(idx,1);
        console.log('delete 知识点。。。。。delete之后')
        console.log(that.pointIdArr,'   pointIdArr delete')
        console.log(that.pointTextArr)
        console.log(that.pointLastIdArr,'   pointLastIdArr')
      },

      /* 题干、解析--上传图片或音频
        type:img/audio   上传的是图片还是音频
        label:title/explain  题干/解析中的上传
        ele:upload控件的id
      */
      changeFileFunc(type,label,ele){
        let that = this;
        that.ifShowUploading = true; //上传中loading是否显示
        let fd = new FormData();
        fd.append("file", document.getElementById(ele).files[0]);
        fd.append("fileType", "HOMEWORK_QUESTION");

        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/file/upload_file.do');
        xhr.onload = function () {
          console.log(xhr.responseText, "返回   ");
          let backResponse = JSON.parse(xhr.responseText);
          if (backResponse.code == 200 && backResponse.result) {
            if (label == 'title') { //题干
              let oldObj = Object.assign({}, that.titleList); //浅克隆
              if (type == 'img') {
                oldObj.img = backResponse.result;
              } else {
                oldObj.audio = backResponse.result;
              }
              that.titleList = oldObj;
              console.log(that.titleList, '-----upload题干之后');
            }
            if (label == 'explain') { //解析  explainList
              let oldObj = Object.assign({}, that.explainList); //浅克隆
              if (type == 'img') {
                oldObj.img = backResponse.result;
              } else {
                oldObj.audio = backResponse.result;
              }
              that.explainList = oldObj;
              console.log(that.explainList, '-----upload 解析 之后');
            }
            that.ifShowUploading = false; //上传中loading是否显示
          } else {
            console.log('上传失败 changeFileFunc')
            that.ifShowUploading = false; //上传中loading是否显示
          }

        };
        xhr.send(fd);
      },

      //删除题干、解析中已上传的图片或音频
      delFileFun(type,label){
        let that = this;
        if (label == 'title') { //题干
          let oldObj = Object.assign({}, that.titleList); //浅克隆
          if (type == 'img') {
            oldObj.img = '';
          } else {
            oldObj.audio = '';
          }
          that.titleList = oldObj;
          console.log(that.titleList, '-----删除 题干 之后');
        }
        if (label == 'explain') { //解析  explainList
          let oldObj = Object.assign({}, that.explainList); //浅克隆
          if (type == 'img') {
            oldObj.img = '';
          } else {
            oldObj.audio = '';
          }
          that.explainList = oldObj;

          console.log(that.explainList, '-----删除 解析 之后');
        }
      },


      // 各个题型组件 返回的 总分、选项 等相关数据
      childComponentChange(val){
        console.log('题型子组件 返回的数据   ',val);
        this.childParam = JSON.parse(JSON.stringify(val));
      },

      //保存按钮
      saveFun(){
        let that = this;
        console.log('保存题目  ',that);

        let typeParam = that.type; //题型参数
        let titleParam = []; //题干参数
        if(that.titleList.txt.length>0){
          that.ifTitleError = false;
          titleParam.push(
            {
              "itemType": "TEXT",
              "itemValue": that.titleList.txt.replace(/\n/g,'<br>')
            }
          );
        }else{
          that.ifTitleError = true;
          return false;
        }
        if(that.titleList.img.length>0){
          titleParam.push(
            {
              "itemType": "IMG",
              "itemValue": that.titleList.img
            }
          );
        }
        if(that.titleList.audio.length>0){
          titleParam.push(
            {
              "itemType": "AUDIO",
              "itemValue": that.titleList.audio
            }
          );
        }

        let explainParam = []; //解析参数
        if(that.explainList.txt.length>0){
          explainParam.push(
            {
              "itemType": "TEXT",
              "itemValue": that.explainList.txt.replace(/\n/g,'<br>')
            }
          );
        }
        if(that.explainList.img.length>0){
          explainParam.push(
            {
              "itemType": "IMG",
              "itemValue": that.explainList.img
            }
          );
        }
        if(that.explainList.audio.length>0){
          explainParam.push(
            {
              "itemType": "AUDIO",
              "itemValue": that.explainList.audio
            }
          );
        }


        let questionDataParam = {
          "title":JSON.parse(JSON.stringify(titleParam)),
          "questionType":typeParam,
          "explainList":JSON.parse(JSON.stringify(explainParam)), //解析 explainParam

          //          "totalScore":0,
          //          "answerList":[], //正确答案,简答题没有
          //          "scoreMap":0, //分数集合
          //          "optionMap":[], //选项,简答题、填空题、连线题没有
          //          "leftDataList":[], //连线题独有
          //          "leftDataList":[],//连线题独有
          //          "answerWay":[],//作答方式,简答题独有

        }; //questionData

        console.log(that.childParam,'  saveFun switch之前 childParam');
        console.log(that.childParam['totalScore'],"that.childParam['totalScore']");
        if(that.childParam['totalScore']==undefined){
          that.ifOptionError = true;
          return false;
        }else{
          that.ifOptionError = false;
        }

        switch(typeParam){
          case 'SUBJECTIVE':
            if(that.childParam['topic']==undefined){
              that.ifOptionError = true;
              return false;
            }else{
              that.ifOptionError = false;
            }
            questionDataParam['totalScore']=that.childParam['totalScore'] || 0;
            questionDataParam['topic']=that.childParam['topic'] || '简答题';
            questionDataParam['answerWay']=that.childParam['answerWay'] || [];
            let scoreMap = [];
            scoreMap.push(questionDataParam['totalScore']);
            questionDataParam['scoreMap']= scoreMap || [0];
            break;
          case 'CHOICE':
            let ifError = false; //是否有未填写的选项
            that.childParam['optionMap'].map(item=>{
              if(item.itemValue.length<1){
                ifError = true;
              }
            });

            that.ifOptionError = ifError;
            if(ifError){
              return false;
            }

            let ifHasScoreMoreZero = true; //是否分数列表中,有分数大于0分(即设置了正确答案);true--设置了正确答案
            if(that.childParam['totalScore']==undefined || parseInt(that.childParam['totalScore']) == 0){
              ifHasScoreMoreZero = false;
            }
            if(ifHasScoreMoreZero){ //设置了正确答案
              that.ifOptionError  = false;
            }else{ //没有设置正确答案
              that.ifOptionError  = true;
            }
            if(that.ifOptionError){
              that.$message({
                showClose: true,
                message: '没有给正确选项赋分，不能保存',
                type: 'error',
                duration:5000
              });
              return false;
            }

            questionDataParam['totalScore']=that.childParam['totalScore'] || 0;
            questionDataParam['answerList']=that.childParam['answerList'] || [];
            questionDataParam['scoreMap']=that.childParam['scoreMap'] || [];
            questionDataParam['optionMap']=that.childParam['optionMap'] || [];
            break;
          case 'MULTIPLE_CHOICE':

            let ifMulError = false; //是否有未填写的选项
            that.childParam['optionMap'].map(item=>{
              if(item.itemValue.length<1){
                ifMulError = true;
              }
            });

            that.ifOptionError = ifMulError;
            if(ifMulError){
              return false;
            }

            let ifHasAnaswer = false; //是否选择了正确答案  true--有正确答案
            if(that.childParam['answerList'].length>0) {
              ifHasAnaswer = true;
            }
            if(ifHasAnaswer){ //有正确答案
              that.ifOptionError  = false;
            }else{ //没有设置正确答案
              that.ifOptionError  = true;
            }
            if(that.ifOptionError){
              that.$message({
                showClose: true,
                message: '多选题至少有一个以上的正确答案',
                type: 'error',
                duration:5000
              });
              return false;
            }

            questionDataParam['totalScore']=that.childParam['totalScore'] || 0;
            questionDataParam['answerList']=that.childParam['answerList'] || [];
            questionDataParam['scoreMap']=that.childParam['scoreMap'] || [];
            questionDataParam['optionMap']=that.childParam['optionMap'] || [];
            break;
          case 'FILL_THE_BLANKS':
            if(that.childParam['ifAnswerWithOrder']==undefined){
              that.ifOptionError = true;
              return false;
            }else{
              that.ifOptionError = false;
            }

            let ifFillError = false; //是否有未填写的选项
            that.childParam['answerList'].map(item=>{
              if(item.length<1){
                ifFillError = true;
              }
            });

            that.ifOptionError = ifFillError;
            if(ifFillError){
              return false;
            }

            questionDataParam['ifAnswerWithOrder']=that.childParam['ifAnswerWithOrder'];
            questionDataParam['totalScore']=that.childParam['totalScore'] || 0;
            questionDataParam['scoreMap']=that.childParam['scoreMap'] || [];
            questionDataParam['answerList']=that.childParam['answerList'] || [];

            break;
          case 'CONNECTION_PROBLEM':
            if(that.childParam['leftDataList']==undefined){
              that.ifOptionError = true;
              return false;
            }else{
              that.ifOptionError = false;
            }

            let ifConError = false; //是否有未填写的选项
            that.childParam['leftDataList'].map(item=>{
              if(item.length<1){
                ifConError = true;
              }
            });
            that.childParam['rightDataList'].map(item=>{
              if(item.length<1){
                ifConError = true;
              }
            });

            that.ifOptionError = ifConError;
            if(ifConError){
              return false;
            }

            questionDataParam['totalScore']=that.childParam['totalScore'] || 0;
            questionDataParam['scoreMap']=that.childParam['scoreMap'] || [];
            questionDataParam['leftDataList']=that.childParam['leftDataList'] || [];
            questionDataParam['rightDataList']=that.childParam['rightDataList'] || [];
            break;
        }
        let saveParam = {
          type:typeParam,
          grade:that.grade,
          lessonModule:'HOMEWORK',
          difficultLevel:that.difficultLevel,
          points:that.pointLastIdArr.join(','),
          // title:'', //图文的title,作业这里就为空或者不传
          questionData:JSON.stringify(questionDataParam),
        }
        if(that.courseId !=null && that.courseId !='null'){
          saveParam.courseId = that.courseId;
        }
        if(that.lessonNum !=null && that.lessonNum !='null'){
          saveParam.lessonIndex = that.lessonNum;
        }

        let url='/question/save_question.do';
        if(that.editId!=null && that.editId!='null'){
          console.log('edit edit .......')
          //编辑
          url='/question/update_question.do';
          saveParam.id = that.editId;
        }

        that.request({
          method: 'post',
          url: url,
          param: saveParam,
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              that.goBackFun();
            } else {
              that.$message.error('题库 添加 失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('题库 添加 失败,处理异常之后再重试。')

          }
        });

      },

      //返回
      goBackFun(){
        let that = this;
        that.$router.go(-1);
      }

    }
  }
</script>
<style lang="scss" scoped>
  /*上传gif*/
  .uploading-box{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:101;

  .uploading-bg{
    background:rgba(0,0,0,0.32);
    width: 100%;
    height: 100%;
  }
  .uploading-main{
    position: absolute;
    top:40%;
    left:50%;
    text-align: center;
  img{
    width: 120px;
    height: 120px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 4px 0px rgba(0,0,0,0.08);
    border-radius:12px;
  }
  }

  }

  .page-main{
    padding-bottom: 60px;
  }


  .library-main{
    margin: 24px;
    background: #fff;
  .section-title{
    border-bottom:1px solid #E0E0E0;
    padding:12px 24px;
    font-size:16px;
    color:#222;
    font-weight: 500;
    line-height: 24px;
  }
  .section-main{
    padding:24px;
    font-size:16px;
    font-weight:400;
    color:#606060;
    line-height:22px;

  .section-form{
    padding-bottom: 24px;

  .section-item{
    display: inline-block;
    margin-right:20px;

  .item-title{
    width: 64px;
    display: inline-block;
    text-align: right;
  }
  .item-cont{
    display: inline-block;
  }
  .point-item{
    display: inline-block;
    background: #f5f5f5;
    border-radius:4px;
    padding:8px;
    font-size:16px;
    color:#606060;
    line-height: 22px;
    font-weight: normal;
    margin-right:8px;
  .remove-point{
    color:#e0e0e0;
    font-size:20px;
    padding: 0 0 0 4px;
    cursor: pointer;
  }
  .remove-point:hover{
    color: #f08d00;
  }
  }

  .point-add-box{
    display: inline-block;
    border-radius:4px;
    padding:8px;
    font-size:16px;
    color: #bdbdbd;
    background: #fff;
    border:1px dashed #e0e0e0;
    cursor:pointer;
  .iconfont{
    font-size:16px;
  }
  }
  .point-add-box-disabled{
    background: #f5f5f5;
    cursor: not-allowed;
  }

  }
  }
  .section-form:last-child{
    padding-bottom: 0;
  }
  }

  /*library-main end*/
  }


  .library-form{
  .library-add-box{
    margin-top:8px;

  .add-title-item{
    font-size:16px;
    color:#606060;

    width:582px;
    padding:8px;
    line-height:24px;
    border-radius:4px;
    border:1px dashed #E0E0E0;
    cursor: pointer;
    position: relative;

  .iconfont{
    font-size: 20px;
    color:#bdbdbd;
    padding-right:8px;
    display: inline-block;
    vertical-align: middle;
  }

  .ipt-file{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    opacity: 0;
    cursor: pointer;
  }

  .option-img-box{
    width: 90%;

  }
  }

  .add-title-item:hover{
    color:#F08D00;
    border:1px dashed #F08D00;
  .iconfont{
    color:#F08D00;
  }
  }

  .add-title-item-border{
    border:1px solid #E0E0E0;
  }
  .add-title-item-border:hover{
    border:1px solid #F08D00;
  }
  }

  }
  /*library-form*/


  /*footer*/
  .library-footer{
    position: fixed;
    bottom:0;
    left:240px;
    right:0;
    z-index: 5;
    background: #fff;
    text-align: right;
    padding:12px 24px 12px 0;
  }


  /*common*/
  .form-img{
    height:104px;
    max-width:100%;
  }

  .inline-block{
    display: inline-block;
    vertical-align: middle;
  }

</style>
<style lang="scss">
  @import "../../style/librarycomponent.scss";

  .ul-library .el-input__inner{
    max-width: 600px!important;
    display: inline-block;
  }
  .ul-library .el-input-number{
    display: inline-block;
  }
</style>
