<template>
  <div class="x-search-list" :class="sliderWidthFlag?'lesson-manage-index-content':''">
    <wv-search-bar :autofocus="false" v-model="searchValue"></wv-search-bar>
    <div class="x-search-result-list">
      <wv-radio v-model="singleSelectValue" :options="singleflag ? singleOptions:dataList" @change="singleOnChange"></wv-radio>
    </div>
    <!--<div class="x-search-footer" :class="sliderWidthFlag?'lesson-manage-index-content':''">-->
      <!--<span @click="clickBackBtn()">返回</span>-->
      <!--<span @click="clickComfitmBtn">确定</span>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "SelectSubjectComponent",
    props: ['dataList','singleValue','sliderWidthFlag'],
    data() {
      return {
        singleSelectValue: this.singleValue,
        singleOptions: [],
        searchValue: '',
        singleflag:false,
      }
    },
    watch:{
      searchValue(val,oldval){
        console.log(val,oldval,"val");
        this.singleflag = true;
        this.singleOptions = this.dataList.filter(value => value.label.indexOf(val)!=-1 );
      }
    },
    mounted(){
      console.log("sliderWidthFlag",this.sliderWidthFlag);
    },
    methods: {
      //点击返回按钮
      clickBackBtn() {
        this.$emit("back-btn");
      },
      //点击确定按钮
      clickComfitmBtn() {
        this.$emit("confirm-btn", this.singleSelectValue);
      },
      //单选改变的时候就返回值
      singleOnChange() {
        this.$emit("confirm-btn", this.singleSelectValue);
      }
    }
  }
</script>

<style scoped lang="scss">
  /*pc页面固定宽*/
  @media only screen and (min-width: 600px) {
    .x-search-list {
      top: 64px;
      left: 240px;
      border: 1px solid #e4e7ed;
      bottom: 0;
    }
    .x-search-footer{
      left:240px;
    }
    .lesson-manage-index-content {
      left: 80px;
    }
  }
  .x-search-result-list{
    bottom:0;
  }

</style>
