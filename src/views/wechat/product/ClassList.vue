<template>
  <div class="xi-container product-list">
    <section class="ziyue-page-content" v-if="!pageLoading">
      <div class="top-filter">
        <span :class="[dateRotate?'light-span':'']" @click="jumpDateRotate">{{soltDateName!=''?soltDateName:'日期'}}<i class="iconfont"
                                                              :class="[dateRotate?'icon-zhankai':'icon-shouqi']"></i></span>
        <span :class="[timeRotate?'light-span':'']" @click="jumpTimeRotate">{{soltTimeName!=''?soltTimeName:'时间'}}<i class="iconfont" :class="[timeRotate?'icon-zhankai':'icon-shouqi']"></i></span>
      </div>
      <div class="date-block-box" v-show="dateRotate">
        <div class="date-block-mask" @click="jumpDateRotate"></div>
        <transition name="drop-down">
          <div class="date-block">
            <div class="weui-cells weui-cells_radio">
              <label class="weui-cell weui-check__label" :for="'date'+item.value" v-for="item in dateList">
                <div class="weui-cell__bd">
                  <p :class="item.value == productStageId?'radio-font radio-checked':'radio-font'">{{item.label}}</p>
                </div>
                <div class="weui-cell__ft">
                  <input type="radio" class="weui-check" name="dateRadio" :id="'date'+item.value" :value="item.value" v-model="productStageId">
                  <span class="weui-icon-checked"></span>
                </div>
              </label>
            </div>
          </div>
        </transition>
      </div>
      <div class="date-block-box" v-show="timeRotate">
        <div class="date-block-mask" @click="jumpTimeRotate"></div>
        <transition name="drop-down">
          <div class="date-block">
            <div class="weui-cells weui-cells_radio">
              <label class="weui-cell weui-check__label" :for="'time'+item.value" v-for="item in timeList">
                <div class="weui-cell__bd">
                  <p :class="item.value==period?'radio-font radio-checked':'radio-font'">{{item.label}}</p>
                </div>
                <div class="weui-cell__ft">
                  <input type="radio" class="weui-check" name="timeRadio" :id="'time'+item.value" :value="item.value" v-model="period">
                  <span class="weui-icon-checked"></span>
                </div>
              </label>
            </div>
          </div>
        </transition>
      </div>
      <div class="page-infinite-wrapper" ref="wrapper"
           v-if="productList.length>0">
        <wv-group
          v-infinite-scroll="loadMoreProduct"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="50"
        >
          <router-link class="product-list-block" :to="{path:'/productDetail/'+item.id}" v-for="item in productList" :key="item.id">
            <div class="product-card-top">
              <h4 class="product-title"><span class="course-quarter" :class="'ziyue-'+item.courseQuarter">{{item.courseQuarterCh}}</span>{{item.productName}}</h4>
              <p class="product-time">{{ item.beginDay | formatDateFilter }}～{{ item.endDay | formatDateFilter }}·{{item.classRuleCh}}·{{ item.beginTime | formatTimeFilter }}～{{ item.endTime | formatTimeFilter }}</p>
              <div class="product-teacher">
                <img :src="item.avatar||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png'" alt="">
                {{item.nickName}}
              </div>
            </div>
            <div class="product-card-pay">
              <div class="pay-number" v-if="item.countOfResidueProduct"><span v-if="Number(item.countOfResidueProduct)>2">热报</span><span v-else>仅剩 {{item.countOfResidueProduct}} 个名额</span></div>
              <div class="pay-number" v-else></div>
              <div class="pay-money">￥{{item.price/100}}</div>
            </div>
          </router-link>
        </wv-group>
        <p v-show="loading" class="loading-tips">
          <wv-spinner type="snake" color="#444" :size="24"/>
        </p>
      </div>
      <div class="product-empty" v-if="productList.length==0">
        <p>还没有可以购买的商品哦~</p>
      </div>
    </section>
    <div class="weui-loadmore" v-if="pageLoading" style="margin-top:0;padding-top:10px">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
  </div>
</template>

<script>
  import {TopTips, Dialog, Toast} from 'we-vue'
  import {dateFormate} from '../../../lib/dateformate'
  import {hourFormate} from '../../../lib/timeformate'
  import {hideShare} from '../../../lib/hidesharemenu'
  hideShare();
  export default {
    name: "Index",
    data() {
      return {
        productList: [],//班课列表
        loading: false,//加载loading
        wrapperHeight: 0,//列表高度
        productTotal: 0,//商品总数
        page: 1,//默认第一页  列表
        rows: 10,//默认一页10条
        pageLoading: true,//是否加载完数据
        dateRotate: false,//日期icon
        timeRotate:false,//时间icon
        courseId:'',//课程id
        dateList:[],//日期列表
        timeList:[],//时间列表  上午  下午  晚上
        productStageId:'',//期次id
        classRule:'',//上课规则
        period:'',//时间段  上午 下午 晚上
        paramName:'classRule',//是期还是周几
        dateListObj:{},//日期列表obj
        timeListObj:{},//时间列表obj
        soltDateName:'',//筛选 日期
        soltTimeName:'',//筛选 时间
      }
    },
    mounted() {
      this.courseId = this.$route.params.courseId;
      this.getDateList();
    },
    watch: {
      productStageId(val,oldVal){
        console.log(val,"productStageId");
        if(val!==''){
          this.soltDateName = this.dateListObj[val].label.split("(")[0];
          console.log(this.soltDateName,"soltDateName");
        }else{
          this.soltDateName=''
        }
        this.getTimeList();
        this.jumpDateRotate();
        this.page = 1;
        this.getProductList();
      },
      classRule(val,oldVal){
        console.log(val,"classRule");
        this.jumpDateRotate();
        if(val!==''){
          this.soltDateName = this.dateListObj[val].label.split("(")[0];
          console.log(this.soltDateName,"soltDateName");
        }else{
          this.soltDateName=''
        }
        this.getTimeList();
        this.page = 1;
        this.getProductList();
      },
      period(val,oldVal){
        console.log(val,"period");
        if(val!==''){
          this.soltTimeName = this.timeListObj[val].label;
          console.log(this.soltTimeName,"soltTimeName");
        }else{
          this.soltTimeName=''
        }
        this.jumpTimeRotate();
        this.page = 1;
        this.getProductList();
      }
    },
    methods: {
      //获取日期
      getDateList(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/student/get_param_date.do',
          param: {courseId:_this.courseId},
          success: function (result) {
            console.log(result);
            if (result.code == 200&&result.result) {
              var resultData = result.result;
              _this.dateList = resultData;
              if(resultData.length>0){
                _this.paramName = resultData[0].paramName;
                for(var i =0;i < resultData.length;i++){
                  _this.dateListObj[resultData[i].value]=resultData[i];
                }
              }
              _this.dateList.unshift({"value":"","label":"不限"});
              _this.getProductList();
              _this.getTimeList();
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
      //获取时间
      getTimeList(){
        var _this = this;
        var data = {
          courseId:_this.courseId
        };
        if(_this.paramName == 'classRule'){
          data.classRule = _this.classRule;
        }else{
          data.stageId = _this.productStageId;
        }
        _this.request({
          method: 'post',
          url: '/product/student/get_param_time.do',
          param: data,
          success: function (result) {
            console.log(result);
            if (result.code == 200&&result.result) {
              var resultData = result.result;
              _this.timeList = resultData;
              for(var i =0;i < resultData.length;i++){
                _this.timeListObj[resultData[i].value]=resultData[i];
              }
              _this.timeList.unshift({"value":"","label":"不限"});

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
      //获取商品列表
      getProductList() {
        var _this = this;
        var data = {
          page: _this.page,
          rows: _this.rows,
          courseId:_this.courseId,//课程id
          period:_this.period,//时间段  上午 下午 晚上
        }
        console.log(_this.paramName,"paramName");
        if(_this.paramName == 'classRule'){
          data.classRule = _this.classRule;
        }else{
          data.productStageId = _this.productStageId;
        }
        console.log(data,"Data");
        _this.request({
          method: 'post',
          url: '/product/student/get_product_list.do',
          param: data,
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                _this.loading = false;
                _this.pageLoading = false;
                var resultData = result.result;
                _this.productTotal = resultData.total;
                if(_this.page == 1){
                  _this.productList = [];
                }
                if (resultData.data.length > 0) {
                  //设置标题
                  document.title = resultData.data[0].courseQuarterCh+' '+resultData.data[0].gradeCh;;
                  for (var i = 0; i < resultData.data.length; i++) {
                    let item = resultData.data[i];
                    _this.productList.push(item);
                  }
                  console.log(_this.productList, "_this.productList");
                  _this.page++;
                }
              }
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
      //加载更多商品数据
      loadMoreProduct() {
        if (this.productList.length % this.rows == 0 && this.page > 1 && !this.loading && this.productList.length < this.productTotal) {
          this.loading = true;
          this.getProductList();
        }
      },
      //点击日期
      jumpDateRotate() {
        this.timeRotate = false;
        this.dateRotate = !this.dateRotate;
      },
      //点击时间
      jumpTimeRotate() {
        this.dateRotate = false;
        this.timeRotate = !this.timeRotate;
      },
    },
    filters: {
      formatDateFilter(time) {
        return dateFormate(time)
      },
      formatTimeFilter(time) {
        return hourFormate(time)
      },
    }
  }
</script>
<style scoped lang="scss">
  .product-list {
    background: #fff;
    /*顶部筛选*/
    .top-filter {
      width: 100%;
      height: 44px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      background: #fff;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      span {
        flex: 1;
        height: 20px;
        margin: 12px 0;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        border-right: 1px solid #eeeeee;
        .iconfont {
          font-size: 9px;
          margin-left: 6px;
        }
      }
      span:last-child {
        border: 0;
      }
      .light-span {
        color: #F08D00;
      }
    }
    .page-infinite-wrapper {
      margin-top: 40px;
    }
    /*列表*/
    .product-list-block {
      margin: 16px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
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
          margin: 4px 0 12px;
        }
        .product-teacher {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #606060;
          line-height: 20px;
          img {
            width: 32px;
            height: 32px;
            margin-right: 8px;
            display: block;
            border-radius:50%;
          }
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
          color: #ff6666;
          line-height: 20px;
        }
        .pay-money {
          padding-right: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #FF6666;
          line-height: 24px;
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
    .date-block-mask{
      position: fixed;
      top: 45px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      background: rgba(0, 0, 0, .48);
    }
    .date-block {
      position: fixed;
      top: 45px;
      left:0;
      right:0;
      z-index:3;
      .radio-font {
        font-size: 14px;
        color: #606060;
      }
      .radio-checked {
        color: #F08D00;
      }
    }
  }

  /*过渡动画*/
  .drop-down-enter,
  .drop-down-leave-active {
    transform: translateX(130px);
  }

  .drop-down-leave-active,
  .drop-down-enter-active {
    transition: all 0.3s;
  }
</style>
<style>
  .product-list .weui-cells {
    margin-top: 0;
  }
  .product-list .weui-cells_radio .weui-cell{
    padding: 13px 15px;
  }
  .product-list .weui-cells:before, .product-list .weui-cell:before {
    border: 0;
  }

  .product-list .weui-cells:after {
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
