<template>
  <div class="xi-container">
    <section class="ziyue-page-content">
      <div class="address-add" id="address-add">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">收货人</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" v-model="addressForm.consignee">
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">手机号码</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" v-model="addressForm.consigneeAccount">
          </div>
        </div>
        <div class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><label class="weui-label">所在地区</label></div>
          <div class="weui-cell__bd" @click="addressPickerShow = true">{{addressForm.area | pickerValueFilter}}</div>
          <div class="weui-cell__ft" @click="addressPickerShow = true"></div>
        </div>
        <div class="weui-cell address-last">
          <div class="weui-cell__hd"><label class="weui-label">详细地址</label></div>
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" rows="3" v-model="addressForm.address"></textarea>
          </div>
        </div>
        <p class="tip"><span>*</span>为了保证教材能及时送达，请填写详细的街道、门牌号信息</p>
      </div>
    </section>
    <div class="add-address" @click="saveAddress">保存</div>
    <wv-picker
      :visible.sync="addressPickerShow"
      v-model="address"
      ref="addressPicker"
      :columns="addressColumns"
      :visible-item-count="5"
      @change="onAddressChange"
      @confirm="confirmAddress"
    />
  </div>
</template>

<script>
  import chinaAreaData from 'china-area-data'
  import { TopTips,Toast } from 'we-vue'
  import {hideShare} from '../../../lib/hidesharemenu'
  hideShare();
  const provinces = Object.values(chinaAreaData[86])
  // 获取某一省下的市
  const getCities = (province) => {
    let provinceCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }
    return typeof chinaAreaData[provinceCode] === 'object' ? Object.values(chinaAreaData[provinceCode]) : []
  }

  // 获取某一市下的区/县
  function getAreas(province, city) {
    let provinceCode, cityCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }
    for (let i in chinaAreaData[provinceCode]) {
      if (city === chinaAreaData[provinceCode][i]) {
        cityCode = i
        break
      }
    }
    if (chinaAreaData[cityCode]) {
      return typeof chinaAreaData[cityCode] === 'object' ? Object.values(chinaAreaData[cityCode]) : []
    } else {
      // 只有两级的情况
      return []
    }
  }

  export default {
    name: "AddAddress",
    data() {
      return {
        addressPickerShow: false,
        address: [],//地区选择器里面的addrss
        addressId:'',//地址id  添加地址是-1
        addressForm:{ //地址信息
          consignee:'',//姓名
          consigneeAccount:'',//手机号
          area:[],//地区信息
          address:''//详细地址
        },
        addressColumns: [
          {
            values: provinces
          },
          {
            values: getCities('北京市')
          },
          {
            values: getAreas('北京市', '市辖区')
          }
        ]
      }
    },
    mounted() {
      var _this = this;
      _this.addressId  = _this.$route.params.addressId;
      if(_this.addressId=='-1'){
        document.title = '添加地址';
      }else{
        document.title= '编辑地址';
        _this.getAddressData();
      }

    },
    methods: {
      //获取地址信息  编辑地址的是调用
      getAddressData(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/order/address/get_address_by_id.do',
          param: {addressId:_this.addressId},
          success: function (result) {
            console.log(result);
            if (result.code == 200&&result.result) {
              _this.addressForm = result.result;
              _this.$nextTick(() => {
                _this.$refs.addressPicker.setValues(result.result.area);
              })
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
      //改变地区选择
      onAddressChange(picker, addressValues, slotIndex) {
        console.log(addressValues, slotIndex, 1);
        if (slotIndex === 0) {
          const cities = getCities(addressValues[0])
          picker.setColumnValues(1, cities)
          picker.setColumnValues(2, getAreas(addressValues[0], cities[0]))
        } else if (slotIndex === 1) {
          picker.setColumnValues(2, getAreas(addressValues[0], addressValues[1]))
        }
      },
      //确定选择的地区   给form表单字段赋值
      confirmAddress(picker) {
        this.addressForm.area = picker.getValues();
      },
      //保存地址
      saveAddress(){
        var _this = this;
        var consigneeAccountReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if(_this.addressForm.consignee==''){
          TopTips({
            message: '请填写收货人姓名',
            duration: 2000
          })
        }else if(_this.addressForm.consigneeAccount==''){
          TopTips({
            message: '请填写收货人手机号',
            duration: 2000
          })
        }else if (!consigneeAccountReg.test(_this.addressForm.consigneeAccount)) {
          TopTips({
            message: '手机号格式错误',
            duration: 2000
          })
        }else if(_this.addressForm.area.length==0){
          TopTips({
            message: '请选择收货所在地区',
            duration: 2000
          })
        }else if(_this.addressForm.address==''){
          TopTips({
            message: '请输入详细地址',
            duration: 2000
          })
        }else{
          console.log("提交成功",_this.addressForm);
          //提交地址参数
          var data = {
            consignee:_this.addressForm.consignee, // 收货人
            consigneeAccount:_this.addressForm.consigneeAccount, // 收货人手机号码
            area:_this.addressForm.area, //  地区 类型为数组
            address:_this.addressForm.address, // 收货详细地址
          }
          var postUrl = '/product/order/address/save_address.do';
          if(_this.addressId!='-1'){
            postUrl = '/product/order/address/update_address.do';
            data.id = _this.addressId;
          }
          _this.request({
            method: 'post',
            url: postUrl,
            param: data,
            success: function (result) {
              console.log(result);
              if (result.code == 200&&result.result) {
                console.log(result.result,"收货地址");
                localStorage.setItem("defaultAddress",JSON.stringify(result.result));
                if(_this.addressId!='-1'){
                  Toast.success({
                    message:'修改成功',
                    duration:1000
                  });
                }else{
                  Toast.success({
                    message:'添加成功',
                    duration:1000
                  });
                }
                setTimeout(function(){
                  _this.$router.go(-1);
                },1000);

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
        }
      }
    },
    filters: {
      pickerValueFilter(val) {
        if (Array.isArray(val)) {
          return val.join(" ");
        } else {
          return '请选择'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .ziyue-page-content {
    background: #fff;
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
  .address-add{
    .tip{
      display:flex;
      span{
        color:#ec7373;
        font-size:16px;
        vertical-align: middle;
        margin-right:4px;
      }
      padding:16px 16px 0 16px;
      color:#bdbdbd;
      font-size:12px;
    }
  }

</style>
<style>
  .address-add .weui-cell {
    align-items: initial;
    padding: 12px 15px;
  }

  .address-add .weui-label {
    width: 80px;
    color: #606060;
  }

  #address-add .weui-input, #address-add .weui-textarea,#address-add .weui-cell__bd {
    color: #222222!important;
  }

  .address-add .weui-cell:before {
    right: 16px;
  }

  .address-last:after {
    content: " ";
    position: absolute;
    left: 16px;
    bottom: 0;
    right: 16px;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
</style>
