<template>
  <div>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/library' }" v-if="page=='libraryhw'">套题</router-link>
        <router-link :to="{ path: '/warehouse' }" v-if="page=='warehouse'">题库</router-link>
        <span>/</span>
        <template v-if="page=='libraryhw'">
          <a @click="goback" class="current-breadcrumb">{{typeValue}}</a>
          <span>/</span>
        </template>
        <a href="javascript:void(0)" class="current-breadcrumb">录入题目</a>
      </el-breadcrumb>
      <h4 class="common-title">录入题目</h4>
    </el-header>
    <div class="page-main">
      <div class="library-main">
        <h4 class="section-title">标签</h4>
        <div class="section-main">
          <div class="section-form">
            <div class="section-item" v-if="page=='warehouse'">
              <label class="item-title">类型：</label>
              <div class="item-cont">
                <el-select v-model="lessonModule" placeholder="请选择">
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
                    <div class="point-add-box" slot="reference"><i class="iconfont icon-jiahao"></i> 添加</div>
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
          <el-form ref="form" label-width="90px" class="library-form" onsubmit="return false;">
            <!--:model="form"-->
            <el-form-item label="标题：" :class="titleError?'is-error':''">
              <el-input placeholder="请输入" style="width:600px;" v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="内容：">
              <template v-for="(item,idx) in questionData">
                <div class="library-add-box" v-if="item.itemType=='TEXT'">
                  <el-input placeholder="请输入" style="width:600px;" v-model="item.itemValue" type="textarea"
                            :id="'box-'+idx"></el-input>
                  <div class="inline-block" @click="delFileFun(idx)">
                    <i class="iconfont icon-guanbi"></i>
                  </div>
                </div>
                <div class="library-add-box" v-if="item.itemType=='IMG'">
                  <div class="add-title-item inline-block add-title-item-border" :id="'box-'+idx">
                    <div class="option-img-box inline-block">
                      <img class="form-img" :src="item.itemValue">
                    </div>
                    <div class="inline-block text-right">
                      <input class="ipt-file" type="file" :id="'img-block-'+idx"
                             accept="image/*" @change="changeFileFunc('img',idx,('img-block-'+idx))">
                      <i class="iconfont icon-again"></i>
                    </div>
                  </div>
                  <div class="inline-block" @click="delFileFun(idx)">
                    <i class="iconfont icon-guanbi"></i>
                  </div>
                </div>
                <div class="library-add-box" v-if="item.itemType=='AUDIO'">
                  <div class="add-title-item inline-block add-title-item-border" :id="'box-'+idx">
                    <div class="option-img-box inline-block">
                      <div class="audio-item">
                        <xp-audio :audioSrc="item.itemValue"></xp-audio>
                      </div>
                    </div>
                    <div class="inline-block text-right">
                      <input class="ipt-file" type="file" :id="'audio-block-'+idx"
                             accept="audio/mpeg" @change="changeFileFunc('audio',idx,('audio-block-'+idx))">
                      <i class="iconfont icon-again"></i>
                    </div>
                  </div>
                  <div class="inline-block" @click="delFileFun(idx)">
                    <i class="iconfont icon-guanbi"></i>
                  </div>
                </div>
                <div class="library-add-box" v-if="item.itemType=='VIDEO'" :id="'video-box-'+idx">
                  <div class="add-title-item inline-block add-title-item-border">
                    <div class="option-img-box inline-block">
                      <video :src="item.itemValue" controls></video>
                    </div>
                    <div class="inline-block text-right">
                      <input class="ipt-file" type="file" :id="'video-block-'+idx"
                             accept="audio/mp4, video/mp4" @change="changeFileFunc('VIDEO',idx,('video-block-'+idx))">
                      <i class="iconfont icon-again"></i>
                    </div>
                  </div>
                  <div class="inline-block" @click="delFileFun(idx)">
                    <i class="iconfont icon-guanbi"></i>
                  </div>
                </div>
              </template>
              <div class="library-upload-list">
                <div class="add-block">
                  <div class="iconfont icon-jiahao"></div>
                </div>
                <div class="upload-block" @click="addQuestion">
                  <div class="iconfont icon-wenzi"></div>
                  <p>文字</p>
                </div>
                <div class="upload-block">
                  <div class="iconfont icon-tupian"></div>
                  <input class="ipt-file" type="file" id="imgId"
                         accept="image/*" @change="changeFileFunc('IMG',-1,'imgId')">
                  <p>图片</p>
                </div>
                <div class="upload-block">
                  <input class="ipt-file" type="file" id="audioId"
                         accept="audio/mpeg" @change="changeFileFunc('AUDIO',-1,'audioId')">
                  <div class="iconfont icon-luyin"></div>
                  <p>音频</p>
                </div>
                <div class="upload-block">
                  <input class="ipt-file" type="file" id="videoId"
                         accept="audio/mp4, video/mp4" @change="changeFileFunc('VIDEO',-1,'videoId')">
                  <div class="iconfont icon-shipin"></div>
                  <p>视频</p>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-footer class="library-footer">
      <el-button @click="goback">返回</el-button>
      <el-button type="primary" @click="saveFun">录入</el-button>
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
  import $ from 'jquery'
  import XpAudio from "@/components/AudioLibraryComponent"

  export default {
    name: '',
    props: [],
    components: {XpAudio},
    data() {
      return {
        grade: '',//年级
        gradeList: [],//年级列表
        difficultLevel: 1,//难度
        pointList: [],//知识点列表
        pointTextArr: [], //已选择的知识点 文字 集合 --用于展示
        pointCascader: [],//当前知识点el-cascader选择的value集合(value与id必须一致,集合格式是【父id,子id,孙id,....】)
        pointIdArr: [],//已选择的知识点 id 集合 ---- 格式[[fu,zi,sun...],[fu,zi,sun...],...] --估计之后就用不到了
        pointLastIdArr: [],//已选择的知识点 最后一个id 集合,格式【id,id,id...】,length==pointIdArr.length
        pointVisible: false,//知识点popover
        questionData: [],//题目数据
        lessonModule: 'PREVIEW',
        page: '',//判断是套题跳转过来的还是题库
        typeValue: '课前预习',
        typeList: [{
          label: "课前预习",
          value: "PREVIEW"
        }, {
          label: "课后总结",
          value: "SUMMARY"
        }, {
          label: "课前拓展",
          value: "EXPAND"
        }],
        title: '',//题干列表,文案、图片、音频
        courseId: '',//课程id
        lessonIndex: '',//课节
        editId: '',//图文id 编辑的时候使用
        titleError: false,//判断题干是否已填
        ifShowUploading: false, //上传中 loading 是否显示
      }
    },
    mounted() {
      let that = this;
      let params = that.$route.params;
      this.lessonModule = params.type;
      this.grade = params.grade;
      this.page = params.page;
      this.courseId = params.courseId;
      this.lessonIndex = params.idx;
      this.editId = params.editId;
      that.getPointList(); //获取知识点
      that.getGradeList(); //获取班级列表
      console.log(params.type, "type");
      if (params.type == 'PREVIEW') {
        this.typeValue = '课前预习'
      } else if (params.type == 'SUMMARY') {
        this.typeValue = '课后总结'
      } else if (params.type == 'EXPAND') {
        this.typeValue = '课后拓展'
      }
      if (this.editId != "null") {
        this.getQuestion();
      }
    },
    watch: {},
    methods: {
      goback() {
        //  返回
        this.$router.go(-1);
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

      //获取年级列表
      getGradeList() {
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
      getQuestion() {
        let that = this;
        that.request({
          method: 'post',
          url: '/question/get_question_by_id.do',
          param: {id: that.editId},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              var data = result.result;
              that.title = data.title.replace(/<br>/g, '\n');
              that.questionData = data.questionDataObject.info;
              that.difficultLevel = data.difficultLevel;
              that.pointTextArr = data.points.map(item => {
                return item.name;
              })
              that.pointLastIdArr = data.points.map(item => {
                return item.id;
              })
              that.questionData.map(item => {
                if (item.itemType == 'TEXT') {
                  item.itemValue = item.itemValue.replace(/<br>/g, '\n');
                }
              })
            } else {
              that.$message.error('获取数据失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('服务器异常,刷新重试。')
          }
        });
      },
      //添加文本
      addQuestion() {
        this.questionData.push({
          "itemType": "TEXT",
          "itemValue": ""
        })
        this.questionData = JSON.parse(JSON.stringify(this.questionData));
        console.log(this.questionData, "fdfsd");
      },
      //知识点--确认添加
      pointAdd() {
        let that = this;
        let tmpIds = that.pointCascader; //['1','3','4']
        let tmpLabels = that.$refs['cascaderPoint'].currentLabels; //["基础", "填空", "语法"]
        console.log(tmpLabels, ' labels');
        if (tmpIds.length > 0 && tmpLabels.length > 0) {
          let pointTempId = tmpIds[tmpIds.length - 1];
          let pointTempText = tmpLabels[tmpLabels.length - 1];
          if (that.pointLastIdArr.length < 1 || that.pointLastIdArr.indexOf(pointTempId) == -1) {
            that.pointLastIdArr.push(pointTempId);
            that.pointTextArr.push(pointTempText);
            that.pointIdArr.push(tmpIds);
            console.log('add 知识点。。。。。')
            console.log(that.pointIdArr, '    pointIdArr')
            console.log(that.pointTextArr)
            console.log(that.pointLastIdArr, '   pointLastIdArr')
          }
        }
        that.pointClear();
      },

      //知识点--取消添加
      pointCancel() {
        this.pointClear();
      },

      //知识点相关数据恢复为默认
      pointClear() {
        this.pointVisible = false; //知识点popover不显示
        this.pointCascader = []; //当前知识点cascader选择的value(与id必须一致)
      },

      //知识点--删除操作
      delPointFun(idx) {
        let that = this;
        that.pointTextArr.splice(idx, 1);
        that.pointIdArr.splice(idx, 1);
        that.pointLastIdArr.splice(idx, 1);
        console.log('delete 知识点。。。。。delete之后')
        console.log(that.pointIdArr, '   pointIdArr delete')
        console.log(that.pointTextArr)
        console.log(that.pointLastIdArr, '   pointLastIdArr')
      },
      /* 题干、解析--上传图片或音频
        type:img/audio   上传的是图片还是音频
        label:title/explain  题干/解析中的上传
        ele:upload控件的id
      */
      changeFileFunc(type, idx, ele) {
        let that = this;
        that.ifShowUploading = true; //上传中loading是否显示
        let fd = new FormData();
        console.log(ele, "ele");
        fd.append("file", document.getElementById(ele).files[0]);
        fd.append("fileType", "HOMEWORK_QUESTION");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/file/upload_file.do');
        xhr.onload = function () {
          console.log(xhr.responseText, "返回   ");
          let backResponse = JSON.parse(xhr.responseText);
          if (backResponse.code == 200 && backResponse.result) {
            if (idx < 0) {
              that.questionData.push({
                "itemType": type,
                "itemValue": backResponse.result
              })
            } else {
              that.questionData[idx].itemValue = backResponse.result;
            }
            document.getElementById(ele).value = '';
            that.questionData = JSON.parse(JSON.stringify(that.questionData));
            console.log(that.questionData, "question");
          } else {
            console.log('上传失败 changeFileFunc')
          }
          that.ifShowUploading = false; //上传中loading是否显示
        };
        xhr.send(fd);
      },

      //删除题干、解析中已上传的图片或音频
      delFileFun(idx) {
        console.log("dddd");
        let that = this;
        that.questionData.splice(idx, 1);
        console.log(that.questionData, "d");
        that.questionData = JSON.parse(JSON.stringify(that.questionData));
      },
      //保存按钮
      saveFun() {
        var _this = this;
        console.log('保存题目', _this.questionData);
        if (_this.title == '') {
          _this.titleError = true;
          return false;
        } else {
          _this.titleError = false;
        }
        if (_this.questionData.length < 1) {
          _this.$message.error('请添加图文内容');
          return false;
        }
        var questionData = JSON.parse(JSON.stringify(_this.questionData));
        for (var i = 0; i < questionData.length; i++) {
          if (questionData[i].itemValue == '') {
            $("#box-" + i).addClass("is-error");
            _this.$message.error('请填写图文内容');
            return false;
          } else {
            $("#box-" + i).removeClass("is-error");
          }
          if (questionData[i].itemType == 'TEXT') {
            questionData[i].itemValue = questionData[i].itemValue.replace(/\n/g, '<br>');
          }
        }
        var url = '/question/save_question.do';
        var data = {
          'type': 'IMAGE_TEXT',
          'grade': _this.grade,
          'difficultLevel': _this.difficultLevel,
          'lessonModule': _this.lessonModule,
          'points': _this.pointLastIdArr.join(","),
          'questionData': JSON.stringify({"info": questionData}),
          'title': _this.title.replace(/\n/g, '<br>')
        }
        if (_this.page == 'libraryhw') {
          data.courseId = _this.courseId;
          data.lessonIndex = _this.lessonIndex;
        }
        if (_this.editId != 'null') {
          url = '/question/update_question.do';
          data.id = _this.editId;
        }
        console.log(data, "发送的数据");
        _this.request({
          method: 'post',
          url: url,
          param: data,
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              _this.$router.go(-1);
            } else {
              _this.$message.error('保存图文失败，请重试。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('服务器异常,刷新重试。')

          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  /*上传gif*/
  .uploading-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1002;

    .uploading-bg {
      background: rgba(0, 0, 0, 0.32);
      width: 100%;
      height: 100%;
    }
    .uploading-main {
      position: absolute;
      top: 40%;
      left: 50%;
      text-align: center;
      img {
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
      }
    }

  }

  .page-main {
    padding-bottom: 60px;
  }

  .library-main {
    margin: 24px;
    background: #fff;
    .section-title {
      border-bottom: 1px solid #E0E0E0;
      padding: 12px 24px;
      font-size: 16px;
      color: #222;
      font-weight: 500;
      line-height: 24px;
    }
    .section-main {
      padding: 24px;
      font-size: 16px;
      font-weight: 400;
      color: #606060;
      line-height: 22px;
      .section-form {
        padding-bottom: 24px;
        .section-item {
          display: inline-block;
          margin-right: 20px;

          .item-title {
            width: 64px;
            display: inline-block;
            text-align: right;
          }
          .item-cont {
            display: inline-block;
          }
          .point-item {
            display: inline-block;
            background: #f5f5f5;
            border-radius: 4px;
            padding: 8px;
            font-size: 16px;
            color: #606060;
            line-height: 22px;
            font-weight: normal;
            margin-right: 8px;
            margin-bottom:8px;
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
          .point-add-box {
            display: inline-block;
            border-radius: 4px;
            padding: 8px;
            font-size: 16px;
            color: #bdbdbd;
            background: #fff;
            border: 1px dashed #e0e0e0;
            cursor: pointer;
            .iconfont {
              font-size: 16px;
            }
          }
          .point-add-box-disabled {
            background: #f5f5f5;
            cursor: not-allowed;
          }
        }
      }
      .section-form:last-child {
        padding-bottom: 0;
      }
    }
    /*library-main end*/
  }

  .library-form {
    .library-upload-list {
      width: 330px;
      height: 64px;
      border-radius: 4px;
      border: 1px solid #E0E0E0;
      margin-bottom: 22px;
      display: flex;
      .upload-block {
        line-height: initial;
        width: 56px;
        height: 56px;
        text-align: center;
        margin: 4px;
        position: relative;
        cursor: pointer;
        border-radius: 4px;
        .iconfont {
          font-size: 30px;
          color: #BDBDBD;
        }
        p {
          font-size: 12px;
          color: #909090;
          line-height: 22px;
        }
      }
      .upload-block:hover {
        background: #FCE8CC;
        p {
          color: #F08D00;
        }
        .iconfont {
          color: #F08D00;
        }
      }
      .add-block {
        margin: 6px;
        margin-left: 0;
        padding: 4px;
        border-right: 1px solid #E0E0E0;
        line-height: 44px;
        width: 56px;
        text-align: center;
        .iconfont {
          font-size: 32px;
          color: #606060;
        }
      }
    }
    .library-add-box {
      margin-bottom: 22px;
      .add-title-item {
        font-size: 16px;
        color: #606060;
        width: 582px;
        padding: 8px;
        line-height: 24px;
        border-radius: 4px;
        border: 1px dashed #E0E0E0;
        cursor: pointer;
        position: relative;
        .iconfont {
          font-size: 20px;
          color: #bdbdbd;
          padding-right: 8px;
          display: inline-block;
          vertical-align: middle;
        }

        .option-img-box {
          width: 90%;
          video {
            width: 372px;
          }
        }
      }

      .add-title-item:hover {
        color: #F08D00;
        border: 1px dashed #F08D00;
        .iconfont {
          color: #F08D00;
        }
      }

      .add-title-item-border {
        border: 1px solid #E0E0E0;
      }
      .add-title-item-border:hover {
        border: 1px solid #F08D00;
      }
    }

  }

  .ipt-file {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
  }

  /*library-form*/

  /*footer*/
  .library-footer {
    position: fixed;
    bottom: 0;
    left: 240px;
    right: 0;
    background: #fff;
    text-align: right;
    padding: 12px 24px 12px 0;
  }

  /*common*/
  i {
    font-size: 20px;
    color: #bdbdbd;
    margin-left: 8px;
    cursor: pointer;
  }
  .form-img {
    height: 104px;
    display: block;
  }

  .inline-block {
    display: inline-block;
    vertical-align: middle;
    position:relative;
  }

</style>
<style lang="scss">
  @import "../../style/librarycomponent.scss";

  .ul-library .el-input__inner {
    max-width: 600px !important;
    display: inline-block;
  }

  .ul-library .el-input-number {
    display: inline-block;
  }

  .is-error {
    border-color: #f5222d !important;
  }
</style>
