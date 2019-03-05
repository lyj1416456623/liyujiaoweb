<template>
  <div class="xi-container course-wechat-list">
    <div class="weui-loadmore" v-if="pageLoading" style="margin-top:0;padding-top:10px">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <section class="product-page-content" v-else>
      <template v-if="ifLogin">
        <div class="class-filter">
          <div class="class-label-block" id="classBlock" :style="{width:labelWidth+'px'}">
            <div class="class-label" v-for="item in gradeList" @click="selectGrade(item)">
              <div :class="item.value==grade?'class-label-item class-label-item-bold':'class-label-item'">{{item.label}}</div>
              <div :class="item.value==grade?'class-label-border':''"></div>
            </div>
          </div>
        </div>
        <div class="page-product" v-if="productList.length>0">
          <router-link class="product-list-block" :to="{path:'/classList/'+item.courseId}" v-for="item in productList" :key="item.courseId">
            <div class="product-card-top">
              <h4 class="product-title"><span class="course-quarter" :class="'ziyue-'+item.courseQuarterEn">{{item.courseQuarterCh}}</span>{{item.courseName}}</h4>
              <p class="product-time">{{ item.minBeginDay | formatDateFilter }}～{{ item.maxEndDay | formatDateFilter }}·{{item.productCount}}个班可选</p>
              <div class="product-teacher">
                <img :src="avatar.avatar||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png'" v-for="avatar in item.teachers">
              </div>
            </div>
            <div class="product-card-pay">
              <div class="pay-number">热报</div>
              <div class="pay-money">￥{{item.minPrice/100}}<span>起</span></div>
            </div>
          </router-link>
        </div>
        <div class="product-empty" v-if="productList.length==0">
          <p>还没有课程在售哦，等等再来吧！</p>
        </div>
      </template>
      <template v-else>
        <div class="login-title">未注册的手机号将自动注册</div>
        <div class="login-form">
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label login-label">手机号码</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入Class In 手机号"
                     v-model="loginForm.phone">
            </div>
          </div>
          <div class="weui-cell weui-cell_vcode login-code">
            <div class="weui-cell__hd">
              <label class="weui-label login-label">验证码</label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input" placeholder="输入短信验证码" v-model="loginForm.code">
            </div>
            <div class="weui-cell__ft">
              <div v-show="show" class="weui-vcode-btn" @click="getVerificationCode">获取验证码</div>
              <div v-show="!show" class="weui-vcode-btn count">请等待（{{count}})</div>
            </div>
          </div>
          <div class="weui-btn-area" style="margin-top:71px" @click="confirmLogin">
            <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">登入</a>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
  import {TopTips, Dialog, Toast} from 'we-vue'
  import {dateFormate} from '../../../lib/dateformate'

  export default {
    name: "Index",
    data() {
      return {
        productList: [1, 1, 1],//班课列表
        wrapperHeight: 0,//列表高度
        labelWidth:0,//年级长度
        productTotal: 0,//商品总数
        page: 1,//默认第一页  列表
        rows: 10,//默认一页10条
        ifLogin: true,//是否登录
        ifNotPay: false,//是否有未支付的订单
        pageLoading: true,//是否加载完数据
        loginForm: {
          phone: "",
          code: "",
        },
        show: true,//倒计时
        count: '',
        timer: null,
        grade: '',//年级 默认全部
        gradeList:[],//年级列表
      }
    },
    mounted() {
      //先判断是否已经登录过了 然后判断是否有未完成的订单，需要去支付  应该是调接口来判断
      this.getLoginStatus();
    },
    watch: {},
    methods: {
      //获取年级
      getGradeList(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/student/get_param_grade.do',
          param: {},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              _this.gradeList = result.result;
              var labelWidth = 0;
              for(var i = 0;i<_this.gradeList.length;i++){
                if(_this.gradeList[i].value=='GRADE_FOUR_FIVE'){
                  labelWidth+=28;
                }
              }
              labelWidth+=_this.gradeList.length*66+60;
              console.log(labelWidth,"labelWidth");
              _this.labelWidth = labelWidth;
              _this.gradeList.unshift({
                label:'全部',
                value:''
              })
              _this.pageLoading = false;
            } else {
              TopTips({
                message: result.message,
                duration: 2000
              })
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取登录状态
      getLoginStatus() {
        var _this = this;
        var curUrl = window.location.href;
        // _this.getGradeList();
        // //去获取商品列表
        // _this.getProductList();
        // return false;
        _this.request({
          method: 'post',
          url: '/wx/check_login.do',
          param: {},
          success: function (result) {
            if (result.code == 200 && result.result) {
              if (result.result.isWxLogin) {
                _this.ifLogin = result.result.isUserLogin;
                if (result.result.isUserLogin) {
                  _this.getGradeList();
                  //去获取商品列表
                  _this.getProductList();
                } else {
                  _this.pageLoading = false;
                }
              } else {
                window.location.href = 'http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl;
              }
            } else {
              window.location.href = 'http://wx.ziyueyuwen.com/wx?originalUrl=' + curUrl;
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取商品分组查询列表
      getProductList() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/student/get_product_group_list.do',
          param: {grade: _this.grade},
          success: function (result) {
            console.log(result);
            if (result.code == 200 && result.result) {
              _this.pageLoading = false;
              _this.productList = result.result;
            } else {
              TopTips({
                message: result.message,
                duration: 2000
              })
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //获取短信验证码
      getVerificationCode() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/send_verification_code.do',
          param: {phoneNum: _this.loginForm.phone},
          success: function (result) {
            if (result.code == 200 && result.result) {
              Toast.success('发送成功');
              const TIME_COUNT = 60;
              if (!_this.timer) {
                _this.count = TIME_COUNT;
                _this.show = false;
                _this.timer = setInterval(() => {
                  if (_this.count > 0 && _this.count <= TIME_COUNT) {
                    _this.count--;
                  } else {
                    _this.show = true;
                    clearInterval(_this.timer);
                    _this.timer = null;
                  }
                }, 1000)
              }
            }else {
              TopTips({
                message: result.message,
                duration: 2000
              })
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //登录
      confirmLogin() {
        var _this = this;
        var phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (_this.loginForm.phone == '') {
          Toast.text({
            duration: 2000,
            message: '请输入手机号'
          })
        } else if (!phoneReg.test(_this.loginForm.phone)) {
          Toast.text({
            duration: 2000,
            message: '手机号格式错误'
          })
        } else if (_this.loginForm.code == '') {
          Toast.text({
            duration: 2000,
            message: '请输入验证码'
          })
        } else {
          _this.request({
            method: 'post',
            url: '/login_by_phone_num.do',
            param: {phoneNum: _this.loginForm.phone, code: _this.loginForm.code},
            success: function (result) {
              if (result.code == 200 && result.result) {
                //登录成功获取列表接口，年级列表接口
                _this.getGradeList();
                _this.getProductList();
                _this.ifLogin = true;
              } else {
                Toast.text({
                  duration: 2000,
                  message: result.result.message
                })
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        }
      },
      //选择年级
      selectGrade(item){
        if(this.grade != item.value){
          this.grade = item.value;
          this.getProductList();
        }
      }
    },
    filters: {
      formatDateFilter(time) {
        return dateFormate(time)
      }
    }
  }
</script>
<style scoped lang="scss">
  .product-page-content{
    background:#fff;
  }
  .course-wechat-list {
    background: #fff;
    /*顶部筛选*/
    .class-filter {
      min-width: 100%;
      height: 44px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding-left: 16px;
      overflow-x: auto;
      z-index: 4;
      background: #fff;
      -webkit-overflow-scrolling: touch;
      border-bottom: 1px solid #eeeeee;
      .class-label-block {
        zoom: 1;
        height: 100%;
        min-width: 100%;
        .class-label {
          float: left;
          margin-right: 24px;
          .class-label-item {
            font-size: 14px;
            color: #222222;
            line-height: 17px;
            margin-top: 12px;
          }
          .class-label-item-bold {
            font-weight: bold;
          }
          .class-label-border {
            width: 16px;
            height: 3px;
            margin:0 auto;
            background: #F08D00;
            border-radius: 4px;
            opacity: 0.8;
            margin-top: 4px;
          }
        }
      }
      .class-label-block:after {
        clear: both;
        content: '';
        display: block;
        width: 0;
        height: 0;
        visibility: hidden;
      }

    }
    .page-product {
      background: #fff;
      position:relative;
      top:44px;
      bottom:0;
      left:0;
      right:0;
      overflow-y:auto;
      z-index:1;
      -webkit-overflow-scrolling: touch;
    }
    /*列表*/
    .product-list-block {
      margin: 16px;
      box-shadow:0px 2px 8px 0px rgba(0,0,0,0.08);
      border-radius: 4px;
      display: block;
      .product-card-top {
        padding: 16px 16px 12px 16px;
        .product-title {
          .course-quarter {
            height:20px;
            width:48px;
            display:inline-block;
            border-radius: 2px;
            font-size: 12px;
            line-height: 20px;
            color: #fff;
            margin-right: 8px;
            text-align: center;
            vertical-align: middle;
            margin-top:-3px;
          }
        }
        .product-time {
          font-size: 12px;
          color: #606060;
          line-height: 20px;
          margin: 4px 0 4px;
        }
        .product-teacher {
          font-size: 12px;
          color: #606060;
          img {
            width: 32px;
            height: 32px;
            float:left;
            margin-right: 8px;
            display: block;
            border-radius:50%;
            margin-top:8px;
          }
        }
        .product-teacher:after{
          clear: both;
          content: '';
          display: block;
          width: 0;
          height: 0;
          visibility: hidden;
        }
      }
      .product-card-pay {
        border-top: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        height: 42px;
        .pay-number {
          padding-left: 16px;
          flex: 1;
          font-size: 14px;
          color: #FF6666;
          line-height: 20px;
        }
        .pay-money {
          padding-right: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #FF6666;
          line-height: 24px;
          span{
            font-size:12px;
            color:#FF6666;
            margin-left:4px;
          }
        }
        .pay-number-red {
          color: #FF6666;
        }
      }
    }
    /* 列表为空情况 */
    .product-empty {
      text-align: center;
      p {
        padding: 216px 0 106px;
        font-size: 16px;
        color: #909090;
        line-height: 24px;
      }
    }
    /*登录页面*/
    .login-title {
      width: 100%;
      height: 32px;
      background: #f5f5f5;
      color: #BDBDBD;
      font-size: 12px;
      line-height: 32px;
      padding-left: 16px;
      box-sizing: border-box;
    }
    .login-form {
      .login-label {
        width: 64px;
        font-size: 14px;
      }
      .weui-input {
        font-size: 14px;
      }
      .weui-vcode-btn {
        font-size: 12px;
        color: #F08D00;
        padding: 0 9px;
        margin: 10px 0;
        height: 24px;
        line-height: 24px;
      }
      .count {
        color: #D4D4D4;
      }
    }

  }
</style>
<style>
  .course-wechat-list .weui-cells {
    margin-top: 0;
  }

  .course-wechat-list .weui-cells:before {
    border: 0;
  }

  .course-wechat-list .weui-cells:after {
    border: 0;
  }

  .login-code {
    padding-right: 16px !important;
  }

  .login-code:before {
    left: 16px;
    right: 16px;
  }

  .login-code:after {
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    content: " ";
    height: 1px;
    left: 16px;
    right: 16px;
    position: absolute;
    bottom: 0;
    transform: scaleY(.5);
    transform-origin: 0 0;
    z-index: 2;
  }
</style>
