<template>
  <div class="x-search-list" :class="sliderWidthFlag?'lesson-manage-index-content':''">
    <wv-search-bar :autofocus="false" v-model="searchValue"></wv-search-bar>
    <div class="x-search-result-list">
      <wv-checklist v-model="multipleSelectValue" :options="multipleflag ? multipleOptions:dataList"></wv-checklist>
    </div>
    <div class="x-search-footer" :class="sliderWidthFlag?'lesson-manage-index-content':''">
      <span @click="clickBackBtn()">返回</span>
      <span @click="clickComfitmBtn">确定</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectSubjectComponent",
    props: ['dataList','multipleValue','sliderWidthFlag'],
    data() {
      return {
        multipleSelectValue: this.multipleValue,
        multipleOptions: [],
        searchValue: '',
        multipleflag:false,
      }
    },
    watch:{
      searchValue(val,oldval){
        console.log(val,oldval,"val");
        this.multipleflag = true;
        this.multipleOptions = this.dataList.filter(value => value.label.indexOf(val)!=-1 );
      }
    },
    methods: {
      //点击返回按钮
      clickBackBtn() {
        this.$emit("back-btn");
      },
      //点击确定按钮
      clickComfitmBtn() {
        this.$emit("confirm-btn", this.multipleSelectValue);
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

</style>
