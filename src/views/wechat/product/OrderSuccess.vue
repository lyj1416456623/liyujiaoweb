<template>
    <!--<div>报名成功页面</div>-->
  <div class="order-success">
    <div class="success-img-box">
      <img src="http://ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/paysuccess.png" alt="">
      <p class="success-txt">支付成功</p>
    </div>
    <div class="success-btn-list">
      <button class="btn-item btn-homepage" @click="toHomepageFun">返回首页</button>
      <span class="btn-gap">&nbsp;</span>
      <button class="btn-item btn-course-list" @click="toCourseListFun">我的课程</button>
    </div>
  </div>
</template>

<script>
  import {hideShare} from '../../../lib/hidesharemenu'
  hideShare();
    export default{
        name: '',
        props: [],
        components: {},
        data(){
            return {}
        },
        mounted(){
          document.title='支付成功';
        },
        watch: {},
        methods: {

          //返回首页
          toHomepageFun(){
            this.$router.replace('/productList');
          },

          //我的课程
          toCourseListFun(){
            this.$router.replace('/courseList');
          }
        }
    }
</script>
<style lang="scss" scoped>
.order-success{
  min-height: 100%;
  background: #fff;

  .success-img-box{
    padding:75px 0 100px;
    text-align: center;
    img{
      width: 120px;
      height: 120px;
      margin: 0 auto;
    }
    .success-txt{
      padding:8px 0;
      font-size:20px;
      font-weight: normal;
      color:#606060;
      line-height: 28px;
    }
  }

  .success-btn-list{
    padding:0 48px;

    display: flex;
    display: -webkit-flex;
    align-items: center;

    .btn-item{
      flex:1;
      border-radius: 2px;
      padding:11px 0;
      text-align: center;
      font-size:14px;
      font-weight: normal;
      line-height: 20px;
    }
    .btn-gap{
      width: 16px;
      display: inline-block;
    }
    .btn-homepage{
      background: #fff;
      border:1px solid #bdbdbd;
      color:#606060;
    }
    .btn-course-list{
      background: #fff;
      border:1px solid #F08D00;
      color:#F08D00;
    }
  }

}
</style>
