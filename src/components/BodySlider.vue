<template>
  <div>
    <div class="logo">
      <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/ziyuelogo.png">
    </div>
    <el-row style="height: 100%;">
      <el-col :span="24"  style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" router>
          <template v-for="item in menuList">
            <template v-if="item.status">
              <el-menu-item :index="item.path" v-if="!sliderWidthFlag"><i class="iconfont" v-bind:class="item.icon"></i>{{item.menuName}}</el-menu-item>
              <el-menu-item :index="item.path" v-else class="text-style"><i class="iconfont" v-bind:class="item.icon"></i></el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dd from 'dingtalk-jsapi';
  export default {
    name: "BodySlider",
    data(){
      return{
      }
    },
    created(){
      var _this = this;
    },
    computed: {
      defaultActive: function(){
        if(this.$route.path.indexOf("correcting")==-1){
          localStorage.removeItem("correct");
        }
        if(this.$route.path.indexOf("warehouse")==-1){
          localStorage.removeItem("warehouse");
        }
        if(this.$route.path.indexOf("library")==-1){
          localStorage.removeItem("courseData");
        }
        if(this.$route.path=='/delrecord'){
          return '/manage';
        }else if(this.$route.path.indexOf("courseDetail")!=-1||this.$route.path.indexOf("lesson")!=-1){
          return '/courseManage';
        }else if(this.$route.path.indexOf("classDetail")!=-1){
          return '/classManage';
        }else if(this.$route.path.indexOf("classHomework")!=-1){
          return '/classManage';
        }else if(this.$route.path.indexOf("library")!=-1||this.$route.path.indexOf("libraryhw")!=-1){
          return '/library';
        }else if(this.$route.path.indexOf("warehouse")!=-1){
          return '/warehouse';
        }else{
          return this.$route.path;
        }
      }
    },
    mounted(){

    },
    props:['sliderWidthFlag','menuList'],
    methods:{

    }
  }
</script>


<style scoped lang="scss">
  .el-menu-item i {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    display:inline-block;
    margin-top:-4px;
    font-size:20px;
  }
  .mock-silder{
    display:block;
    border-top:1px solid rgba(113,74,238,0.2);;
  }
  .el-menu{
    border:0;
  }
  .el-menu-item.is-active{
    background:#fef6eb;
    border-right:3px solid #F08D00;
  }
  .el-menu-item:hover{
    /*background-color: #a289f4;*/
    /*color:#fff;*/
    /*i{*/
      /*color:#fff;*/
    /*}*/
  }

  .logo{
    padding:12px 0;
    img{
      width:132px;
      display:block;
      margin:0 auto;
    }
    .img-width{
      width:42px;
    }
  }
  .text-style{
    padding-left:0;
    text-align: center;
  }
</style>
