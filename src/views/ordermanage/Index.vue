<template>
  <!--<div>订单管理&#45;&#45;订单列表页面</div>-->
  <el-container>
    <el-header class="common-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">订单管理</a>
      </el-breadcrumb>
      <h4 class="common-title">订单</h4>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <div>查看维度:
            <el-radio-group v-model="radioActive" size="medium">
              <el-radio-button label="订单"></el-radio-button>
              <el-radio-button label="寄送"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="header-search">
            搜索条件：
            <template v-if="radioActive=='订单'">

              <el-select v-model="queryType" placeholder="请选择" style="width:92px;" size="medium">
                <el-option
                  v-for="item in options"
                  :key="item.queryValue"
                  :label="item.queryName"
                  :value="item.queryValue">
                </el-option>
              </el-select>
              <el-input
                debounce size="medium"
                @change="searchChange"
                :placeholder="placeholderText"
                v-model="searchText">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
            <template v-else>
              <el-select v-model="queryTypePost" placeholder="请选择" style="width:92px;" size="medium">
                <el-option
                  v-for="item in optionsPost"
                  :key="item.queryValue"
                  :label="item.queryName"
                  :value="item.queryValue">
                </el-option>
              </el-select>
              <el-input
                debounce size="medium"
                @change="searchChangePost"
                :placeholder="placeholderTextPost"
                v-model="searchText">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
          </div>
        </div>
        <div class="main-organ">
          <div v-show="radioActive=='订单'">
            <el-table :data="orderList" style="width: 100%" ref="orderTable">
              <el-table-column label="商品名称" min-width="18%">
                <template slot-scope="scope">
                  <span>{{scope.row.productName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="关联课程·班级" min-width="20%">
                <template slot-scope="scope">
                  {{scope.row.courseName?scope.row.courseName+' / ':''}} {{ scope.row.className}}
                </template>
              </el-table-column>
              <el-table-column prop="userAccount" label="学习手机号" min-width="10%">
              </el-table-column>
              <el-table-column prop="userName" label="学生名" min-width="10%">
              </el-table-column>
              <el-table-column label="实际付费" min-width="8%">
                <template slot-scope="scope">
                  <el-popover placement="bottom" width="176" height="122" trigger="hover"
                              v-if="scope.row.orderStatus=='SUCCESS'">
                    <div class="popover-detail-order">
                      <div class="popover-detail">
                        <p>课程原价：<span>￥{{scope.row.originalPrice/100}}</span></p>
                        <p>优惠价：<span>-￥{{scope.row.couponPrice/100}}</span></p>
                        <p>实际付费：<span class="sell-price">￥{{scope.row.sellPrice/100}}</span></p>
                      </div>
                    </div>
                    <span class="sell-price" slot="reference">￥{{scope.row.sellPrice/100}}</span>
                  </el-popover>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column label="订单状态" min-width="10%">
                <template slot-scope="scope">
                  <template v-if="scope.row.orderStatus=='WAITING'">
                    <span class="dot order-wait"></span>未支付
                  </template>
                  <template v-else-if="scope.row.orderStatus=='SUCCESS'">
                    <span class="dot order-payed"></span>已支付
                  </template>
                  <template v-else>
                    <span class="dot order-expired"></span>已过期
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="24%">
                <template slot-scope="scope">
                  {{scope.row.remark}} <i class="iconfont icon-bianji edit-marked"
                                          @click="showEditMarked(scope.row)"></i>
                </template>
              </el-table-column>
              <div slot="empty" v-if="searchText==''">
                <p>还没有订单哦！</p>
              </div>
              <div slot="empty" v-if="searchText!=''">
                <p>没有你要找的订单哦！</p>
              </div>
            </el-table>
            <div class="pagination-block" v-if="orderTotal>0">
              <el-pagination
                @current-change="handleCurrentOrderChange"
                :current-page.sync="pageOrder"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="orderTotal">
              </el-pagination>
            </div>
          </div>
          <div v-show="radioActive=='寄送'">
            <el-table :data="postList" style="width: 100%" ref="postTable">
              <el-table-column label="商品名称" min-width="18%">
                <template slot-scope="scope">
                  <span>{{scope.row.productName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="学生名" min-width="8%">
              </el-table-column>
              <el-table-column prop="orderName" label="收货人" min-width="8%">
              </el-table-column>
              <el-table-column prop="orderPhoneNum" label="收件手机号" min-width="13%">
              </el-table-column>
              <el-table-column prop="orderAddress" label="收获地址" min-width="23%">
                <template slot-scope="scope">
                  {{scope.row.orderZone.join("")}} {{ scope.row.orderAddress }}
                </template>
              </el-table-column>
              <el-table-column label="寄送状态" min-width="12%">
                <template slot-scope="scope">
                  <template v-if="scope.row.haveSendBook==false">
                    <el-popover
                      placement="top"
                      width="160"
                      v-model="scope.row.postFlag">
                      <p>你确定{{scope.row.userName}}的教材已经寄送了吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.postFlag = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="postStatusChange(scope.row)">确定</el-button>
                      </div>
                      <span class="post-wait" slot="reference">标记为已寄送</span>
                      <!--<el-button slot="reference">删除</el-button>-->
                    </el-popover>

                  </template>
                  <template v-else>
                    <span class="post-posted">已寄送</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="18%">
                <template slot-scope="scope">
                  {{scope.row.remark}} <i class="iconfont icon-bianji edit-marked"
                                          @click="showEditMarked(scope.row)"></i>
                </template>
              </el-table-column>
              <div slot="empty" v-if="searchText==''">
                <p>还没有寄送信息哦！</p>
              </div>
              <div slot="empty" v-if="searchText!=''">
                <p>没有你要找的寄送哦！</p>
              </div>
            </el-table>
            <div class="pagination-block" v-if="postTotal>0">
              <el-pagination
                @current-change="handleCurrentPostChange"
                :current-page.sync="pagePost"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="postTotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-main>
      <!--编辑备注弹窗-->
      <el-dialog
        :title="dialogTitle"
        :modal-append-to-body='false'
        :visible.sync="editDialogShow"
        :close-on-click-modal="false"
        width="496px">
        <el-form ref="courseForm" label-width="60px">
          <el-form-item label="备注：">
            <el-input v-model="editMarkedOrder.remark" type="textarea" :rows="5"></el-input>
            <!--<p class="text-num">{{courseFeditMarkedOrderorm.description.length}}/400</p>-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit" size="medium">取 消</el-button>
          <el-button type="primary" @click="submitEditMarked" size="medium">保 存</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: '',
    props: [],
    components: {},
    data() {
      return {
        radioActive: '订单',

        searchText: '', //搜索输入框
        //订单 搜索条件
        options: [
          {
            queryValue: 'PRODUCT_NAME',
            queryName: '商品名'
          }, {
            queryValue: 'STUDENT_PHONE',
            queryName: '手机号'
          }, {
            queryValue: 'STUDENT_NAME',
            queryName: '学生名'
          }
        ],
        queryType: 'PRODUCT_NAME',
        placeholderText: '搜索商品名',

        //寄送 搜索条件
        optionsPost: [
          {
            queryValue: 'PRODUCT_NAME',
            queryName: '商品名'
          }, {
            queryValue: 'STUDENT_NAME',
            queryName: '学生名'
          }
        ],
        queryTypePost: 'PRODUCT_NAME',
        placeholderTextPost: '搜索商品名',

        pageSize: 10, //每页10条数据

        orderList: [], //订单列表
        orderTotal: 1, //订单总数
        pageOrder: 1,//订单列表--当前显示第几页数据

        postList: [], //寄送列表
        postTotal: 2, //寄送总数
        pagePost: 1,//寄送列表--当前显示第几页数据

        editDialogShow: false, //编辑备注的弹窗是否显示
        editMarkedOrder: {
          remark: '',
        }, //编辑备注的那个订单的信息
        dialogTitle: '', //编辑备注的弹窗标题

      }
    },
    mounted() {
      this.getOrderList();
    },
    watch: {
      radioActive(val) {
        this.searchText = '';
        if (val == '订单') {
          this.getOrderList();
        } else {
          this.getPostList();
        }
      },
      //搜索条件--订单
      queryType(val) {
        if (val == 'PRODUCT_NAME') {
          this.placeholderText = '搜索商品名';
        } else if (val == 'STUDENT_PHONE') {
          this.placeholderText = '搜索手机号';
        } else if (val == 'STUDENT_NAME') {
          this.placeholderText = '搜索学生名';
        }
        if (this.searchText != '') {
          this.searchText = '';
          this.pageOrder = 1;
          this.getOrderList();
        }
      },

      //搜索条件--寄送
      queryTypePost(val) {
        if (val == 'PRODUCT_NAME') {
          this.placeholderTextPost = '搜索商品名';
        } else if (val == 'STUDENT_NAME') {
          this.placeholderTextPost = '搜索学生名';
        }
        if (this.searchText != '') {
          this.searchText = '';
          this.pagePost = 1;
          this.getPostList();

        }
      },
    },
    methods: {

      //搜索框--订单
      searchChange() {
        this.pageOrder = 1;
        this.getOrderList();
      },

      //搜索框--寄送
      searchChangePost() {
        this.pagePost = 1;
        this.getPostList();
      },

      handleCurrentOrderChange(val) {
        this.pageOrder = val;
        this.getOrderList();
        console.log('订单 当前第几页  ', val);
      },
      handleCurrentPostChange(val) {
        this.pagePost = val;
        this.getPostList();
        console.log('寄送 当前第几页  ', val);
      },

      //获取订单列表,记忆订单维度的搜索
      getOrderList() {
        let that = this;
        let param = {
          pageNum: that.pageOrder,
          pageSize: that.pageSize,
        }; //接口参数
        let val = that.queryType; //搜索类型
        if (that.radioActive == '订单') {
          if (val == 'PRODUCT_NAME') {
            param.productName = that.searchText;
          } else if (val == 'STUDENT_PHONE') {
            param.userAccount = that.searchText;
          } else if (val == 'STUDENT_NAME') {
            param.userName = that.searchText;
          }
          that.request({
            method: 'post',
            url: '/manage/order/list_order.do',
            param: param,
            success: function (result) {
              if (result.code == 200 && result.result && result.result.infoList) {
                that.orderList = result.result.infoList;
                that.orderTotal = result.result.total;

              } else {
                that.$message.error('获取订单信息失败,' + result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取订单列表信息失败');
            }
          });
        } else {
          alert('这个方法只针对 订单 维度');
        }
      },

      //获取寄送列表,以及寄送页面的搜索
      getPostList() {
        let that = this;
        let param = {
          pageNum: that.pagePost,
          pageSize: that.pageSize,
        }; //接口参数

        let val = that.queryType; //搜索类型
        if (that.radioActive == '寄送') {
          if (val == 'PRODUCT_NAME') {
            param.productName = that.searchText;
          } else if (val == 'STUDENT_NAME') {
            param.userName = that.searchText;
          }
          that.request({
            method: 'post',
            url: '/manage/order/list_send.do',
            param: param,
            success: function (result) {
              if (result.code == 200 && result.result && result.result.infoList) {
                that.postList = result.result.infoList;
                that.postTotal = result.result.total;
              } else {
                that.$message.error('获取寄送信息失败,' + result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取寄送列表信息失败');
            }
          });
        } else {
          alert('这个方法只针对寄送啊!!')
        }
      },

      //编辑备注icon的click事件
      showEditMarked(row) {
        console.log(row, "ddd");
        let that = this;
        that.editDialogShow = true; //显示弹窗
        that.editMarkedOrder = Object.assign({}, row); //这里会不会出现 无法输入的问题呢???
        that.dialogTitle = row.userName + '的' + that.radioActive;
      },

      //编辑备注---保存
      submitEditMarked() {
        let that = this;
        console.log('编辑备注保存', this.editMarkedOrder);
        let param = {
          orderId: that.editMarkedOrder.id,
          remark: that.editMarkedOrder.remark
        };

        that.request({
          method: 'post',
          url: '/manage/order/remark_order.do',
          param: param,
          success: function (result) {
            if (result.code == 200) {
              if (that.radioActive == '订单') {
                that.getOrderList();
              } else {
                that.getPostList();
              }
              that.editDialogShow = false; //不显示弹窗
              that.editMarkedOrder = Object.assign({}, {remark: ''});
              that.dialogTitle = '';

            } else {
              that.$message.error('编辑备注失败,' + result.message);
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('编辑备注信息失败');
          }
        });
      },
      //编辑备注--取消编辑
      cancelEdit() {
        let that = this;
        that.editDialogShow = false; //不显示弹窗
        that.editMarkedOrder = Object.assign({}, {remark: ''});
        that.dialogTitle = '';
      },

      //标记为已寄送
      postStatusChange(row) {
        let that = this;
        that.request({
          method: 'post',
          url: '/manage/order/send_book.do',
          param: {orderId: row.id},
          success: function (result) {
            if (result.code == 200 && result.result) {
              if (that.radioActive == '寄送') {
                that.getPostList();
              } else {
                that.getOrderList();
              }
              that.$message({
                message: '标记寄送成功',
                type: 'success'
              });
            } else {
              that.$message.error('标记失败,' + result.message);
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            that.$message.error('标记寄送失败');
          }
        });
      }

    }
  }
</script>
<style scoped lang="scss">
  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
  }

  .main-organ {
    margin-top: 20px;

    /* 表格 begin */

    .dot {
      width: 8px;
      height: 8px;
      background: #FF6666;
      display: inline-block;
      border-radius: 4px;
      margin-right: 8px;
    }
    .order-payed {
      background: #35AFFF;
    }
    .order-wait {
      background: #FF6666;
    }
    .order-expired {
      background: #E0E0E0;
    }

    .post-posted {
      color: #BDBDBD;
    }

    .edit-marked, .post-wait {
      cursor: pointer;
      color: #f08d00;
    }
    /*表格 end */

    /*分页*/
    .pagination-block {
      text-align: right;
      padding-top: 10px;
    }
    .sell-price {
      color: #F08D00;
      cursor:pointer;
    }
  }
</style>
<style lang = "scss">
  /*popover  hover*/
  .popover-detail-order {
    padding: 8px;
    p {
      font-size:14px;
      color: #606060 !important;
      font-weight:400;
      line-height:22px;
      display:flex;
      margin-bottom:8px;
      span{
        flex:1;
        text-align: right;
      }
    }
    p:last-child{
      margin-bottom:0;
    }
    .sell-price {
      color: #F08D00!important;
    }
  }

</style>
