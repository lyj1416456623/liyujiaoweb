<template>
  <div class="xi-container">
    <section class="ziyue-page-content">
      <div class="address-list-block" v-if="addressList.length>0">
        <div class="address-list" v-for="item in addressList" @click="setDefauleAddress(item)">
          <div class="address-block-top">
            <div class="address-img">
              <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/dizhi.png" alt="" v-if="localAddress.id && localAddress.id == item.id">
              <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/dizhidis.png" alt="" v-else>
            </div>
            <div class="address-item">
              <h4>{{item.consignee}} {{item.consigneeAccount}}</h4>
              <p>{{item.area.join("")}} {{item.address}}</p>
            </div>
          </div>
          <div class="address-option">
            <div class="option-block" @click.stop="delAddress(item)">删除</div>
            <div class="option-block" @click.stop="editAddress(item)">编辑</div>
          </div>
        </div>
      </div>
      <div class="address-not" v-else>
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/product/dizhidis.png" alt="">
        <p>你还没有教材寄送地址哦，快去<router-link :to="{path:'/addAddress/-1'}" style="color:#F08D00">新建地址</router-link>吧！</p>
      </div>
    </section>
    <router-link class="add-address" :to="{path:'/addAddress/-1'}">新建地址</router-link>
  </div>
</template>

<script>
  import { Dialog,Toast } from 'we-vue'
  import {hideShare} from '../../../lib/hidesharemenu'
  hideShare();
  export default {
    name: "AddressIndex",
    data() {
      return {
        addressList:[],//地址列表数据
        localAddress:{},//本地存储的地址
      }
    },
    mounted(){
      if(localStorage.getItem("defaultAddress")){
        var localAddress = localStorage.getItem("defaultAddress")
        this.localAddress = JSON.parse(localAddress);
        console.log(this.localAddress,"this.localAddress111")
      }
      this.getAddressList();
    },
    methods:{
      //获取地址列表
      getAddressList(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/order/address/get_address_list.do',
          param: {},
          success: function (result) {
            if (result.code == 200 && result.result) {
              _this.addressList = result.result;
              console.log(_this.localAddress,"this.localAddress");
              if(_this.addressList.length>0 && !_this.localAddress.id){
                _this.localAddress = _this.addressList[0];
                localStorage.setItem("defaultAddress",JSON.stringify(_this.addressList[0]));
              }
            } else {
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //设置默认地址
      setDefauleAddress(data){
        console.log(data);
        localStorage.setItem("defaultAddress",JSON.stringify(data));
        this.$router.go(-1);
      },
      //删除地址
      delAddress(data){
        console.log(data);
        var _this = this;
        Dialog.confirm({
          title: '',
          message: '确定要删除这个收货地址嘛？',
          showCancelButton: true
        }).then(() => {
          _this.request({
            method: 'post',
            url: '/product/order/address/delete_address.do',
            param: {addressId:data.id},
            success: function (result) {
              if (result.code == 200 && result.result) {
                Toast.success({
                  message:'删除成功',
                  duration:1000
                });
                if(data.id == _this.localAddress.id){
                  localStorage.removeItem("defaultAddress");
                }
                _this.getAddressList();
              } else {
                _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
              }
            },
            error: function (error) {
              //服务器异常
              console.log(error);
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
            }
          })
        }).catch(() => {

        })
      },
      //编辑地址
      editAddress(data){
        console.log(data);
        this.$router.push("/addAddress/"+data.id);
      }
    }
  }
</script>

<style scoped lang="scss">
  .ziyue-page-content{
    background:#f5f5f5;
    padding-bottom:56px;
  }
  .add-address{
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:56px;
    line-height: 56px;
    text-align: center;
    background:#F08D00;
    color:#fff;
    font-size:20px;
  }
  .address-list {
    padding: 16px 16px 0 16px;
    background: #fff;
    margin-bottom:16px;
    .address-block-top {
      padding-bottom:24px;
      display: flex;
      align-items: center;
      border-bottom:1px solid #e0e0e0;
      .address-img {
        width: 32px;
        height: 32px;
        margin-right:15px;
        img {
          width: 32px;
          height: 32px;
          display:block;
        }
      }
      .address-item {
        h4{
          font-size:14px;
          font-weight:400;
          color:#222222;
          line-height:22px;
        }
        p{
          font-size:12px;
          color:#BDBDBD;
          line-height:20px;
          margin-top:4px;
        }
      }
    }
    .address-option{
      height:35px;
      .option-block{
        width:48px;
        height:20px;
        background:#F5F5F5;
        border-radius:2px;
        float:right;
        line-height:20px;
        text-align: center;
        font-size:12px;
        color:#606060;
        margin-left:8px;
        margin-top:7px;
      }
    }
  }
  /*没有收货地址的时候*/
  .address-not{
    img{
      width:120px;
      height:120px;
      display:block;
      margin:92px auto 24px;
    }
    p{
      text-align: center;
      font-size:14px;
    }
  }


</style>
