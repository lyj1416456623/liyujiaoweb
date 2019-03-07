<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" img-set="//ts-official-website.towords.com/img/share/play.png"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  @import "style/common.css";
  #app {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #ffffff;
    margin:0;
    padding:0;
    background:#f5f5f5;
    height:100%;
  }
</style>




