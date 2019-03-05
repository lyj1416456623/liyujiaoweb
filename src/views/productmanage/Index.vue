<template>
  <div class="xi-container classmanage">
    <el-header class="auth-header classmanage-header">
      <el-breadcrumb class="ziyue-breadcrumb">
        <router-link :to="{ path: '/manageIndex' }">首页</router-link>
        <span>/</span>
        <a href="javascript:void(0)" class="current-breadcrumb">商品管理</a>
      </el-breadcrumb>
      <h4 class="auth-title">商品列表</h4>
      <el-tabs class="xi-el-tabs" v-model="activeName">
        <el-tab-pane label="上架" name="upperShelf"></el-tab-pane>
        <el-tab-pane label="下架" name="downShelf"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container class="common-content">
      <el-main>
        <div class="header-tool">
          <el-button type="primary" plain @click="addProduct">添加商品</el-button>
          <template v-if="activeName=='upperShelf'">
            <div class="select-block">
              <span>搜索条件</span>：
              <el-select v-model="queryType" placeholder="请选择" style="width:92px;float:right">
                <el-option
                  v-for="item in options"
                  :key="item.queryValue"
                  :label="item.queryName"
                  :value="item.queryValue">
                </el-option>
              </el-select>
            </div>
            <el-input
              debounce
              @change="searchEmployee"
              :placeholder="placeholderText"
              v-model="searchText">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </template>
          <template v-if = "activeName=='downShelf'">
            <div class="select-block">
              <span>搜索条件</span>：
              <el-select v-model="downQueryType" placeholder="请选择" style="width:92px;float:right">
                <el-option
                  v-for="item in options"
                  :key="item.queryValue"
                  :label="item.queryName"
                  :value="item.queryValue">
                </el-option>
              </el-select>
            </div>
            <el-input
              debounce
              @change="searchEmployee"
              :placeholder="downPlaceholderText"
              v-model="downSearchText">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </template>
        </div>
        <div class="main-organ" v-show="activeName=='upperShelf'">
          <el-table :data="productTableData" style="width: 100%">
            <el-table-column label="商品名称" min-width="24%">
              <template slot-scope="scope">
                <span>{{scope.row.productName.length>16?scope.row.productName.substring(0,16)+'...':scope.row.productName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联课程/班级" min-width="28%">
              <template slot-scope="scope">
                {{scope.row.courseName}}/{{scope.row.className}}
              </template>
            </el-table-column>
            <el-table-column label="价格" min-width="12%">
              <template slot-scope="scope">
                <span>￥{{scope.row.price/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="上架状态" min-width="16%">
              <template slot-scope="scope">
                <span v-if="!scope.row.ifSellOut"><span class="dot ziyue-zaishou"></span>在售</span>
                <span v-if="scope.row.ifSellOut"><span class="dot ziyue-shouqing"></span>售罄</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <span class="course-option course-option-first" @click="copyProduct(scope.row)">复制</span>
                <!--<span class="course-option" @click="editProduct(scope.row)">编辑</span>-->
                <el-popover placement="bottom" width="280" v-model="scope.row.ifTop"
                            trigger="click">
                  <p class="popover-option"><i class="iconfont icon-warning-circle-fill"></i>你确定要下架商品吗？</p>
                  <div style="text-align: right; margin: 20px 0 0">
                    <el-button size="mini" @click="cancelTopOrUnder(scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="confirmTop(scope.row)">确定</el-button>
                  </div>
                  <span class="course-option course-option-last" slot="reference">下架</span>
                </el-popover>
              </template>
            </el-table-column>
            <div slot="empty" v-if="searchText==''">
              <p>还没有商品哦！</p>
            </div>
            <div slot="empty" v-if="searchText!=''">
              <p>没有你要找的商品哦！</p>
            </div>
          </el-table>
          <div class="block" v-if="productTotal>0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="productTotal">
            </el-pagination>
          </div>
        </div>
        <div class="main-organ" v-show="activeName=='downShelf'">
          <el-table :data="downProductTableData" style="width: 100%">
            <el-table-column label="商品名称" min-width="24%">
              <template slot-scope="scope">
                <span>{{scope.row.productName.length>16?scope.row.productName.substring(0,16)+'...':scope.row.productName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联课程/班级" min-width="28%">
              <template slot-scope="scope">
                {{scope.row.courseName}}/{{scope.row.className}}
              </template>
            </el-table-column>
            <el-table-column label="价格" min-width="12%">
              <template slot-scope="scope">
                <span>￥{{scope.row.price/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="上架状态" min-width="16%">
              <template slot-scope="scope">
                <span v-if="!scope.row.ifSellOut"><span class="dot ziyue-xiajia"></span>下架</span>
                <span v-if="scope.row.ifSellOut"><span class="dot ziyue-shouqing"></span>售罄</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template slot-scope="scope">
                <span class="course-option course-option-first" @click="copyProduct(scope.row)">复制</span>
                <span class="course-option" @click="editProduct(scope.row)">编辑</span>
                <el-popover placement="bottom" width="280" v-model="scope.row.ifTop"
                            trigger="click">
                  <p class="popover-option"><i class="iconfont icon-warning-circle-fill"></i>你确定要上架商品吗？</p>
                  <div style="text-align: right; margin: 20px 0 0">
                    <el-button size="mini" @click="cancelTopOrUnder(scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="confirmUnder(scope.row)">确定</el-button>
                  </div>
                  <span class="course-option course-option-last" slot="reference">上架</span>
                </el-popover>
              </template>
            </el-table-column>
            <div slot="empty" v-if="downSearchText==''">
              <p>还没有商品哦！</p>
            </div>
            <div slot="empty" v-if="downSearchText!=''">
              <p>没有你要找的商品哦！</p>
            </div>
          </el-table>
          <div class="block" v-if="downProductTotal>0">
            <el-pagination
              @current-change="handleDownChange"
              :current-page.sync="downPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="downProductTotal">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        activeName:"upperShelf",//上架还是下架
        searchText: '',//搜索的商品名
        downSearchText:'',//搜索下架的商品名
        productTableData: [],//商品数据
        productTotal: 0,//商品总数
        pageSize: 10,
        page: 1,
        downProductTableData: [],//商品数据
        downProductTotal: 0,//商品总数
        downPage: 1,
        //搜索条件
        options: [{
          queryValue: 'PRODUCT_NAME',
          queryName: '商品名'
        }, {
          queryValue: 'COURSE_NAME',
          queryName: '课程名'
        }, {
          queryValue: 'CLASS_NAME',
          queryName: '班级名'
        }],
        queryType:'PRODUCT_NAME',
        downQueryType:'PRODUCT_NAME',
        placeholderText:'搜索商品名',
        downPlaceholderText:'搜索商品名',
      }
    },
    mounted() {
      this.getProductData();
    },
    watch:{
      activeName(val, old) {
        this.getProductData();
      },
      queryType(val) {
        if (val == 'PRODUCT_NAME') {
          this.placeholderText = '搜索商品名';
        } else if (val == 'COURSE_NAME') {
          this.placeholderText = '搜索课程名';
        }else if(val=='CLASS_NAME'){
          this.placeholderText = '搜索班级名';
        }
        if (this.searchText != '') {
          this.searchText = '';
          this.page = 1;
          this.getProductData();
        }
      },
      downQueryType(val) {
        if (val == 'PRODUCT_NAME') {
          this.downPlaceholderText = '搜索商品名';
        } else if (val == 'COURSE_NAME') {
          this.downPlaceholderText = '搜索课程名';
        }else if(val=='CLASS_NAME'){
          this.downPlaceholderText = '搜索班级名';
        }
        if (this.downSearchText != '') {
          this.downSearchText = '';
          this.downPage = 1;
          this.getProductData();
        }
      },
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getProductData();
        console.log(`当前页: ${val}`);
      },
      handleDownChange(val){
        this.downPage = val;
        this.getProductData();
        console.log(`当前页: ${val}`);
      },
      //搜索课程
      searchEmployee() {
        var _this = this;
        if(_this.activeName=='upperShelf') {
          _this.page = 1;
        }else{
          _this.downPage = 1;
        }
        _this.getProductData();
      },
      //获取课程列表
      getProductData() {
        var _this = this;
        console.log(_this.activeName);
        if(_this.activeName=='upperShelf'){
          var data = {
            "page": _this.page,
            "rows": _this.pageSize,
            "ifUpperShelf":true,
            "courseName": _this.queryType=='COURSE_NAME'?_this.searchText:'',
            "productName":_this.queryType=='PRODUCT_NAME'?_this.searchText:'',
            "className":_this.queryType=='CLASS_NAME'?_this.searchText:'',
          }
        }else{
          var data = {
            "page": _this.downPage,
            "rows": _this.pageSize,
            "ifUpperShelf":false,
            "courseName": _this.downQueryType=='COURSE_NAME'?_this.downSearchText:'',
            "productName":_this.downQueryType=='PRODUCT_NAME'?_this.downSearchText:'',
            "className":_this.downQueryType=='CLASS_NAME'?_this.downSearchText:'',
          }
        }
        _this.request({
          method: 'post',
          url: '/product/get_product_list.do',
          param: data,
          success: function (result) {
            if (result.code == 200) {
              var data = result.result;
              if(_this.activeName=='upperShelf') {
                _this.productTableData = data.data;
                _this.productTotal = data.total;
              }else{
                _this.downProductTableData = data.data;
                _this.downProductTotal = data.total;
              }
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //添加商品
      addProduct() {
        this.$router.push("/productAdd/-1/add");
      },
      //复制商品
      copyProduct(data){
        this.$router.push('/productAdd/'+data.id+'/copy');
      },
      //编辑商品
      editProduct(data) {
        console.log(data, "商品数据单条");
        this.$router.push('/productAdd/'+data.id+'/edit');
      },
      //上架列表中的要下架
      confirmTop(data){
        console.log(data,"上架列表中的要下架");
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/upper_or_lower_shelf.do',
          param: {productId:data.id,productStatus:false},
          success: function (result) {
            if (result.code == 200&&result.result) {
              _this.$message({
                message: '下架成功',
                type: 'success'
              });
              _this.cancelTopOrUnder(data);
              _this.getProductData();
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //下架列表中的要上架
      confirmUnder(data){
        console.log(data,"下架列表中的要上架");
        var _this = this;
        _this.request({
          method: 'post',
          url: '/product/upper_or_lower_shelf.do',
          param: {productId:data.id,productStatus:true},
          success: function (result) {
            if (result.code == 200&&result.result) {
              _this.$message({
                message: '上架成功',
                type: 'success'
              });
              _this.cancelTopOrUnder(data);
              _this.getProductData();
            }
          },
          error: function (error) {
            //服务器异常
            _this.$message.error('获取课程列表错误,网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //取消上下架操作
      cancelTopOrUnder(data){
        //控制编辑的popOver是否显示
        data["ifUnder"] = false;
        data["ifTop"] = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../style/header.css";
  .classmanage-header {
    .auth-title {
      padding-bottom: 8px;
    }
  }
  .header-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input {
      width: 240px;
    }
    .select-block {
      flex: 1;
      text-align: right;
      padding-right: 8px;
      line-height: 40px;
      color: #606060;
      .wx-checkbox {
        margin-right: 24px;
      }
    }
  }
  .main-organ {
    margin-top: 20px;
    /*操作*/
    .course-option {
      padding: 0 15px;
      color: #F08D00;
      border-right: 1px solid #F0F0F0;
      cursor: pointer;
      white-space: nowrap;
    }
    .course-option-first{
      padding-left:0;
    }
    .course-option-last{
      border:0;
      padding-right:0;
    }
    .dot{
      width:8px;
      height:8px;
      background:#F08D00;
      display: inline-block;
      border-radius:4px;
      margin-right:8px;
    }
    .ziyue-zaishou{
      background:#35AFFF;
    }
    .ziyue-xiajia{
      background:#F08D00;
    }
    .ziyue-shouqing{
      background:#E0E0E0;
    }
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }
  .popover-option {
    margin-top: 10px;
    font-size: 14px;
    i {
      margin-right: 10px;
      color: #FAAD14;
    }
  }
</style>
