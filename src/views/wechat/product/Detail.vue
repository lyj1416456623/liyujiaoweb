<template>
    <!--<div>商品详情页面</div>-->
  <div class="wechat-product">
    <div class="weui-loadmore" v-if="pageLoading" style="margin-top:0;padding-top:10px">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div v-else>
      <div class="product-main">

        <div class="banner-box">
          <img :src="productData.productImgUrl" alt="" style="width: 100%;">
        </div>

        <div class="detail-box">
          <div class="product-card-top">
            <h4 class="product-title"><span class="course-quarter" :class="'ziyue-'+productData.courseQuarter">{{productData.courseQuarterCh}}</span>{{productData.productName}}</h4>
            <!--<p class="product-time">3月03日～4月24日·周一·14:00～16:00</p>-->
            <p class="product-time">{{ productData.beginDay | formatDateFilter }}～{{ productData.endDay | formatDateFilter }}·{{productData.classRuleCh}}·{{ productData.beginTime | formatTimeFilter }}～{{ productData.endTime | formatTimeFilter }}</p>
          </div>
          <div class="product-card-pay">
            <span class="price">¥ {{productData.price/100}}</span> <span class="notice" v-show="productData.countOfResidueProduct<=2">仅剩 {{productData.countOfResidueProduct}} 个名额</span>
          </div>
          <div class="product-card-teacher">
            <h4 class="teacher-label">授课老师：</h4>
            <div class="teacher-info">
              <img :src="productData.avatar" alt="">
              {{productData.nickName}}
            </div>
          </div>
        </div>

        <div class="desc-box">
          <img :src="productData.descriptionImgUrl" alt="" style="width: 100%;display: block;">
        </div>

      </div>
      <template v-if="productData.ifHasPurchased">
        <!--当前用户已经购买过这个商品-->
        <div class="detail-footer footer-purchased">已报名</div>
      </template>
      <template v-else>
        <div class="detail-footer" @click="joinNowFun">立即报名</div>
      </template>
    </div>

    <div class="go-top" v-show="goTopShow" @click="goTopFun">
      <i class="iconfont icon-zhankai top-icon"></i><span class="top-txt">返回顶部</span>
    </div>
  </div>
</template>

<script>
    import {dateFormate} from '../../../lib/dateformate'
    import {hourFormate} from '../../../lib/timeformate'

    export default{
      name: '',
      props: [],
      components: {},
      data(){
        return {
          productId:'',
          productData:{
          }, //商品信息(年级,名称,上课日期,上课时间,老师头像名字,价格,库存额度)

          scrollTop:'', //当前滚动的高度
          goTopShow: false, //返回顶部 是否显示

          pageLoading:true,

        }
      },
      mounted() {
        console.log('一屏目的高度是  ',document.documentElement.clientHeight);

        let paramPage = this.$route.params;
        if(paramPage.id){
          this.productId = parseInt(paramPage.id);
          window.addEventListener('scroll', this.handleScroll);

          this.getProductDetail();
        }else{
          this.$router.replace('/productList');
        }

        if(localStorage) {
          localStorage.removeItem('zyCheckedCoupon'); //清除 确认支付页面选择的优惠券的缓存
        }
      },

      watch: {},
      methods: {

        //获取售卖的商品信息
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

        //页面滚动监测
        handleScroll () {
          this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          let screenHide = document.documentElement.clientHeight * 2; //滚动超过两屏的高度就显示'返回顶部'
          if (this.scrollTop > screenHide) {
            this.goTopShow = true;
          }else{
            this.goTopShow = false;
          }
        },

        //返回顶部
        goTopFun(){
          let timer = null, _that = this;
          cancelAnimationFrame(timer)
          timer = requestAnimationFrame(function fn() {
            if (_that.scrollTop > 0) {
              _that.scrollTop -= 50;
              document.body.scrollTop = document.documentElement.scrollTop = _that.scrollTop;
              timer = requestAnimationFrame(fn)
            } else {
              cancelAnimationFrame(timer);
              _that.goTopShow = false;
            }
          })
        },

        //立即报名
        joinNowFun(){
          let that = this;
          window.location.href='/confirmOrder/'+that.productId; //ios下用vue的router.push地址不会改变
//          that.$router.push('/confirmOrder/'+that.productId);
        }

      },
      destroyed(){
        window.removeEventListener('scroll', this.handleScroll)
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
.wechat-product{
  .product-main{
    padding-bottom:56px;

    .banner-box,.desc-box{
      background: #fff;
    }
  }
  .detail-box{
    padding:16px 16px 32px 16px;
    background: #fff;

    .product-card-top{
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
      .product-time{
        font-size:12px;
        color:#606060;
        line-height:20px;
        margin:4px 0 12px;
      }

    }
    .product-card-pay{
      padding-bottom:15px;
      .price{
        font-size:16px;
        color:#ff6666;
        line-height: 1;
        padding:4px 0;
        display: inline-block;
        margin-right:28px;
      }
      .notice{
        font-size:12px;
        color:#ff6666;
        line-height: 1;
        padding:4px;
        background:rgba(255,102,102,0.12);
        border-radius:2px;
      }
    }
    .product-card-teacher{
      border-top:1px solid #f5f5f5;
      padding:15px 0 0;
      .teacher-label{
        font-size:16px;
        color:#222;
        font-weight: bold;

      }
      .teacher-info{
        padding-top:12px;
        display: flex;
        align-items: center;
        font-size:14px;
        color:#222;
        line-height:20px;
        img{
          width:32px;
          height:32px;
          border-radius: 100%;
          margin-right:8px;
          display:block;
        }
      }
    }

  }
  .detail-footer{
    position: fixed;
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
  .footer-purchased{
    background:#FCE4C2;
    box-shadow:0px -1px 4px 0px rgba(0,0,0,0.08);
  }
  .go-top{
    width:114px;
    height:36px;
    line-height: 34px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 6px 0px rgba(240,141,0,0.24);
    border-radius:4px;
    display: inline-block;
    text-align: center;

    position: fixed;
    right:16px;
    bottom:64px;

    .top-icon{
      color:#F08D00;
      font-size:18px;
    }
    .top-txt{
      color:#F08D00;
      font-size:16px;
      padding-left:4px;
    }
  }

}
</style>
<style lang="scss">

</style>
