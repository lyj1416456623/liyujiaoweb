<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>

<script>
  export default{
    props: {
      totalNum: Number,
    },
    data(){
      return{
        currentPage:1,//默认显示第一页
        pageSize:10,//默认每页显示10条
      }
    },
    methods: {
      handleSizeChange(val) {//pageSize 改变时会触发
        let self = this;
        self.pageSize = val;//每一页显示多少条
        this.$emit('child-say2',val);
      },
      handleCurrentChange(val) {//currentPage 改变时会触发  第几页
        let self = this;
        self.currentPage = val;//第几页
        this.$emit('child-say',val);
      }
    },
    mounted(){
      let self = this;
    }
  }
</script>

<style lang="scss">
  .block .el-pagination{
    text-align: right;
    padding-top:10px;
  }

</style>
