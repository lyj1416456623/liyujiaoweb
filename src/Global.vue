<template>

</template>

<script>
  export default {
    name: "Global",
    methods: {
      request(opt) {
        let self = this;
        //添加请求token
        switch (opt.method) {
          case 'post':
            self.$http.post(opt.url, opt.param).then(function (response) {
                  opt.success(response.data)
              }).catch(function (error) {
                opt.error(error);
            });
            break;
          case 'get':
            console.log('尚未添加');
            self.$http.get(opt.url)
              .then(function (response) {
                  opt.success(response.data)
              }).catch(function (error) {
              opt.error(error);
            });
            break;
        }

      }
    }
  }
</script>
