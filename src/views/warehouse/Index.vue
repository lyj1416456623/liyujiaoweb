<template>
  <div>
    <el-container>
      <el-header class="auth-header statistics-header">
        <el-breadcrumb class="ziyue-breadcrumb">
          <router-link :to="{ path: '/manageIndex' }">首页</router-link>
          <span>/</span>
          <router-link :to="{ path: '/warehouse' }">题库</router-link>
        </el-breadcrumb>
        <h4 class="auth-title">题库</h4>
        <el-tabs v-model="activeName" class="tabs-header">
          <el-tab-pane label="图文" name="IMAGE_TEXT"></el-tab-pane>
          <el-tab-pane label="题目" name="QUESTION"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container class="warehouse-content">
        <div class="image-text-content" v-if="activeName=='IMAGE_TEXT'">
          <div class="filter-content">
            <div class="filter-item">
              类型：
              <span v-for="item in lessonModuleData" :class="item.value==lessonModule?'active':''"
                    @click="selectTextType(item)">{{item.name}}</span>
            </div>
            <div class="filter-item">
              难度：
              <span v-for="item in difficultLevelData" :class="item.value==imageDifficultLevel?'active':''"
                    @click="selectTextDifficult(item)">{{item.name}}</span>
            </div>
            <div class="filter-item">
              年级：
              <span v-for="item in gradeList" :class="item.value==imageGradeValue?'active':''"
                    @click="selectTextGrade(item)">{{item.name}}</span>
            </div>
            <div class="filter-item-point">
              知识点：
              <el-cascader
                ref="cascaderPoint"
                expand-trigger="click"
                :options="pointList"
                v-model="imagePointIds"
                class="casader-point"
              >
              </el-cascader>
            </div>
          </div>
          <div class="image-text-list">
            <div class="add-question" @click="jumpAddText">
              <i class="iconfont icon-jiahao"></i>录入图文
            </div>
            <div class="image-text-item detail-list" v-for="(item,idx) in imageData" v-if="imageData.length>0">
              <div class="detail-item">
                <image-text :imageTextData="item" :idx="idx" :page="imagePage"></image-text>
              </div>
              <div class="detail-footer">
                <div class="footer-block">
                  <p v-if="item.points.length>0">知识点：</p>
                  <div class="footer-point" v-if="item.points.length>0">
                    <span v-for="(pointer,poIdx) in item.points">{{pointer.name}}<span
                      v-if="poIdx!=(item.points.length-1)">、</span></span>
                  </div>
                </div>
                <div class="footer-option">
                  <div class="see-detail" @click="seeDetail(item,idx)">
                    <i class="iconfont icon-chakan"></i>查看详情
                  </div>
                  <div class="see-detail" @click="editImageText(item)">
                    <i class="iconfont icon-bianji"></i>编辑图文
                  </div>
                  <!--<div class="see-detail" @click="delQuestion(item)">-->
                    <!--<i class="iconfont icon-shanchu"></i>从题库删除-->
                  <!--</div>-->
                </div>
              </div>
            </div>
            <div class="block" v-if="imageTotal!=0">
              <el-pagination
                @current-change="imageTextCurrentChange"
                :current-page.sync="imagePage"
                :page-size="rows"
                layout="prev, pager, next"
                :total="imageTotal">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="question-content" v-if="activeName=='QUESTION'">
          <div class="filter-content">
            <div class="filter-item">
              题型：
              <span v-for="item in questionData" :class="item.value==questionType?'active':''"
                    @click="selectQuestionType(item)">{{item.name}}</span>
            </div>
            <div class="filter-item">
              难度：
              <span v-for="item in qudifficultLevelData" :class="item.value==questionDifficultLevel?'active':''"
                    @click="selectQuestionDifficult(item)">{{item.name}}</span>
            </div>
            <div class="filter-item">
              年级：
              <span v-for="item in questionGradeList" :class="item.value==questionGradeValue?'active':''"
                    @click="selectQuestionGrade(item)">{{item.name}}</span>
            </div>
            <div class="filter-item-point">
              知识点：
              <el-cascader
                ref="cascaderPoint"
                expand-trigger="click"
                :options="pointList"
                v-model="questionPointIds"
                class="casader-point"
              >
              </el-cascader>
            </div>
          </div>
          <div class="question-list">
            <div class="add-question" @click="jumpAddQuestion">
              <i class="iconfont icon-jiahao"></i>录入题目
            </div>
            <div class="image-text-item detail-list" v-for="(item,idx) in homeworkData" v-if="homeworkData.length>0">
              <div class="detail-item">
                <choice :questionData="item.questionDataObject" :idx="idx" :page="questionPage"
                        v-if="(item.type=='CHOICE'||item.type=='MULTIPLE_CHOICE')&&item.questionDataObject.optionMap"></choice>
                <connection :questionData="item.questionDataObject" :idx="idx" :page="questionPage"
                            v-if="item.type=='CONNECTION_PROBLEM'&&item.questionDataObject.leftDataList"></connection>
                <fill-blank :questionData="item.questionDataObject" :idx="idx" :page="questionPage"
                            v-if="item.type=='FILL_THE_BLANKS'&&item.questionDataObject.answerList"></fill-blank>
                <subjective :questionData="item.questionDataObject" :idx="idx" :page="questionPage"
                            v-if="item.type=='SUBJECTIVE' && item.questionDataObject.answerWay"></subjective>
              </div>
              <div class="detail-footer">
                <div class="footer-block">
                  <p v-if="item.points.length>0">知识点：</p>
                  <div class="footer-point" v-if="item.points.length>0">
                    <span v-for="(pointer,poIdx) in item.points">{{pointer.name}}<span
                      v-if="poIdx!=(item.points.length-1)">、</span></span>
                  </div>
                </div>
                <div class="footer-option">
                  <div class="see-detail" @click="seeDetail(item,idx)">
                    <i class="iconfont icon-chakan"></i>查看详情
                  </div>
                  <div class="see-detail" @click="editQuestion(item)">
                    <i class="iconfont icon-bianji"></i>编辑题目
                  </div>
                  <!--<div class="see-detail" @click="delQuestion(item)">-->
                    <!--<i class="iconfont icon-shanchu"></i>从题库删除-->
                  <!--</div>-->
                </div>
              </div>
            </div>
            <div class="block" v-if="questionTotal!=0">
              <el-pagination
                @current-change="questionCurrentChange"
                :current-page.sync="questionPage"
                :page-size="rows"
                layout="prev, pager, next"
                :total="questionTotal">
              </el-pagination>
            </div>
          </div>
        </div>

      </el-container>
      <el-dialog
        title="题目详情"
        :visible.sync="detailConentFlag"
        width="648px"
        append-to-body
        class="dialog-block"
      >
        <div class="dialog-content">
          <div class="update-user">最后编辑人：{{detailData.updateUserName}}</div>
          <div class="grade-block">
            <p><span>年级：</span>{{detailData.gradeValue}}</p>
            <p><span>难度：</span>
              <el-rate
                v-model="detailData.difficultLevel"
                disabled
                :colors="['#F08D00', '#F08D00', '#F08D00']">
              </el-rate>
            </p>
          </div>
          <div class="point-block">
            <p>知识点：</p>
            <div class="point-item">
              <span v-for="item in detailData.points">{{item.name}}</span>
            </div>
          </div>
          <div class="detail-dialog-item">
            <image-text-detail :detailQustionData="detailData.questionDataObject" :idx="detailIdx"
                               v-if="detailData.type=='IMAGE_TEXT'"></image-text-detail>
            <choice-detail :detailQustionData="detailData.questionDataObject" :idx="detailIdx"
                           v-if="detailData.type=='CHOICE'||detailData.type=='MULTIPLE_CHOICE'"></choice-detail>
            <connection-detail :detailQustionData="detailData.questionDataObject" :idx="detailIdx"
                               v-if="detailData.type=='CONNECTION_PROBLEM'"></connection-detail>
            <fill-blank-detail :detailQustionData="detailData.questionDataObject" :idx="detailIdx"
                               v-if="detailData.type=='FILL_THE_BLANKS'"></fill-blank-detail>
            <subjective-detail :detailQustionData="detailData.questionDataObject" :idx="detailIdx"
                               v-if="detailData.type=='SUBJECTIVE'"></subjective-detail>
          </div>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  import Choice from "./questionComponent/Choice"
  import Connection from "./questionComponent/Connection"
  import FillBlank from "./questionComponent/FillBlank"
  import Subjective from "./questionComponent/Subjective"
  import ImageText from "./questionComponent/ImageText"

  import ImageTextDetail from "./questionComponent/ImageTextDetail"
  import ChoiceDetail from "../library/maskDetailComponent/Choice"
  import ConnectionDetail from "../library/maskDetailComponent/Connection"
  import FillBlankDetail from "../library/maskDetailComponent/FillBlank"
  import SubjectiveDetail from "../library/maskDetailComponent/Subjective"

  export default {
    name: "Index",
    props: {
      userPermission: {
        type: Object,
        required: true
      }
    },
    components: {
      ImageText,
      Choice,
      Connection,
      FillBlank,
      Subjective,
      ImageTextDetail,
      ChoiceDetail,
      ConnectionDetail,
      FillBlankDetail,
      SubjectiveDetail
    },
    data() {
      return {
        detailConentFlag: false,//弹窗
        activeName: 'IMAGE_TEXT', //IMAGE_TEXT图文  QUESTION题目
        imagePage: 1,//图文page
        questionPage: 1,//题目page
        rows: 10, //一页多少条数据
        imageTotal: 1,//图文总数
        questionTotal: 1,//题目总数
        imageData: [],//图文数据
        homeworkData: [],//题目数据
        lessonModule: "",//什么类型  是课前预习、课后总结还是课后拓展
        imageDifficultLevel: "",//图文难度
        questionDifficultLevel: "",//题目难度
        questionType: "",//题目类型
        lessonModuleData: [{
          "name": "全部",
          "value": "",
          "active": true
        }, {
          "name": "课前预习",
          "value": "PREVIEW",
          "active": false
        }, {
          "name": "课后总结",
          "value": "SUMMARY",
          "active": false
        }, {
          "name": "课后拓展",
          "value": "EXPAND",
          "active": false
        }],//类型
        difficultLevelData: [{
          "name": "全部",
          "value": "",
          "active": true
        }, {
          "name": "一星",
          "value": "1",
          "active": false
        },
          {
            "name": "二星",
            "value": "2",
            "active": false
          },
          {
            "name": "三星",
            "value": "3",
            "active": false
          },
          {
            "name": "四星",
            "value": "4",
            "active": false
          },
          {
            "name": "五星",
            "value": "5",
            "active": false
          }],//难度
        qudifficultLevelData: [{
          "name": "全部",
          "value": "",
          "active": true
        }, {
          "name": "一星",
          "value": "1",
          "active": false
        },
          {
            "name": "二星",
            "value": "2",
            "active": false
          },
          {
            "name": "三星",
            "value": "3",
            "active": false
          },
          {
            "name": "四星",
            "value": "4",
            "active": false
          },
          {
            "name": "五星",
            "value": "5",
            "active": false
          }],//难度
        gradeList: [],//年级
        questionGradeList:[],//年级
        imageGradeValue: "",//图文筛选年级
        questionGradeValue: "",//题目筛选年级
        pointList: [],//知识点
        imagePointIds: [],//知识点id
        questionPointIds: [],//知识点id  作业题目
        detailData: {},//当前查看详情的题
        detailIdx: '',//当前题的题号
        questionData: [{
          "name": "全部",
          "value": "",
          "active": true
        }, {
          "name": "单选",
          "value": "CHOICE",
          "active": false
        }, {
          "name": "多选",
          "value": "MULTIPLE_CHOICE",
          "active": false
        }, {
          "name": "填空",
          "value": "FILL_THE_BLANKS",
          "active": false
        }, {
          "name": "连线",
          "value": "CONNECTION_PROBLEM",
          "active": false
        }, {
          "name": "简答",
          "value": "SUBJECTIVE",
          "active": false
        }],//题型
      }
    },
    mounted() {
      var warehouseData = localStorage.getItem("warehouse");
      if(warehouseData){
        warehouseData= JSON.parse(warehouseData);
      }else{
        warehouseData = {}
      }
      console.log(warehouseData,"warehouseData");
      if(warehouseData.activeName) {
        console.log(this.activeName);
        this.activeName = warehouseData.activeName;
      }
      if(warehouseData.imageText){
        this.lessonModule = warehouseData.imageText.lessonModule;
        this.imageDifficultLevel = warehouseData.imageText.imageDifficultLevel;
        this.imageGradeValue = warehouseData.imageText.imageGradeValue;
        this.imagePointIds = warehouseData.imageText.imagePointIds;
      }
      if(warehouseData.question){
        this.questionType = warehouseData.question.questionType;
        this.questionGradeValue = warehouseData.question.questionGradeValue;
        this.questionDifficultLevel = warehouseData.question.questionDifficultLevel;
        this.questionPointIds = warehouseData.question.questionPointIds;
      }
      this.getGradeList();//获取年级列表
      this.getPointList();//获取知识点列表
      this.getQuestion();//获取题目
    },
    watch: {
      activeName(val) {
        this.getQuestion();
        this.setCache();
      },
      imagePointIds(val) {
        this.getQuestion();
        this.setCache();
      },
      questionPointIds(val){
        this.getQuestion();
        this.setCache();
      }
    },
    methods: {
      //获取年级列表
      getGradeList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/course/get_grade.do',
          param: {},
          success: function (result) {
            if (result.code == 200 && result.result) {
              _this.gradeList = JSON.parse(JSON.stringify(result.result));
              _this.questionGradeList = JSON.parse(JSON.stringify(result.result));
              console.log(_this.questionGradeList,"questionGradeList");
              _this.gradeList.unshift({
                "name": "全部",
                "value": "",
                "active": true
              })
              _this.questionGradeList.unshift({
                "name": "全部",
                "value": "",
                "active": true
              })
            } else {
              _this.$message.error('获取年级列表失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取知识点列表
      getPointList() {
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
      // 获取题目
      getQuestion() {
        var _this = this;
        var data = {};//要发送的数据
        if (_this.activeName == 'IMAGE_TEXT') {
          data = {
            'type': 'IMAGE_TEXT',//类型
            'grade': _this.imageGradeValue,
            'lessonModule': _this.lessonModule,
            'difficultLevel': _this.imageDifficultLevel,
            'pointId': _this.imagePointIds[_this.imagePointIds.length - 1],
            'page': _this.imagePage,
            'rows': _this.rows,
          }
        } else {
          data = {
            'type': _this.questionType,//类型
            'grade': _this.questionGradeValue,
            'lessonModule': 'HOMEWORK',
            'difficultLevel': _this.questionDifficultLevel,
            'pointId': _this.questionPointIds[_this.questionPointIds.length - 1],
            'page': _this.questionPage,
            'rows': _this.rows,
          }
        }
        _this.request({
          method: 'post',
          url: '/question/get_question.do',
          param: data,
          success: function (result) {
            if (result.code == 200 && result.result) {
              console.log(result.result);
              var data = result.result;
              if (_this.activeName == 'IMAGE_TEXT') {
                _this.imageData = data.data;
                _this.imageTotal = data.total;
                console.log(_this.imageTotal);
              } else {
                _this.homeworkData = data.data;
                _this.questionTotal = data.total;
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取题库失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //本地存储
      setCache(){
        var data = {
          'imageText':{
            'lessonModule':this.lessonModule,//类型
            'imageDifficultLevel':this.imageDifficultLevel,//难度
            'imageGradeValue':this.imageGradeValue,//年级
            'imagePointIds':this.imagePointIds//知识点
          },
          'activeName':this.activeName,
          'question':{
            'questionType': this.questionType,//类型
            'questionGradeValue': this.questionGradeValue,
            'questionDifficultLevel': this.questionDifficultLevel,
            'questionPointIds': this.questionPointIds,
          }
        };
        localStorage.setItem("warehouse",JSON.stringify(data));
      },
      jumpAddText(){
        this.$router.push('/inputImageText/PREVIEW/null/null/GRADE_THREE/warehouse/null');
      },
      jumpAddQuestion(){
        this.$router.push('/inputHomework/null/null/GRADE_THREE/warehouse/null');
      },
      //题目翻页
      questionCurrentChange(val) {
        this.questionPage = val;
        this.getQuestion();
      },
      // 图文翻页
      imageTextCurrentChange(val) {
        this.imagePage = val;
        this.getQuestion();
      },
      //图文 类型修改 筛选
      selectTextType(data) {
        this.lessonModule = data.value;
        this.getQuestion();
        this.setCache();
      },
      //图文 难度修改 筛选
      selectTextDifficult(data) {
        console.log(data);
        this.imageDifficultLevel = data.value;
        this.getQuestion();
        this.setCache();
      },
      //图文  年级修改 筛选
      selectTextGrade(data) {
        this.imageGradeValue = data.value;
        this.getQuestion();
        this.setCache();
      },
      //题目 题型修改 筛选
      selectQuestionType(data) {
        this.questionType = data.value;
        this.getQuestion();
        this.setCache();
      },
      //题目 难度修改 筛选
      selectQuestionDifficult(data) {
        this.questionDifficultLevel = data.value;
        this.getQuestion();
        this.setCache();
      },
      //题目  年级修改 筛选
      selectQuestionGrade(data) {
        this.questionGradeValue = data.value;
        this.getQuestion();
        this.setCache();
      },
      //查看详情
      seeDetail(data, idx) {
        console.log(data);
        if (this.activeName == 'IMAGE_TEXT') {
          this.detailIdx = idx + 1 + ((this.imagePage - 1) * 10);
        } else {
          this.detailIdx = idx + 1 + ((this.questionPage - 1) * 10);
        }
        this.detailData = data;
        this.detailConentFlag = true;
      },
      // 编辑图文
      editImageText(data) {
        console.log(data);
        this.$router.push('/inputImageText/' + data.lessonModule + '/null/null/' + data.grade + '/warehouse/' + data.id)
      },
      // 编辑题目
      editQuestion(data) {
        console.log(data);
        this.$router.push('/inputHomework/null/null/' + data.grade + '/warehouse/' + data.id);
      },
      //删除题目
      delQuestion(data) {
        console.log(data, "班级数据");
        var _this = this;
        var content = "个课程正在使用这份图文，删除后将无法使用！";
        var title = "你确定要删除这份图文嘛？";
        if (_this.activeName == 'QUESTION') {
          content = "个课程正在使用这份题目，删除后将无法使用！";
          title = "你确定要删除这份题目嘛？";
        }
        const h = this.$createElement;
        this.$msgbox({
          title: title,
          message: h('p', null, [
            h('span', null, '当前有 '),
            h('span', {style: 'color: orange'}, data.questionLessonModule.length),
            h('span', null, content),
          ]),
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonClass: 'btn-red',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              //点击确定
              //  删除调接口
              _this.request({
                method: 'post',
                url: '/question/delete_question.do',
                param: {
                  id: data.id
                },
                success: function (result) {
                  if (result.code == 200) {
                    if (result.result) {
                      _this.getQuestion();
                      done();
                    }
                  }
                },
                error: function (error) {
                  //服务器异常
                  _this.$message.error('添加员工错误,网络加载失败，去右上角菜单中刷新页面。')
                }
              })
            } else {
              done();
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .auth-header {
    height: auto !important;
    position: relative;
    padding: 16px 24px 0 24px;
    background: #fff;
  }

  .auth-title {
    font-size: 20px;
    padding-bottom: 10px;
    line-height: 1.4;
    color: #262626;
  }

  .warehouse-content {
    margin: 24px;
    display: block;
  }

  /*筛选条件*/
  .image-text-content, .question-content {
    .filter-content {
      padding: 0 24px;
      background: #fff;
      .filter-item {
        font-size: 14px;
        color: #606060;
        line-height: 22px;
        border-bottom: 1px dashed #E0E0E0;
        padding: 16px 0;
        span {
          margin-right: 16px;
          padding: 4px 8px;
          cursor: pointer;
        }
        .active {
          border-radius: 4px;
          border: 1px solid #F08D00;
          background: #FEF6EB;
          color: #F08D00;
        }
      }
      .filter-item-point {
        padding: 16px 0;
        font-size: 14px;
        color: #606060;
      }
    }
    .image-text-list, .question-list {
      padding: 24px;
      background: #ffffff;
      margin-top: 24px;
    }
    .detail-list {
      border: 1px solid #eeeeee;
      margin-top: 24px;
      .detail-item {
        padding: 24px;
      }
    }
  }

  /*有内容的*/
  .detail-footer {
    padding: 13px 24px;
    border-top: 1px solid #eeeeee;
    background: #FAFAFA;
    display: flex;
    align-items: center;
    .footer-block {
      display: flex;
      align-items: top;
      font-size: 14px;
      color: #606060;
      line-height: 22px;
      flex: 1;
      .footer-point {
        flex: 1;
      }
    }
    .footer-option {
      float: right;
      .see-detail {
        float: left;
        margin-left: 16px;
        font-size: 14px;
        color: #606060;
        cursor: pointer;
        i {
          margin-right: 12px;
          font-size: 24px;
          vertical-align: middle;
          color: #BDBDBD;
        }
      }
    }
  }

  .add-question {
    display: block;
    border: 1px dashed #E0E0E0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
    color: #606060;
    cursor: pointer;
    i {
      font-size: 14px;
      margin-right: 8px;
    }
  }

  .casader-point {
    width: 360px;
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }

  /*弹框*/
  .dialog-content {
    height: 560px;
    overflow-y: auto;
    padding: 24px;
    box-sizing: border-box;
    position:relative;
    .update-user{
      position:absolute;
      top:24px;
      right:24px;
      font-weight:400;
      color:#BDBDBD;
      font-size:12px;
    }
    /*年级*/
    .grade-block {
      p {
        font-size: 14px;
        color: #606060;
        line-height: 22px;
        float: left;
        margin-right: 64px;
        display: flex;
        span {
          margin-right: 16px;
          flex: 1;
        }
      }
    }
    .grade-block:after {
      clear: both;
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    /*知识点*/
    .point-block {
      display: flex;
      align-items: top;
      margin-top: 16px;
      font-size: 14px;
      color: #606060;
      p {
        line-height: 22px;
        margin-right: 8px;
        margin-top: 6px;
      }
      .point-item {
        line-height: 20px;
        flex: 1;
        span {
          padding: 6px 8px;
          background: #F5F5F5;
          border-radius: 4px;
          margin-right: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }
      }
    }
    .detail-dialog-item {
      margin-top: 24px;
    }
  }
</style>
<style>
  .tabs-header .el-tabs__header {
    margin-bottom: 0 !important;
  }

  .tabs-header .el-tabs__item, .tabs-header .el-tabs__active-bar {
    width: 80px !important;
    text-align: center;
    padding: 0 !important;
    margin-right: 24px;
  }

  .tabs-header .el-tabs__nav-wrap:after {
    background: none !important;
  }

  .dialog-block .el-dialog__header {
    border-bottom: 1px solid #E0E0E0;
  }

  .dialog-block .el-dialog__body {
    padding: 0;
  }

  .btn-red {
    background: #ff553e !important;
  }
</style>


