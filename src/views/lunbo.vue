<template>
  <div class="lunbo-div">
    <el-carousel indicator-position="outside" height="200px">
      <el-carousel-item v-for="item in 4" :key="item">
        <div class="item" :class="'item'+item">{{item}}</div>
      </el-carousel-item>
    </el-carousel>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 4" :key="item">
        <div class="item" :class="'item'+item">{{item}}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: "lunbo"
  }
</script>

<style scoped lang="scss">
  .lunbo-div{
    width:700px;
    margin:0 auto;
  }
  .item{
    text-align: center;
    line-height: 200px;
  }
  .item1{
    background:#ce3c39;
  }
  .item2{
    background:#3a8ee6;
  }
  .item3{
    background:#cf9236;
  }
  .item4{
    background:#ffbe00;
  }
</style>
