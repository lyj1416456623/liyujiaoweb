<template>
  <div class="list-li">
    <router-link class="list-block" to="/lunbo">轮播</router-link>
  </div>
</template>
<script>
  export default {
    name: "Index",
    data() {
      return {
        nowIndex: 0,
        listWidth: '1000',
        index: 1,
        list: ['https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1551941438&di=b5dcd4817dba1c9676804920f9d2b796&src=http://b-ssl.duitang.com/uploads/item/20182/21/2018221142159_MZ33z.jpeg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551951521912&di=5c3dea93cd10cd2d7ab857ff1639e809&imgtype=0&src=http%3A%2F%2Fphotos.tuchong.com%2F395318%2Ff%2F7145692.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551951521912&di=2e4b325ff9a954929c52915a016bccdb&imgtype=0&src=http%3A%2F%2Fpn.gexing.com%2FG1%2FM00%2F69%2F18%2FrBACFFJpO9SzxHj4AAY7B3FzITw424.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551951689406&di=8786a5459360d5ac9e6c31b401928380&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201502%2F21%2F20150221114538_YnGwk.jpeg'],
        timer: null
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .list-li {
    width: 100%;
    background: #f5f5f5;
    .list-block {
      width: 100%;
      height: 50px;
      line-height:50px;
      text-align: center;
      background: #fff;
      float: left;
      display:block;
      color:#000;
    }
    .list-block:after {
      clear: both;
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
  }

</style>
