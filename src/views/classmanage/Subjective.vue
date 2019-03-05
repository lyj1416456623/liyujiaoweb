<template>
  <div class="subject-choice">
    <div class="subject-title">
      <template v-for="item in questionData.title">
        <h2 v-if="item.itemType=='TEXT'">{{item.itemValue}}</h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue">
      </template>
    </div>
    <div class="blank-list">
      <p class="blank-title">学生答案：</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Subjective",
    props: {
      questionData: {
        type: Object,
        required: true
      },
      recordData: { //学生的答案
        type: Array,
        required: true
      }
    },
  }
</script>

<style scoped lang="scss">
  .single-choice {
    .single-title {
      margin-bottom: 16px;
      h2 {
        font-size: 18px;
        font-weight: 400;
        color: #222222;
        line-height: 26px;
        margin-top: 16px;
      }
      img {
        width: 100%;
        margin-top: 8px;
      }

    }
    .blank-list {
      .blank-title {
        font-size: 16px;
        color: #bdbdbd;
        line-height: 22px;
      }

    }
  }

</style>
