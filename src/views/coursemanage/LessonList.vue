<template>
  <div class="xi-container lesson-list">
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <!--<router-link :to="{ path: '/manageIndex' }">首页</router-link>-->
        <!--<span>/</span>-->
        <router-link :to="{ path: '/courseManage' }">课程管理</router-link>
        <span>/</span>
        <router-link :to="{ path: '/courseDetail/'+params.course }">课程详情</router-link>
        <span>/</span>
        <a class="current-breadcrumb" href="javascript:void(0)">课节列表</a>
      </el-breadcrumb>
      <h4 class="common-title">{{params.className}}</h4>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <router-link class="el-button el-button--primary is-plain" :to="{path:'/lessonAdd/'+params.class+'/-1'}">添加课节</router-link>
        </div>
        <div class="main-organ">
          <el-table :data="lessonListData" style="width: 100%">
            <el-table-column label="课节" min-width="20%">
              <template slot-scope="scope">
                <!--第 {{scope.$index+1}} 课-->
                第 {{scope.row.lessonIndex}} 课
              </template>
            </el-table-column>
            <el-table-column prop="classDate" label="开课日期" min-width="15%">

            </el-table-column>
            <el-table-column label="时间" min-width="15%">
              <template slot-scope="scope">
                <span>{{ new Date(scope.row.beginTime).getHours()+':'+checkTime(new Date(scope.row.beginTime).getMinutes())}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="durationString" label="时长" min-width="15%">

            </el-table-column>
            <el-table-column label="老师" min-width="15%">
              <template slot-scope="scope">
                <template v-if="scope.row.teacher">
                  <span>{{scope.row.teacher.userName}}</span>
                </template>
                <template v-else>
                  <span>--</span>
                </template>

              </template>
            </el-table-column>
            <el-table-column label="插班生" min-width="25%">
              <template slot-scope="scope">
                <template v-if="scope.row.transferStudents&&scope.row.transferStudents.length>0">
                  <!--有插班生-->
                  <!--<div class="ziyue-flex">-->
                    <!--<div class="ziyue-flex-item">-->
                      <div class="transfer-stu-box">
                        <template v-for="(transfer,tIdx) in scope.row.transferStudents">
                          <span class="transfer-stu-tag" v-if="tIdx<2">{{transfer.userName+'-'+transfer.userAccount.slice(transfer.userAccount.length-4)}}</span>
                        </template>
                      </div>
                      <div class="c-f-primary" style="cursor: pointer;" @click="showTransfer(scope.row.lessonIndex,scope.row)">
                        共{{scope.row.transferStudents.length}}人
                        <i class="iconfont icon-bianji transfer-zicon"></i>
                      </div>

                </template>
                <template v-else>
                  <!--还没有插班生-->
                  <i class="iconfont icon-jiahao transfer-zicon" @click="showTransfer(scope.row.lessonIndex,scope.row)"></i>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <span class="course-option" @click="editCourse(scope.row)" v-if="scope.row.ifEdit">编辑</span>
                <span class="course-option course-option-grey" v-if="!scope.row.ifEdit">编辑</span>

                <span class="course-option" @click="delCourse(scope.row)" v-if="scope.row.ifDelete">删除</span>
                <span class="course-option course-option-grey"  v-if="!scope.row.ifDelete">删除</span>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>还没有课节哦！</p>
            </div>
          </el-table>
        </div>
      </el-main>

      <!--:visible.sync="dialogVisible"   dialogVisible = false -->
      <el-dialog
        :title="dialogTitle"
        width="30%"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
      >
        <div class="dialog-transfer ziyue-flex">
          <label class="df-title">插班生：</label>
          <el-select v-model="transferList" multiple filterable placeholder="请选择插班生" class="ziyue-flex-item">
            <el-option
              v-for="item in studentListForTransfer"
              :key="item.userAccount"
              :label="item.userName+item.userAccount.substr(-4,4)"
              :value="item.userAccount">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="transferChangeCancel">取 消</el-button>
          <el-button type="primary" @click="transferChangeConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  /*
  * 2019.1.25
  * 已经上过的课,不能编辑、不能删除
  * 正在上的课,只能编辑老师,不能删除
  * 今天要上的课,只能编辑老师,不能删除
  * 明天之后的课程,可以编辑、可以删除
  * */
  import moment from 'moment';
    export default{
        name: '',
        props: [],
        components: {},
        data(){
            return {
              params:{}, //course--courseId;class--classId;className;
              lessonListData:[

              ], //课节列表

              studentListInCurClass:[], //当前班级的学生
              studentListAll:[], //所有的学生

              //插班生相关
              studentListForTransfer:[], //可以插班的学生列表
              transferLessonId:null, //插班生弹窗对应的lessonId
              dialogVisible:false, //插班生弹窗
              dialogTitle:'', //插班生弹窗 title

              transferList: [], //选择的插班生 account集合
            }
        },
        mounted(){
          let that = this;


          let params = this.$route.params;
          that.params = params;//保存地址栏传过来的值，用于页面上的判断
          if(params.class) {
            that.getLessonListByClassId();

            that.getAllStudent(function () {
              that.getStudentListInCurClass(function () {
                that.getStudentForTransfer();//所有的插班生
              }); //获取本班学生
            }); //获取所有的学生

          }
        },
        watch: {},
        methods: {
          //分钟格式化
          checkTime(i){
            if (i<10){
              i = "0" + i;
            }
            return i;
          },
          //获取所有的学生
          getAllStudent(callback){
            let that = this;
            that.request({
              method: 'post',
              url: '/user/get_students.do',
              param: {},
              success: function (result) {
                console.log(result)
                if (result.code == 200 && result.result) {
                  that.studentListAll = result.result;
                  //console.log(that.studentListAll,'  所有学生列表')
                  if(callback){
                    callback();
                  }
                  /* studentListAll 格式
                   {
                   "createTime": 1544778361000,
                   "id": 1315,
                   "ifDelete": false,
                   "ifSysUser": false,
                   "userAccount": "18511058553",
                   "userName": "祖国琳"
                   },
                  * */
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取所有学生失败，请重试。')
              }
            });
          },

          //获取当前班级的学生
          getStudentListInCurClass(callback){
            let that = this;
            that.request({
              method: 'post',
              url: '/class/get_class_info_by_id.do',
              param: {classId:that.params.class},
              success: function (result) {
                console.log(result)
                if (result.code == 200 && result.result) {
                  that.studentListInCurClass = result.result.students || [];
                  //console.log(that.studentListInCurClass,'  本班的学生列表')
                  if(callback){
                    callback();
                  }
                  /* studentListInCurClass格式
                  {
                    "classId": 2000,
                    "createTime": 1545041279000,
                    "id": 22326,
                    "userAccount": "15313971349",
                    "userId": 1844,
                    "userName": "晨晨",
                    "userType": "STUDENT"
                  },
                  */
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取当前班级信息失败，请重试。')
              }
            });
          },

          //得到可以插班的学生列表
          getStudentForTransfer(){
            let that = this;

            let tmpStuListTransfer = JSON.parse(JSON.stringify(that.studentListAll));
            let delIndexArr = []; //本班的学生,在学生列表中的索引。 插班时需要删除本班的学生
            that.studentListAll.map((allStu,allIdx)=>{
              that.studentListInCurClass.map(classStu=>{
                if(allStu.userAccount == classStu.userAccount){
                  delIndexArr.push(allIdx);
                }
              });
            });

            console.log(delIndexArr,'  本班的学生 的 索引')
            //应该倒着删,避免顺着删之后,索引错移
            for(let i=(delIndexArr.length-1);i>=0;i--){
              let tmpIdx = delIndexArr[i];
              //console.log(tmpIdx,'===当前删的idx');

              if(tmpStuListTransfer[tmpIdx]){
                tmpStuListTransfer.splice(tmpIdx,1)
              }
            }

            that.studentListForTransfer = JSON.parse(JSON.stringify(tmpStuListTransfer));

          },

          //编辑课节   row.id == lessonId
          editCourse(row){
            this.$router.push("/lessonAdd/" + this.params.class+'/'+row.id);
          },

          //删除课节 row.id
          delCourse(row){
            let that = this;
            that.$confirm('确定要删除此课节吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log("确定删除,暂时没有调用接口");
              that.request({
                method: 'post',
                url: '/lesson/lesson_delete.do',
                param: {lessonId:row.id},
                success: function (result) {
                  console.log(result,' -----删除课节');
                  if (result.code == 200) {
                    that.$message({
                      message: '删除课节成功',
                      type: 'success',
                      duration:3000
                    });
                    that.getLessonListByClassId();//重新加载课节列表
                  }else{
                    that.$message.error('删除课节失败了 '+result.message)
                  }
                },
                error: function (error) {
                  //服务器异常
                  console.log(error);
                  that.$message.error('删除课节失败，请重试。')
                }
              });

            }).catch(() => {
              console.log("取消删除");
            });
          },

          //获取课节列表,先默认写死30条数据,后期万一数据不对,再调整。debugger
          getLessonListByClassId(){
            let that = this;
            that.request({
              method: 'post',
              url: '/lesson/get_lesson_for_page.do',
              param: {classId:that.params.class,page:1,rows:30},
              success: function (result) {
                console.log(result);
                if (result.code == 200 && result.result) {
                  let tmpLessonList = result.result.data;

                  //已经上过的课程,不能编辑,其他都可以  //明天之后的课程,才可以删除,其他都不能删除
                  tmpLessonList.map(item=>{
                    if(item.ifComplete){//已经上过的课,不能编辑  item.endTime<=new Date().getTime()
                      item.ifEdit = false;
                    }else{
                      item.ifEdit = true;
                    }

                    let tmpBegin = moment(new Date(item.beginTime)).format('L');
                    //console.log(tmpBegin,'----tmpBegin')
                    let tmpTomorrowDate = moment().add(1,'days').format('L');
                    //console.log(tmpTomorrowDate,'----tmpTomorrowDate')
                    if(tmpBegin>=tmpTomorrowDate){ //明天之后的课,可以删除
                      item.ifDelete = true;
                    }else{
                      item.ifDelete = false;
                    }
                  });
                  that.lessonListData = JSON.parse(JSON.stringify(tmpLessonList));
                }else{
                  that.$message.error('获取课节列表失败了，刷新页面重试吧。')
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('获取课节列表失败，刷新页面重试。')
              }
            });
          },

          //显示 编辑、+ 插班生
          showTransfer(index,row){
            let that = this;
            that.dialogTitle = '第'+(index)+'课'; //如果index 是scope.$index,则返回index+1; 这里是lessonIndex,所以不需要+1

            that.transferLessonId = row.id;

            that.transferList = []; //插班生清空后, 赋上已选的插班生
            if(row.transferStudents){
              row.transferStudents.map(item=>{
                that.transferList.push(item.userAccount)
              });
            }

            that.dialogVisible = true;
          },

          //确定添加插班生
          transferChangeConfirm(){
            let that = this;

            let transParam = {
              lessonId:that.transferLessonId,
              studentAccounts:that.transferList.join(',')
            };
            that.request({
              method: 'post',
              url: '/lesson/add_transfer_student.do',
              param: transParam,
              success: function (result) {
                console.log(result,' -----添加、编辑 插班生弹窗的确定');
                if (result.code == 200 && result.result) {
                  that.getLessonListByClassId(); //重新加载课节列表
                }
                that.dialogVisible = false;
                that.transferList = []; //插班生清空
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                that.$message.error('编辑插班生失败，请重试。')
                that.dialogVisible = false;
                that.transferList = []; //插班生清空
              }
            });

          },

          //取消添加插班生
          transferChangeCancel(){
            let that = this;

            that.dialogVisible = false;
            that.transferList = []; //插班生清空
          }
        }
    }
</script>
<style lang="scss" scoped>
.lesson-list{

.main-organ {
  margin-top: 20px;
  /*操作*/
  .course-option {
    padding: 0 15px;
    color: #F08D00;
    border-right: 1px solid #F0F0F0;
    cursor: pointer;
  }
  .course-option:first-child{
    padding-left:0;
  }
  .course-option:last-child{
    border-right:0;
  }
  .course-option-grey{
    color: #E0E0E0;
    cursor: none;
  }

  /*插班生相关的icon*/
  .transfer-stu-box{
    .transfer-stu-tag{
      display: inline-block;
      margin-left:8px;
      font-size:14px;
      color:#909090;
      background:rgba(245,245,245,1);
      border-radius:4px;
      line-height: 14px;
      padding:5px;
    }
    .transfer-stu-tag:first-child{
      margin-left:0;
    }
  }
  .transfer-zicon{
    font-size:16px;
    color: #F08D00;
    cursor:pointer;
  }
}
}
</style>
