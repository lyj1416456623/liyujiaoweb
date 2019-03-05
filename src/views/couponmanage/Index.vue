<template>
  <!--<div class="coupon-box">-->
    <!--优惠券列表-->
  <!--</div>-->
  <div class="xi-container">
    <el-header class="auth-header coupon-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">优惠券管理</a>
      </el-breadcrumb>
      <h4 class="auth-title">优惠券</h4>
      <el-tabs class="xi-el-tabs" v-model="couponStatus">
        <el-tab-pane label="未使用" name="WAIT_USE"></el-tab-pane>
        <el-tab-pane label="已使用" name="HAVE_USE"></el-tab-pane>
        <el-tab-pane label="已停用" name="STOP_USE"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container>
      <el-main class="coupon-main">
        <div class="header-tool">
          <div><el-button type="primary" plain @click="addCouponFun" v-if="couponStatus=='WAIT_USE'">添加优惠券</el-button>
          </div>
          <div class="header-search">
            搜索条件：
              <el-select v-model="queryType" placeholder="请选择" style="width:92px;" size="medium">
                <el-option
                  v-for="item in optionsQuery"
                  :key="item.queryValue"
                  :label="item.queryName"
                  :value="item.queryValue">
                </el-option>
              </el-select>
              <el-input
                debounce size="medium"
                @change="searchTextChange"
                :placeholder="placeholderText"
                v-model="searchText">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>

          </div>

        </div>
        <div class="main-organ coupon-table-box">
          <template v-if="couponStatus=='WAIT_USE'">
            <el-table :data="waitUseList" style="width:100%" ref="waitUseTable">
              <el-table-column prop="couponName" label="优惠券名称" min-width="40%" :key="Math.random()"></el-table-column>
              <el-table-column prop="userAccount" label="发放手机号" min-width="15%" :key="Math.random()"></el-table-column>
              <el-table-column prop="createUserName" label="创建人" min-width="15%" :key="Math.random()"></el-table-column>
              <el-table-column label="优惠金额" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  ￥{{ scope.row.price/100 }}
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  <el-popover
                    placement="bottom"
                    width="160"
                    v-model="scope.row.stopFlag">
                    <p>确定要停用该优惠券吗?</p>
                    <div style="text-align: right; margin: 8px 0 0 0;">
                      <el-button size="mini" type="text" @click="scope.row.stopFlag = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="stopUseFun(scope.row)">确定</el-button>
                    </div>
                    <el-button type="text" slot="reference">停用</el-button>

                  </el-popover>


                  <!--<el-button type="text" @click="stopUseFun(scope.row.id)">停用-->
                  <!--</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="page-block" v-if="waitUseTotal>0">
              <el-pagination
                @current-change="handleWaitUseChange"
                :current-page.sync="waitUsePage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="waitUseTotal">
              </el-pagination>
            </div>
          </template>
          <template v-else-if="couponStatus=='HAVE_USE'">
            <el-table :data="hasUseList" style="width:100%" ref="hasUseTable">
              <el-table-column prop="couponName" label="优惠券名称" min-width="40%" :key="Math.random()"></el-table-column>
              <el-table-column prop="userAccount" label="发放手机号" min-width="15%" :key="Math.random()"></el-table-column>
              <el-table-column prop="createUserName" label="创建人" min-width="15%"></el-table-column>
              <el-table-column label="优惠金额" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  ￥{{ scope.row.price/100 }}
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  已使用
                </template>
              </el-table-column>
            </el-table>
            <div class="page-block" v-if="hasUseTotal>0">
              <el-pagination
                @current-change="handleHasUseChange"
                :current-page.sync="hasUsePage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="hasUseTotal">
              </el-pagination>
            </div>
          </template>
          <template v-else>
            <el-table :data="stopUseList" style="width:100%" ref="stopUseTable">
              <el-table-column prop="couponName" label="优惠券名称" min-width="40%" :key="Math.random()"></el-table-column>
              <el-table-column prop="userAccount" label="发放手机号" min-width="15%"></el-table-column>
              <el-table-column prop="createUserName" label="创建人" min-width="15%" :key="Math.random()"></el-table-column>
              <el-table-column label="优惠金额" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  ￥{{ scope.row.price/100 }}
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="15%" :key="Math.random()">
                <template slot-scope="scope">
                  已停用
                </template>
              </el-table-column>
            </el-table>
            <div class="page-block" v-if="stopUseTotal>0">
              <el-pagination
                @current-change="handleStopUseChange"
                :current-page.sync="stopUsePage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="stopUseTotal">
              </el-pagination>
            </div>
          </template>
        </div>
      </el-main>
      <!--添加优惠券的弹窗-->
      <el-dialog
        title="添加优惠券"
        :modal-append-to-body='false'
        :visible.sync="addCouponFlag"
        :close-on-click-modal="false"
        width="496px">
        <el-form ref="couponForm" :model="addCouponItem" :rules="formRule" label-width="100px">
          <el-form-item label="名称：" prop="couponName">
            <el-input v-model="addCouponItem.couponName"></el-input>
          </el-form-item>
          <el-form-item label="优惠金额：" prop="price">
            <el-input v-model="addCouponItem.price" type="number" class="ziyue-ipt-price"></el-input>
          </el-form-item>
          <el-form-item label="发放账号：" prop="userAccount">
            <el-input v-model="addCouponItem.userAccount"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="saveCancel" size="medium">取 消</el-button>
          <el-button type="primary" @click="saveSubmit" size="medium">保 存</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
    export default{
      name: '',
      props: [],
      components: {},
      data(){
        var checkCouponPrice = (rule,val,callback) =>{
          if(val === '' || Number(val)<=0){
            return callback(new Error('优惠券金额必须大于0！'));
          }else{
            callback();
          }
        };

        return {
          couponStatus: 'WAIT_USE', //可使用的--WAIT_USE; 已使用--HAVE_USE; 已停用---STOP_USE  以前叫 activeName

          searchText: '', //搜索的输入框内容
          optionsQuery: [
            {
              queryValue: 'COUPON_NAME',
              queryName: '名称'
            }, {
              queryValue: 'USER_ACCOUNT',
              queryName: '手机号'
            }
          ], //搜索的类型集合
          queryType: 'COUPON_NAME',
          placeholderText: '搜索优惠券名称',

          waitUseList: [], //未使用的优惠券列表
          waitUsePage: 1,
          waitUseTotal: 0, //未使用的优惠券 总个数

          hasUseList: [], //已经使用的优惠券列表
          hasUsePage: 1,
          hasUseTotal: 0, //已经使用的优惠券 总个数

          stopUseList: [], //停止使用的优惠券列表
          stopUsePage: 1,
          stopUseTotal: 0, //停止使用的优惠券 总个数
          pageSize: 10, //每页显示几条数据  上课中、已结课都用这一个数据


          addCouponFlag: false, //添加优惠券的弹窗是否显示
          addCouponItem: {
            couponName: '',
            price: '', //发放金额,最后保存的时候,要以分为单位。这里还是元
            userAccount: '', //发放账号

          }, //弹窗中 优惠券信息
          formRule:{
            couponName: [
              { required: true, message: '请输入优惠券名称', trigger: 'blur' }
            ],
            price: [
              { validator:checkCouponPrice, trigger: 'blur',required:true }
            ],
            userAccount: [
              { required: true, message: '请输入发送手机号', trigger: 'blur' }
            ],
          } //弹窗中 优惠券form的规则
        }
      },
      mounted(){
        this.getCouponList();
      },
      watch: {
        //优惠券状态
        couponStatus(val,old){
          this.queryType = 'COUPON_NAME';
          this.placeholderText= '请输入优惠券名称';
          this.searchText = ''; //目前三个tab用的一个变量值来存储搜索内容,所以切换tab的时候给清空。后期再改为三个变量来存储不同tab的搜索内容
          this.getCouponList();
        },

        //搜索条件--名称/手机
        queryType(val) {
          if (val == 'COUPON_NAME') {
            this.placeholderText = '搜索优惠券名称';
          }else{
            this.placeholderText = '搜索发送手机号';
          }
          if (this.searchText != '') {
            this.searchText = '';
            if(this.couponStatus == 'WAIT_USE'){
              this.waitUsePage=1;
            }else if(this.couponStatus == 'HAVE_USE'){
              this.hasUsePage=1;
            }else{
              this.stopUsePage=1;
            }

            this.getCouponList();
          }
        },
      },
      methods: {

        //获取优惠券列表(列表 和 搜索列表)
        getCouponList(){
          let that = this;
          let paramPageNum = that.waitUsePage;
          if (that.couponStatus == 'HAVE_USE') {
             paramPageNum = that.hasUsePage;
          } else if (that.couponStatus == 'STOP_USE') {
             paramPageNum = that.stopUsePage;
          }

          let param = {
            pageNum: paramPageNum,
            pageSize: that.pageSize,
            couponStatus: that.couponStatus,
            queryData: that.searchText
          };
          that.request({
            method: 'post',
            url: '/manage/coupon/list_coupon.do',
            param: param,
            success: function (result) {
              if (result.code == 200 && result.result && result.result.infoList) {

                if (that.couponStatus == 'HAVE_USE') {
                  that.hasUseList = JSON.parse(JSON.stringify(result.result.infoList));
                  that.hasUseTotal = result.result.total;
                } else if (that.couponStatus == 'STOP_USE') {
                  that.stopUseList = JSON.parse(JSON.stringify(result.result.infoList));
                  that.stopUseTotal = result.result.total;
                } else { //未使用的优惠券
                  let tmpWaitList = JSON.parse(JSON.stringify(result.result.infoList));
                  tmpWaitList.map(item=>{
                    item.stopFlag = false
                  });
                  that.waitUseList = JSON.parse(JSON.stringify(tmpWaitList));

                  that.waitUseTotal = result.result.total;
                }
              } else {
                that.$message.error('获取优惠券失败,' + result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取优惠券列表失败了');
            }
          });
        },

        //停用优惠券
        stopUseFun(row){
          console.log('停用优惠券  ', row.id);
          let that = this;
          let param = {
            id: row.id
          };
          that.request({
            method: 'post',
            url: '/manage/coupon/stop_coupon.do',
            param: param,
            success: function (result) {
              if (result.code == 200) {
                that.getCouponList();
              } else {
                that.$message.error('停用优惠券失败,' + result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('停用优惠券 失败了');
            }
          });

        },

        //搜索内容改变后,调用搜索接口
        searchTextChange(){
          let that = this;
          console.log('search change,搜索的内容默认为第一页的内容');
          if (that.couponStatus == 'HAVE_USE') {
            that.hasUsePage = 1;
          } else if (that.couponStatus == 'STOP_USE') {
            that.stopUsePage = 1;
          }else{
            that.waitUsePage = 1;
          }
          this.getCouponList();
        },

        //未使用的优惠券 分页
        handleWaitUseChange(val){
          this.waitUsePage = val;
          console.log('未使用 优惠券  当前第几页  ', val);
          this.getCouponList();
        },
        //已经使用的优惠券 分页
        handleHasUseChange(val){
          this.HasUsePage = val;
          console.log('已经使用 优惠券  当前第几页  ', val);
          this.getCouponList();
        },
        //停止使用的优惠券 分页
        handleStopUseChange(val){
          this.stopUsePage = val;
          console.log('停止使用 优惠券  当前第几页  ', val);
          this.getCouponList();
        },

        //添加优惠券按钮的事件
        addCouponFun(){
          this.addCouponFlag = true;
        },

        //添加优惠券的弹窗--取消添加
        saveCancel(){
          this.addCouponFlag = false;
          this.$refs['couponForm'].resetFields();
        },
        //添加优惠券的弹窗--确认添加
        saveSubmit(){
          let that = this;
          that.$refs['couponForm'].validate((valid) => {
            if (valid) {

              let param = {
                couponName: that.addCouponItem.couponName,
                userAccount: that.addCouponItem.userAccount,
                price: parseInt(Number(that.addCouponItem.price) * 100)
              };
              that.request({
                method: 'post',
                url: '/manage/coupon/add_coupon.do',
                param: param,
                success: function (result) {
                  if (result.code == 200) {
                    that.addCouponFlag = false;
                    that.$refs['couponForm'].resetFields();
                    that.$message({
                      message: '添加优惠券成功',
                      type: 'success'
                    });
                    that.searchText = '';//清空之前的搜索条件
                    that.getCouponList();
                  } else {
                    that.$message.error('添加优惠券失败,' + result.message);
                  }
                },
                error: function (error) {
                  //服务器异常
                  console.log(error);
                  that.$message.error('添加新的优惠券失败了');
                }
              });

            } else {
              console.log('error submit!! 优惠券');
              return false;
            }
          });
        },
      }
    }
</script>
<style lang="scss" scoped>
  @import "../../style/header.css";

  .coupon-header{
    .auth-title {
      padding-bottom: 8px;
    }
  }

  .coupon-main {
    margin: 24px;
    padding: 20px 24px;
    background: #fff;

  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

  .el-input {
    width: 240px;
  }

  } /* header-tool */

  .coupon-table-box{
  .page-block {
    text-align: right;
    padding-top: 10px;
  }
  }



  }

</style>
