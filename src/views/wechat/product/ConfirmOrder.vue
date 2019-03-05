<template>
    <!--<div>确认订单</div>-->
  <div class="confirm-box">
    <div class="weui-loadmore" v-if="pageLoading" style="margin-top:0;padding-top:10px">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div v-else>
      <div class="confirm-main">
        <div class="add-notice" v-show="ifEmptyAddressFlag">填写收货地址才能购买哦！</div>
        <div class="order-info">
          <div class="address-box order-common-box">
            <div class="order-label">教材寄送地址</div>
            <div class="address-main" @click="chooseAddressFun">
              <img class="address-img" src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/dizhi.png" alt="">
              <div class="address-detail">
                <template v-if="addressId==0">
                  <div class="address-none-tip">请填写收货地址</div>
                </template>
                <template v-else>
                  <div class="address-people">{{localAddressInfo.consignee}} {{localAddressInfo.consigneeAccount}}</div>
                  <div class="address-text">{{localAddressInfo.area.join("")}} {{localAddressInfo.address}}</div>
                </template>
              </div>
              <i class="iconfont icon-right_m arrow-img"></i>
            </div>

          </div>
          <div class="product-box order-common-box">
            <div class="order-label">课程信息</div>
            <div class="product-main">
              <div class="product-text">
                <p class="product-name">{{productData.productName}}</p>
                <p class="product-time">
                  {{ productData.beginDay | formatDateFilter }}～{{ productData.endDay | formatDateFilter }}·{{productData.classRuleCh}}·{{ productData.beginTime | formatTimeFilter }}～{{ productData.endTime | formatTimeFilter }}
                  <!--3月03日～4月24日·周一·14:00～16:00-->
                </p>
                <p class="product-teacher">{{productData.nickName}}老师</p>
              </div>
              <div class="product-price">¥ {{productData.price/100}}</div>
            </div>
          </div>
          <div class="pay-discount-box order-common-box">
            <div class="order-label">付款信息</div>
            <div class="discount-main">
              <div class="discount-detail">
                <div class="title">优惠券</div>
                <template v-if="couponList.length<1">
                  <div class="slt-discount " @click="showDiscountDialogFun">
                    无可用优惠券<i class="iconfont icon-right_m"></i>
                  </div>
                </template>
                <template v-else>
                  <div class="slt-discount " @click="showDiscountDialogFun">
                    <template v-if="couponId==0">请选择优惠券</template>
                    <template v-else>
                      <span class="minus">- ¥ {{couponPrice/100}}</span>
                    </template>
                    <i class="iconfont icon-right_m"></i>
                  </div>
                </template>
              </div>
              <div class="discount-after">
                <span class="pay-label">需支付：</span><span class="pay-price">¥ {{(productData.price-couponPrice)<=1?'0.01':(productData.price-couponPrice)/100}}</span>
              </div>
            </div>
          </div>
          <!--朋友代付,这次不做

          <div class="replace-box order-common-box">
            <div class="replace-main">
              <div class="replace-label">朋友代付</div>
              <i class="iconfont icon-right_m replace-icon"></i>
            </div>
          </div>
          -->
        </div>
      </div>
      <div class="confirm-footer" @click="confirmPayFun">
        确认支付
      </div>

    </div>

    <div class="dialog-discount-list" :style="{display:dialogFlag?'block':'none'}">
      <div class="dialog-mask" @click="closeDialogFun"></div>
      <div class="dialog-main">
        <div class="dialog-head">
          <h4 class="d-title">优惠券</h4>
          <i class="iconfont icon-guano d-close" @click="closeDialogFun"></i>
        </div>
        <div class="discount-list">
          <div class="area-item " :class="ifCouponNotUse?'area-check':''" @click="selectCouponFun(0)">
            <div class="area_left">
              不使用优惠劵
            </div>
            <div class="area_right">
              <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
            </div>
          </div>
          <template v-if="couponList.length>0">
          <div class="discount-label">可用优惠券</div>

            <div class="area-item area-item-discount area-item-able" :class="item.check?'area-check':''"
                 v-for="(item,idx) in couponList" :key="'cou'+idx" @click="selectCouponFun(item.id,idx)">
              <div class="area_img">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiq.png" alt="">
              </div>
              <div class="area_left">
                <div class="area-price">¥ <span class="price-large">{{item.price/100}}</span></div>
                <div class="area-title">{{item.couponName}}</div>
              </div>
              <div class="area_right">
                <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
              </div>
            </div>
          <!--
            <div class="area-item area-item-discount area-item-able">
              <div class="area_img">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiq.png" alt="">
              </div>
              <div class="area_left">
                <div class="area-price">¥ <span class="price-large">500</span></div>
                <div class="area-title">优惠券名称 ........优惠券面那个车名称</div>
              </div>
              <div class="area_right">
                <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
              </div>
            </div>
            -->

            <!--
            <div class="discount-label">不可用优惠券</div>
            <div class="area-item area-item-discount">
              <div class="area_img">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiqdis.png" alt="">
              </div>
              <div class="area_left">
                <div class="area-price">¥ <span class="price-large">500</span></div>
                <div class="area-title">优惠券名称 ........优惠券面那个车名称</div>
              </div>
              <div class="area_right">
                <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
              </div>
            </div>
            <div class="discount-disabled-tip">不可用原因:不适合这个商品</div>

            <div class="area-item area-item-discount">
              <div class="area_img">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiqdis.png" alt="">
              </div>
              <div class="area_left">
                <div class="area-price">¥ <span class="price-large">500</span></div>
                <div class="area-title">优惠券名称 ..</div>
              </div>
              <div class="area_right">
                <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
              </div>
            </div>
            <div class="discount-disabled-tip">不可用原因:不适合这个商品</div>
            <div style="height: 16px;">&nbsp;</div>
            -->

          </template>
          <template v-if="couponListDisabledPrice.length>0">
            <div class="discount-label">不可用优惠券</div>
            <template v-for="item in couponListDisabledPrice">
              <div class="area-item area-item-discount" :key="'dis-c-p'+item.id">
                <div class="area_img">
                  <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiqdis.png" alt="">
                </div>
                <div class="area_left">
                  <div class="area-price">¥ <span class="price-large">{{item.price/100}}</span></div>
                  <div class="area-title">{{item.couponName}}</div>
                </div>
                <div class="area_right">
                  <span class="box-icon"><i class="iconfont icon-right chk-discount-icon"></i></span>
                </div>
              </div>
              <div class="discount-disabled-tip">不可用原因:优惠券金额不能大于课程价格</div>
            </template>
            <div style="height: 16px;">&nbsp;</div>

          </template>
          <template v-if="couponList<=0 && couponListDisabledPrice<=0">
            <div class="discount-none">
              <div class="none-img">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/youhuiqdis.png" alt="">
              </div>
              <p class="none-text">你没有优惠券可用哦！</p>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {dateFormate} from '../../../lib/dateformate'
  import {hourFormate} from '../../../lib/timeformate'
  import wx from 'weixin-js-sdk'
  import {hideShare} from '../../../lib/hidesharemenu'
  hideShare();

    export default{
      name: '',
      props: [],
      components: {},
      data(){
        return {
          productId:'',
          productData:{}, //商品信息

          addressId:0, //选择的收货地址id,从 localAddressInfo中得到
          localAddressInfo:{}, //用户选择的收货地址信息
          addressList:[], //当前用户的收货地址列表

          couponId:0, //选择的优惠券的id
          couponPrice:0, //选择的优惠券对应的价格(单位:分)
          ifCouponNotUse:true, //不使用优惠券--默认选中。当选择了其他优惠券的时候,这个就false

          couponList:[], //可用的优惠券列表
          couponListDisabledPrice:[], //不可用的优惠券列表(原因:优惠券金额≥商品价格)

          dialogFlag : false, //选择优惠券的dialog 是否显示,默认不显示
          ifEmptyAddressFlag:false, //空地址时的提示div 是否显示

          pageLoading:true,
        }
      },
      mounted(){
        document.title='确认订单';
        this.getDefaultAddress(); //获取默认收货地址
        let paramPage = this.$route.params;
        if(paramPage.id){
          this.productId = parseInt(paramPage.id);
          this.getProductDetail(); //获取商品详情 和 用户的优惠券列表

        }else{
          this.$router.replace('/productList');
        }

        if(localStorage && localStorage.getItem('zyCheckedCoupon')) {
          let tmpStorageCoupon = JSON.parse(localStorage.getItem('zyCheckedCoupon'));
          this.couponId = tmpStorageCoupon.id;
          this.couponPrice = tmpStorageCoupon.price;
          if(tmpStorageCoupon.id != 0 ){

          }
        }
      },
      watch: {},
      methods: {

        // 获取售卖的商品信息
        getProductDetail(){
          let that = this;
          let param = {
            productId: that.productId
          };
          that.request({
            method: 'post',
            url: '/product/student/get_product_info.do',
            param: param,
            success: function (result) {
              if (result.code == 200 && result.result) {
                let tmpProductData = result.result;
                if(!tmpProductData.avatar){
                  tmpProductData.avatar = '//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png';
                }

                that.productData = Object.assign({},tmpProductData);

                that.getUserCouponList(); //放在这里获取优惠券列表,是因为我要用到商品价格
                that.pageLoading = false; //数据加载出来后,不显示loading了

              }else{
                that.$message.error('获取商品失败,'+result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取商品信息失败');
            }
          });
        },

        //设置默认地址
        getDefaultAddress(){
          if(localStorage.getItem("defaultAddress")){
            var localAddress = localStorage.getItem("defaultAddress")
            this.localAddressInfo = JSON.parse(localAddress);
            console.log(this.localAddressInfo,"this.localAddress111")
            this.addressId = this.localAddressInfo.id;
            this.ifEmptyAddressFlag = false;
          }else{
            //本地没有默认的收货地址,则获取地址列表,设置第一个为默认地址
            this.getAddressList();
          }
        },

        //获取地址列表
        getAddressList(){
          console.log('获取地址列表。。。。')
          var that = this;
          that.request({
            method: 'post',
            url: '/product/order/address/get_address_list.do',
            param: {},
            success: function (result) {
              if (result.code == 200 && result.result) {
                that.addressList = result.result;
                console.log(that.localAddressInfo,"this.localAddressInfo");
                if(that.addressList.length>0){
                  that.localAddressInfo = that.addressList[0];
                  that.addressId = that.localAddressInfo.id;
                  if(localStorage) {
                    localStorage.setItem("defaultAddress", JSON.stringify(that.localAddressInfo));
                  }
                  this.ifEmptyAddressFlag = false;
                }
              } else {
                that.$message.error('获取地址列表失败，刷新重试。')
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取地址列表失败，刷新页面重试。')
            }
          })
        },

        //选择地址
        chooseAddressFun(){
          if(this.addressId==0){ //没有收获地址,进入添加地址页面
            this.$router.push("/addAddress/-1")
          }else {
            this.$router.push("/addressList")
          }
        },

        //获取当前用户的优惠券列表
        getUserCouponList(){
          let that = this;

          let curProductPrice = that.productData.price;
          that.request({
            method: 'post',
            url: '/product/order/list_coupon.do',
            param: {},
            success: function (result) {
              if (result.code == 200) {
                if(result.result){
                  let tmpResult = result.result;
                  let tmpList = [];
                  let tmpListDisabledPrice = []; //不可用的优惠券列表(因为价格太大)
                  tmpResult.map((item,idx)=>{
                    item.check = false;
                    if(item.price>=curProductPrice){
                      tmpListDisabledPrice.push(item);
                    }else{
                      tmpList.push(item);
                    }
                  });
                  that.couponList = JSON.parse(JSON.stringify(tmpList));
                  that.couponListDisabledPrice = JSON.parse(JSON.stringify(tmpListDisabledPrice));
                  console.log(that.couponList,'可以优惠券列表---- check 不可用列表:',that.couponListDisabledPrice)
                }
              }else{
                that.$message.error('获取优惠券失败,'+result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取优惠券列表失败');
            }
          });
        },

        //点击 优惠券,显示优惠券列表
        showDiscountDialogFun(){
          this.dialogFlag = true;
        },

        //优惠券列表 隐藏
        closeDialogFun(){
          this.dialogFlag = false;
        },

        //选择优惠券
        selectCouponFun(id,idx){
          let that = this;
          that.couponId = id;
          if(id==0){ //选择了 不使用优惠券
            that.ifCouponNotUse = true; //不使用优惠券--默认true选中。
            that.couponPrice = 0;

            that.couponList.map(item=>{
              item.check = false;
            });
          }else{ //使用优惠券
            that.ifCouponNotUse = false; //不使用优惠券--默认选中。当选择了其他优惠券的时候,这个就false

            that.couponList.map((item,cIdx)=>{
              if(cIdx==idx){
                item.check = true;
                that.couponPrice = item.price;

              }else{
                item.check = false;
              }
            });
          }

          if(localStorage){
            localStorage.setItem('zyCheckedCoupon',JSON.stringify({id:id,price:that.couponPrice}));
          }

          that.dialogFlag = false; //隐藏优惠券 选择窗
        },

        //确认支付按钮
        confirmPayFun(){
          let that = this;
          if(that.addressId == 0){ //没有收获地址,显示提示内容
            that.ifEmptyAddressFlag = true;
            return false;
          }else{
            that.ifEmptyAddressFlag = false;
          }
          that.request({
            method: 'post',
            url: '/product/order/get_prepay_info.do',
            param: {
              productId:that.productId,
              addressId:that.addressId,
              couponId:that.couponId
            },
            success: function (result) {
              console.log(result);
              if (result.code == 200) {
                  WeixinJSBridge.invoke('getBrandWCPayRequest',result.result,function (res) {
                    console.log('getBrandWCPayRequest');
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                      //支付成功 微信团队郑重提示 res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠
                      if(localStorage) {
                        localStorage.removeItem('zyCheckedCoupon'); //付款成功则清除掉优惠券的缓存
                      }
                      that.$router.push('/orderSuccess');
                    }else{
                      //支付失败(取消支付,或者其他原因未付款成功)
                      if(result.result.outTradeNo) {
                        let cancelParam = {outTradeNo: result.result.outTradeNo}
                        that.request({
                          method: 'post',
                          url: '/product/order/enable_use_coupon.do',
                          param: cancelParam,
                          success: function (cancelRes) {

                          }, error: function (cancelErr) {

                          }
                        });
                      }
                    }
                  });
              }else{
                that.$message.error('获取支付信息失败,'+result.message);
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              that.$message.error('获取支付信息失败');
            }
          });


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
<style lang="scss" scoped>
.confirm-box{
  min-height: 100%;
  background:#fff;
  .confirm-main{
    padding-bottom:56px;
    .add-notice{
      font-size:14px;
      color:#ff6666;
      line-height: 20px;
      background:rgba(255,55,55,0.16);
      padding:10px 16px;
    }
    .order-info{
      padding:0 16px;
      .order-label{
        font-size:12px;
        color:#BDBDBD;
        line-height: 20px;
        padding-bottom:8px;
      }
      .order-common-box{
        padding:16px 0;
        border-bottom:1px solid #eee;
      }
      .address-box{
        .address-main{
          display: flex;
          display: -webkit-flex;
          align-items: center;

          .address-img{
            width: 32px;
            height: 32px;
          }
          .address-detail{
            flex: 1;
            -webkit-flex:1;
            padding-left:16px;
            .address-none-tip{
              font-size:14px;
              color:#f08d00;
              line-height: 22px;
              font-weight: normal;
            }
            .address-people{
              font-size:14px;
              color:#222;
              line-height: 22px;
              padding-bottom: 4px;
            }
            .address-text{
              font-size:12px;
              color:#bdbdbd;
              line-height: 20px;
            }
          }
          .arrow-img{
            width: 24px;
            height: 24px;
            color:#606060;
            font-size:16px;
            text-align: right;
          }

        }
      } /* address-box*/
      .product-box{
        .product-main{
          display: flex;
          display: -webkit-flex;
          align-items: flex-start;

          .product-text{
            flex:1;
            -webkit-flex:1;

            .product-name{
              font-size:14px;
              font-weight: normal;
              line-height: 24px;
              color: #222;
              font-weight:500;
            }
            .product-time,.product-teacher{
              font-size:12px;
              font-weight: normal;
              line-height: 20px;
              color: #606060;
              padding-top: 4px;
            }
          }
          .product-price{
            text-align: right;
            font-size:14px;
            font-weight: bold;
            line-height: 24px;
            color: #222;
          }
        }

      }/* product-box */
      .pay-discount-box{
        .discount-main{

          .discount-detail{
            display: flex;
            display: -webkit-flex;
            align-items:center;
            .title{
              flex: 1;
              font-size:14px;
              color:#222;
              font-weight: normal;
              line-height: 24px;
            }
            .slt-discount{
              flex:1;
              font-size:14px;
              color:#BDBDBD;
              font-weight: normal;
              line-height: 24px;
              text-align: right;

              .minus{
                font-size:14px;
                color:#FF6666;
                font-weight: normal;
                line-height: 22px;
              }
            }

          }
          .discount-after{
            text-align: right;
            padding-top:16px;

            .pay-label{
              font-size:16px;
              color:#222;
              font-weight: bold;
              line-height: 24px;
            }
            .pay-price{
              font-size:16px;
              color:#FF6666;
              font-weight: bold;
              line-height: 24px;
            }
          }
        }

      }/* pay-discount-box */

      .replace-box{
        .replace-main{
          display: flex;
          display: -webkit-flex;
          align-items: center;

          .replace-label{
            font-size:14px;
            color:#606060;
            font-weight: normal;
            line-height: 22px;
            flex: 1;
            -webkit-flex:1;
          }
          .replace-icon{
            width: 32px;
            text-align: right;
            font-size:16px;
            color:#606060;
          }
        }

      }/* replace-box */

    } /* end order-info*/
  }
  .confirm-footer{
    position: fixed;
    z-index: 100;
    bottom:0;
    left:0;
    right:0;
    height:56px;
    background:rgba(240,141,0,1);
    box-shadow:0px -1px 4px 0px rgba(0,0,0,0.08);

    line-height: 56px;
    font-size:20px;
    color:#fff;
    text-align: center;

  }
  .dialog-discount-list{
    display: none;
    -webkit-transform: none;
    transform: none;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;

    position: fixed;
    z-index: 101;
    top:0;
    bottom:0;
    left:0;
    right:0;

    .dialog-mask{
      position: fixed;
      z-index: 102;
      top:0;
      bottom:0;
      left:0;
      right:0;
      background: rgba(0,0,0,.6);
    }
    .dialog-main{
      position: fixed;
      z-index: 105;
      /*top:156px;*/
      left:0;
      right:0;
      bottom:0;
      background: #fff;

      .dialog-head{
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
        display:flex;

        .d-title{
          font-size:16px;
          font-weight: bold;
          color:#222;
          line-height: 24px;
          flex: 1;
        }
        .d-close{
          font-size:16px;
          color:#bdbdbd;
          font-weight: 500;
          width: 20px;
        }

      }
      .discount-list{
        height: 356px;
        overflow-y: auto;
        padding:16px;
        .discount-disabled-tip{
          font-size:12px;
          color:#bdbdbd;;
          line-height: 20px;
          font-weight: normal;
          margin:-10px 0 10px 0;
        }
        .area-item{
          background: #fff;
          box-shadow:0px 2px 6px 0px rgba(0,0,0,0.08);
          padding:10px 10px 10px 16px;
          -ms-flex-align: center;
          -webkit-align-items: center;
          -webkit-box-align: center;
          align-items: center;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          position: relative;
          margin-bottom:16px;

          .area_img{
            width:56px;
            margin-right:16px;
            img{
              width: 40px;
              margin: 0 auto;
              padding:8px;
            }
          }

          .area_left{
            -ms-flex: 1;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
            font-size:16px;
            color:#606060;
            line-height: 22px;

            .area-price{
              font-size:16px;
              color:#bdbdbd;
              line-height: 22px;
              padding-bottom:6px;
              .price-large{
                font-size:28px;
                font-weight: bold;
              }
            }
            .area-title{
              font-size:14px;
              color:#e0e0e0;
            }

          }
          .area_right{
            width: 45px;
            text-align: right;
            .box-icon{
              width: 20px;
              height: 20px;
              border-radius: 100%;
              background: #eee;
              display:inline-block;
              line-height:20px;
              text-align:center;

              .chk-discount-icon{
                font-size:14px;
                color: #fff;
              }
            }
          }

        }/* area-item */
        .area-item.area-check{
          .area_right{
            .box-icon{
              background: #FDF1E0;
              .chk-discount-icon{
                color:#f08d00;
              }
            }
          }
        }/* area-item.area-check*/
        .area-item.area-item-able{
          .area_left{
            .area-price{
              color:#f08d00;

              .price-large{
                color:#f08d00;
              }
            }
            .area-title{
              color:#606060;
            }
          }
        }/* area-item.area-item-able */
        .area-item-discount{
          padding:16px 10px 10px 16px;
        }

        .discount-label{
          font-size:12px;
          color:#bdbdbd;
          line-height: 20px;
          padding:0 0 8px;
        }
        .discount-none{
          padding:16px;
          text-align:center;
          .none-img{
            img{
              padding:6px;
              width:60px;
              height: 60px;
            }

          }
          .none-text{
            font-size:14px;
            color:#e0e0e0;
            line-height: 20px;
          }
        }

      }
    }

  }

}
</style>
