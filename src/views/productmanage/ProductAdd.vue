<template>
    <!--<div>商品管理:  添加、编辑、复制商品</div>-->
  <el-container class="manage-product-ziyue">
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <router-link :to="{ path: '/productManage' }">商品管理</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">{{productId>0?(editType=='copy'?'复制':'编辑'):'添加'}}商品</a>
      </el-breadcrumb>
      <h4 class="common-title">{{productId>0?(editType=='copy'?'复制':'编辑'):'添加'}}商品</h4>
    </el-header>
    <el-container class="common-content product-box">
      <el-main>
        <el-form ref="refFrom" :rules="productRule" :model="refFrom" label-width="100px">
          <el-form-item label="商品名称：" prop="productName">
            <el-col style="width:390px;">
              <el-input v-model="refFrom.productName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="对应班级：" prop="classId">
              <el-select v-model="refFrom.courseId" filterable placeholder="请选择课程">
                <el-option v-for="(item,idx) in courseList" :key="'course'+idx"
                           :label="item.courseName" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="refFrom.classId" filterable placeholder="请选择班级">
                <el-option v-for="(item,idx) in classList" :key="'class'+idx"
                           :label="item.label" :value="item.value" :disabled="item.ifReadOnly">
                  <div class="slt-class">
                    <span style="float: left;">{{item.label}}</span>
                    <span style="float: right;padding-left:30px;" v-if="item.ifReadOnly">已关联了一个商品</span>
                  </div>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="价格：" prop="price">
            <el-col style="width:203px;padding-right:10px;">
              <el-input v-model.number="refFrom.price" type="number" class="ziyue-ipt-price"></el-input>
            </el-col>元
          </el-form-item>
          <el-form-item label="课程类型：" prop="courseType">
            <el-radio-group v-model="refFrom.courseType" >
              <el-radio v-for="(item,idx) in courseTypeList" :key="'ct'+idx" :label="item.value">{{item.name}}</el-radio>

              <!--<el-radio label="COURSE_SPRING">春季班</el-radio>-->
              <!--<el-radio label="COURSE_SUMMER">暑假班</el-radio>-->
              <!--<el-radio label="COURSE_AUTUMN">秋季班</el-radio>-->
              <!--<el-radio label="COURSE_WINTER">寒假班</el-radio>-->
            </el-radio-group>

          </el-form-item>
          <!--春秋:每周 x 上课  ↓ -->
          <template v-if="refFrom.courseType=='COURSE_SPRING' || refFrom.courseType=='COURSE_AUTUMN'">
            <el-form-item label="规则：" prop="week">
              <el-select v-model="refFrom.week">
                <el-option v-for="(item,idx) in weekSpringAutumn" :key="'week'+idx" :label="'每'+item.name" :value="item.value"></el-option>
              </el-select>&nbsp;&nbsp;上课
            </el-form-item>
            <el-form-item label="上课日期：" prop="monthDay">
              <el-date-picker
                v-model="refFrom.monthDay"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </template>

          <!--暑寒:每天上课,有期次列表 ↓ -->
          <template v-if="refFrom.courseType=='COURSE_SUMMER' || refFrom.courseType=='COURSE_WINTER'">
            <el-form-item label="规则：" prop="week">
              <el-select v-model="refFrom.week">
                <el-option v-for="(item,idx) in weekSummerWinter" :key="'day'+idx" :label="item.name" :value="item.value"></el-option>
              </el-select>&nbsp;&nbsp;上课
            </el-form-item>
            <el-form-item label="上课日期：" prop="monthDay">
              <el-select v-model="refFrom.stageId" placeholder="请选择期次">
                <el-option v-for="(item,idx) in stageList" :key="'stage'+idx"
                           :label="item.stageName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </template>


          <el-form-item label="上课时间：" prop="timeRange">
            <el-time-picker
              is-range
              v-model="refFrom.timeRange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="商品图：" prop="img">
            <div class="product-img-block">
              <div class="course-img" v-if="refFrom.img==''">
                <input v-if="refFrom.img==''" class="ipt-file" id="header-img-file" type="file"   accept="image/*" @change="changeUpload('header-img-file','header')">
                <img :src="refFrom.img" alt="" v-if="refFrom.img!=''" >
                <template v-if="refFrom.img==''">
                  <div class="iconfont icon-jiahao"></div>
                  <p>上传图片</p>
                </template>
              </div>
              <div class="course-img" style="border:0;" v-if="refFrom.img !=''">
                <img :src="refFrom.img" alt="" v-if="refFrom.img!=''" @click="previewImg(refFrom.img)">
              </div>
              <div class="course-item">
                <span class="refresh-file-box">
                  <template v-if="refFrom.img !=''">
                    <input  class="ipt-file" id="header-img-file-refresh" type="file"   accept="image/*" @change="changeUpload('header-img-file-refresh','header')">
                    <i class="iconfont icon-again refresh-icon"></i>
                  </template>
                </span>

                1.商品图片尺寸为1125x576 <br>2.封面图片大小不超过1MB <br>3.封面图片格式支持JPG,PNG
              </div>
            </div>
          </el-form-item>
          <el-form-item label="商品描述：" prop="descImg">
            <div class="product-img-block">
              <div class="course-img" v-if="refFrom.descImg==''">
                <input v-if="refFrom.descImg==''" class="ipt-file" id="desc-img-file" type="file"   accept="image/*" @change="changeUpload('desc-img-file','desc')">
                <img :src="refFrom.descImg" alt="" v-if="refFrom.descImg!=''" >
                <template v-if="refFrom.descImg==''">
                  <div class="iconfont icon-jiahao"></div>
                  <p>上传图片</p>
                </template>
              </div>
              <div class="course-img" style="border:0;" v-if="refFrom.descImg !=''">
                <img :src="refFrom.descImg" alt="" v-if="refFrom.descImg!=''" @click="previewImg(refFrom.descImg)">
              </div>
              <div class="course-item">
                <span class="refresh-file-box">
                  <template v-if="refFrom.descImg !=''">
                    <input  class="ipt-file" id="desc-img-file-refresh" type="file"   accept="image/*" @change="changeUpload('desc-img-file-refresh','desc')">
                    <i class="iconfont icon-again refresh-icon"></i>
                  </template>
                </span>
                1.商品图片尺寸为 1125 x n px <br>2.商品图片大小不超过10MB <br>3.封面图片格式支持JPG,PNG
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSubmit('refFrom')">保 存</el-button>
            <el-button @click="saveCancel('refFrom')">取 消</el-button>
          </el-form-item>
        </el-form>

      </el-main>

      <!--预览图片-->
      <el-dialog
        title=""
        :modal-append-to-body='false'
        :visible.sync="imgPreviewFlag"
        width="40%">
        <div class="dialog-img">
          <img :src="imgPreviewUrl" alt="">
        </div>
      </el-dialog>

      <!--上传中-->
      <div class="uploading-box" v-show="ifShowUploading">
        <div class="uploading-bg"></div>
        <div class="uploading-main">
          <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/uploading.gif" alt="">
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
  /*
  * 添加商品:  /productAdd/-1/add
  * 编辑商品:  /productAdd/id/edit
  * 复制商品:  /productAdd/id/copy
  * 注意:商品价格存储时,单位为分。分之后的厘去掉
  *
  *
  * 春秋,每周x上课,没有期次,不传参数 stageId
  * 暑寒,每天上课,有期次,   不传参数 beginDay endDay
  * */
    import moment from 'moment';
    var nextMonthToday = moment().add(1,'M');
    var nextTwoMonthToday = moment().add(2,'M');
    export default{
        name: 'ProduceAddEditCopy',
        props: [],
        components: {},
        data(){
          var checkProductName = (rule,val,callback) => {
            console.log('check nname ',val)
            if(!val){
              return callback(new Error('商品要有一个名字哦！'));
            }else{
              callback();
            }
          };
          var checkClassId = (rule,val,callback) =>{
            if(val=== ''){
              return callback(new Error('商品要有一个对应的班级哦！'));
            }else{
              callback();
            }
          };
          var checkPrice = (rule,val,callback) =>{
            if(val === '' || Number(val)<=0){
              return callback(new Error('商品不要钱怎么行！'));
            }else{
              callback();
            }
          };
            return {
              productId:-1, //商品id  -1表示添加商品;
              editType:'', //编辑的类型  copy--复制;edit--编辑;add--添加

              courseList:[], //课程列表
              classList:[
//                {
//                  "ifReadOnly": true,//标识已经被商品关联过
//                  "label": "（2.11-2.17日10:00）阅读写作培优寒假班（45年级）",
//                  "value": 791
//                },
//                {
//                  "ifReadOnly": false,
//                  "label": "（1.19-1.25日10:00）阅读写作培优寒假班（45年级）",
//                  "value": 6
//                }
              ], //某个课程下的所有班级
              stageList:[], //暑寒班下 可以选择的期次列表
              courseTypeList:[
                {
                  value:'COURSE_SPRING',
                  name:'春季班'
                },
                {
                  value:'COURSE_SUMMER',
                  name:'暑假班'
                },
                {
                  value:'COURSE_AUTUMN',
                  name:'秋季班'
                },
                {
                  value:'COURSE_WINTER',
                  name:'寒假班'
                },
              ],
              weekSpringAutumn:[
                {
                  value:'MONDAY',
                  name:'周一'
                },
                {
                  value:'TUESDAY',
                  name:'周二'
                },
                {
                  value:'WEDNESDAY',
                  name:'周三'
                }, {
                  value:'THURSDAY',
                  name:'周四'
                },
                {
                  value:'FRIDAY',
                  name:'周五'
                },
                {
                  value:'SATURDAY',
                  name:'周六'
                },
                {
                  value:'SUNDAY',
                  name:'周日'
                }
              ],
              weekSummerWinter:[
                {
                  value:'EVERYDAY',
                  name:'每天'
                }
              ],
              refFrom: {
                productName: '', //商品名称
                courseId:'',//课程名
                classId:'', //班级
                price:'', //价格
                courseType:'COURSE_SPRING', //课程类型 春季班、暑假班、秋季班、寒假班 默认春季班 PS: EVERYDAY("每天")--暑假寒假,
                week:'MONDAY', //每周几上课(针对春季班和秋季班), MONDAY("周一"),TUESDAY("周二"), WEDNESDAY("周三"), THURSDAY("周四"), FRIDAY("周五"),SATURDAY("周六"), SUNDAY("周日");
                monthDay:[new Date(nextMonthToday.year(),nextMonthToday.month(),nextMonthToday.date()),new Date(nextTwoMonthToday.year(),nextTwoMonthToday.month(),nextTwoMonthToday.date())], //上课日期
                timeRange:[new Date(2019, 1, 21, 17, 0), new Date(2019, 1, 21, 18, 0)], //上课时间 范围 (第二个参数月,从0开始)
                stageId:'', //期次
                img:'', //商品banner图
                descImg:'', //商品描述图
              },
              ifFirstEdit:false, //是否是 编辑商品mounted,是的话,courseId变的时候classId不变
              productRule:{
                productName:[
                  { validator: checkProductName, trigger: 'blur'}
                ],
                classId:[
                  { validator: checkClassId, trigger: 'change'}
                ],
                price:[
                  { validator: checkPrice, trigger: 'blur'}
                ]

              },

              imgPreviewFlag :false, //预览图片的弹窗是否显示
              imgPreviewUrl : '',//预览的图片地址

              ifShowUploading:false, //显示gif窗口
            }
        },
        mounted(){
          let params = this.$route.params;
          if(params.id){
            this.productId = parseInt(params.id);
          }
          if(params.type){
            this.editType = params.type;
          }

          if(this.productId!=-1 && this.editType=='edit'){
            this.ifFirstEdit = true;
          }

          this.getAllCourseList();
          this.getStageList();

          if(this.editType=='copy' || this.editType=='edit'){ //复制或编辑
            this.getProductById(params.id);
          }
        },
        watch: {
          'refFrom.courseId':{
            handler:function(val,old){
              console.log(val,'---watch  courseId')
              this.getClassListByCourseId(val);
              if(this.ifFirstEdit) { //目前是编辑商品mounted的时候courseId改变了
                this.ifFirstEdit = false;

              }else{
                this.$set(this.refFrom, 'classId', '');
              }
            }
          },

          'refFrom.courseType':{
            handler:function (val,old) {
              if(val=='COURSE_SUMMER' || val=='COURSE_WINTER'){
                this.$set(this.refFrom,'week','EVERYDAY');
              }else{
//                this.refFrom.week = 'MONDAY';
                this.$set(this.refFrom,'week','MONDAY')
//                console.log('watch 春秋班 每周一天')
              }

            }
          }
        },
        methods: {

          //获取要复制或编辑的那个商品的信息
          getProductById(id){
            let that = this;
            let param = {
              productId:id
            };
            that.request({
              method: 'post',
              url: '/product/get_product_by_id.do',
              param: param,
              success: function (result) {
                if (result.code == 200) {
                  if(result.result){

                    let tmpProduct = result.result;

                    let tmpBeginTimeHour = moment(new Date(tmpProduct.beginTime)).format('H');
                    let tmpBeginTimeMinute = moment(new Date(tmpProduct.beginTime)).format('mm');
                    console.log(tmpBeginTimeHour,'  --  ',tmpBeginTimeMinute);
                    let tmpEndTimeHour = moment(new Date(tmpProduct.endTime)).format('H');
                    let tmpEndTimeMinute = moment(new Date(tmpProduct.endTime)).format('mm');
                    console.log(tmpEndTimeHour,'  -结束时间-  ',tmpEndTimeMinute);

                    //春夏秋冬的课程,开始日期结束日期都从stage中获取(已和后台确认过)
                    let tmpBeginDay = moment(new Date(tmpProduct.stage.beginDay));
                    let tmpEndDay = moment(new Date(tmpProduct.stage.endDay));

                    let tmpForm = {
                      productName: tmpProduct.productName, //商品名称
                      courseId:tmpProduct.courseId,//课程名
                      //classId:tmpProduct.classId, //班级
                      price: Number(tmpProduct.price)/100, //价格
                      courseType:tmpProduct.type, //课程类型 春季班、暑假班、秋季班、寒假班 默认春季班 PS: EVERYDAY("每天")--暑假寒假,
                      week:tmpProduct.classRule, //每周几上课(针对春季班和秋季班), MONDAY("周一"),TUESDAY("周二"), WEDNESDAY("周三"), THURSDAY("周四"), FRIDAY("周五"),SATURDAY("周六"), SUNDAY("周日");

                      monthDay:[new Date(tmpBeginDay.year(),tmpBeginDay.month(),tmpBeginDay.date()),new Date(tmpEndDay.year(),tmpEndDay.month(),tmpEndDay.date())], //上课日期
                      timeRange:[new Date(2019, 1, 21, tmpBeginTimeHour, tmpBeginTimeMinute), new Date(2019, 1, 21, tmpEndTimeHour, tmpEndTimeMinute)], //上课时间 范围 (第二个参数月,从0开始)
                      stageId:tmpProduct.stage.id, //期次
                      img:tmpProduct.productImgUrl, //商品banner图
                      descImg:tmpProduct.descriptionImgUrl, //商品描述图
                    };

                    if(that.editType == 'copy'){ //复制的时候,班级id清空
                      tmpForm.classId = '';
                    }else{ //编辑
                      tmpForm.classId = tmpProduct.classId; //班级
                    }

                    that.refFrom = Object.assign({},tmpForm);
                    console.log('赋值之后,form');
                    console.log(that.refFrom);
                    /*
                    refFrom: {
                      productName: '', //商品名称
                        courseId:'',//课程名
                        classId:'', //班级
                        price:'', //价格
                        courseType:'COURSE_SPRING', //课程类型 春季班、暑假班、秋季班、寒假班 默认春季班 PS: EVERYDAY("每天")--暑假寒假,
                        week:'MONDAY', //每周几上课(针对春季班和秋季班), MONDAY("周一"),TUESDAY("周二"), WEDNESDAY("周三"), THURSDAY("周四"), FRIDAY("周五"),SATURDAY("周六"), SUNDAY("周日");
                        monthDay:[new Date(nextMonthToday.year(),nextMonthToday.month(),nextMonthToday.date()),new Date(nextTwoMonthToday.year(),nextTwoMonthToday.month(),nextTwoMonthToday.date())], //上课日期
                        timeRange:[new Date(2019, 1, 21, 17, 0), new Date(2019, 1, 21, 18, 0)], //上课时间 范围 (第二个参数月,从0开始)
//                img:'https://ziyue-xn.oss-cn-beijing.aliyuncs.com/product/img/20190221174238121718.png', //商品图
                        stageId:'', //期次
                        img:'', //商品banner图
                        descImg:'', //商品描述图
                    },
                    */
                  }else{
                    that.$message.error('未获取到商品信息,'+result.result);
                  }
                }else{
                  that.$message.error('获取商品信息失败,'+result.message);
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取商品详细信息失败');
              }
            });
          },

          //获取所有的课程列表
          getAllCourseList(){
            let that = this;
            let param = {

            };
            that.request({
              method: 'post',
              url: '/product/get_course.do',
              param: param,
              success: function (result) {
                if (result.code == 200) {
                  if(result.result){
                    that.courseList = JSON.parse(JSON.stringify(result.result));
                  }else{
                    that.courseList = [];
                  }
                }else{
                  that.$message.error('获取课程失败,'+result.message);
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取课程列表失败');
              }
            });
          },

          //根据课程id获取该课程下的所有班级
          getClassListByCourseId(id){
            let that = this;
            let param = {
              'courseId':id
            };
            if(that.editType == 'edit'){ //编辑商品的时候,多传两个参数,控制当前商品对应的编辑 不是disable状态
              param.productId = that.productId;
              param.action = 'UPDATE';
            };
            that.request({
              method: 'post',
              url: '/product/get_class.do',
              param: param,
              success: function (result) {
                if (result.code == 200) {
                  if(result.result){
                    that.classList = JSON.parse(JSON.stringify(result.result));
                  }else{
                    that.classList = [];
                  }
                }else{
                  that.$message.error('获取所有班级失败,刷新重试,'+result.message);
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取该课程下的所有班级失败');
              }
            });
          },

          //获取 暑假班、寒假班 的 有效期次
          getStageList(){
            let that = this;
            let param = {

            };
            that.request({
              method: 'post',
              url: '/product/stage/get_product_stage.do',
              param: param,
              success: function (result) {
                if (result.code == 200) {
                  if(result.result){
                    that.stageList = JSON.parse(JSON.stringify(result.result));
                  }else{
                    that.stageList = [];
                  }
                }else{
                  that.$message.error('获取有效期次失败,'+result.message);
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取期次列表列表失败');
              }
            });
          },

          //上传图片
          changeUpload(eleId,imgType){
            let that = this;
            that.ifShowUploading = true;
            let fd = new FormData();
            fd.append("file", document.getElementById(eleId).files[0]);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/file/upload_file.do');
            fd.append("fileType", "PRODUCT_IMG");
            xhr.onload = function () {
              let backResponse = JSON.parse(xhr.responseText);
              if (backResponse.code == 200 && backResponse.result) {
                if(imgType=='desc'){
                   //描述
                  that.refFrom.descImg = backResponse.result;
                }else{
                  //头图
                  that.refFrom.img = backResponse.result;
                }

                that.ifShowUploading = false;
                document.getElementById(eleId).value ='';
              } else {
                console.log('商品上传图片失败 changeUpload,',imgType,' eleId is ',eleId)
              }
            };
            xhr.send(fd);
          },

          //预览图片--针对学生上传的
          previewImg(url){
            console.log(url);
            this.imgPreviewFlag = true;
            this.imgPreviewUrl = url;
          },

          //添加商品
          saveSubmit(formName){
            let that = this;
            that.$refs[formName].validate((valid) =>{
              if (valid){
                //验证成功
                let param = {
                  productName: that.refFrom.productName, // 商品名称
                  courseId: that.refFrom.courseId, //    课程id
                  classId: that.refFrom.classId, //     班级id
                  price: parseInt(Number(that.refFrom.price)*100), //价格,存储单位为分
                  type: that.refFrom.courseType, //类型:
                  classRule: that.refFrom.week, //上课规则(每周几 或者 每天)
                  beginTime: moment(that.refFrom.timeRange[0]).format('H:mm'), //  上课时间:19:00
                  endTime: moment(that.refFrom.timeRange[1]).format('H:mm'), //   下课时间:20:00
                  productImgUrl: that.refFrom.img, //  商品banner图
                  descriptionImgUrl: that.refFrom.descImg, //商品描述图
                };

                /*
                * 春秋,每周x上课,没有期次,不传参数 stageId
                * 暑寒,每天上课,有期次,   不传参数 beginDay endDay
                * */

                let paramCourseType = that.refFrom.courseType;
                if(paramCourseType == 'COURSE_SPRING' || paramCourseType =='COURSE_AUTUMN'){
                  //春秋
                  param.beginDay = moment(that.refFrom.monthDay[0]).format('YYYY-MM-DD');
                  param.endDay = moment(that.refFrom.monthDay[1]).format('YYYY-MM-DD');
                }else{
                  //暑寒
                  param.stageId = that.refFrom.stageId;
                }

                let urlSave = '/product/save_product.do';
                if(that.editType == 'edit'){ //编辑
                  urlSave = '/product/update_product.do';
                  param.id = that.productId;
                }

                console.log(urlSave+'   保存 url');
                console.log(param);


                that.request({
                  method: 'post',
                  url: urlSave,
                  param: param,
                  success: function (result) {
                    if (result.code == 200) {
                      that.$router.replace('/productManage');
                    }else{
                      that.$message.error('保存失败,'+result.message);
                    }
                  },
                  error: function (error) {
                    //服务器异常
                    console.log(error);
                    that.$message.error('保存商品失败');
                  }
                });
              }else{
                console.log('验证失败!!');
                return false;
              }
            });
          },

          //取消保存
          saveCancel(formName){
            this.$router.go(-1);
          }
        }
    }
</script>
<style lang="scss" scoped>
  .dialog-img{
  img{
    margin:0 auto;
    display:block;
    max-width:100%;
    max-height: 560px;
    overflow: auto;
  }
  }
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

  /*商品form  product-box*/
  .product-box {

  .product-img-block {
    display: flex;

  .course-img {
    width: 104px;
    height: 104px;
    border-radius: 4px;
    border: 1px dashed #E0E0E0;
    text-align: center;
    color: #E0E0E0;
    position: relative;
    cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
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

  .iconfont {
    margin-top: 20px;
    margin-bottom: 12px;
    font-size: 24px;
  }

  p {
    font-size: 16px;
    color: #BDBDBD;
    line-height: 24px;
  }

  }
  .course-item {
    font-size: 12px;
    color: #BDBDBD;
    line-height: 22px;
    margin-left: 16px;

    .refresh-file-box{
      display:block;
      height: 28px;
      position: relative;
      margin-bottom:14px;
      .ipt-file {
        width:24px;
        height: 24px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 100;
      }

      .refresh-icon{
        font-size:24px;
        color:#f08d00;
        cursor: pointer;
      }

    }
  }

  }
  }
</style>
