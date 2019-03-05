<template>
  <!--单选题报告页模板-->
  <div class="single-choice">
    <div class="single-title">
      <template v-for="item in questionData.title">
        <h2 v-if="item.itemType=='TEXT'" v-html="item.itemValue"></h2>
        <img v-if="item.itemType == 'IMG'" :src="item.itemValue">
      </template>
    </div>
    <template v-if="questionData.questionType == 'CHOICE'">
      <div class="qusition-option" v-for="(val,key,i) in questionData.optionMap"
           :class="recordData[0]==key?(questionData.answerList[0]==recordData[0] ? 'option-right':'option-error'):'' ">
        <label class="question-block">
          <div class="option">{{key}}</div>
          <div class="option-content">
            <template v-for="answer in val">
              <p v-if="answer.itemType=='TEXT'" v-html="answer.itemValue"></p>
              <img :src="answer.itemValue" alt="" v-if="answer.itemType=='IMG'">
            </template>
          </div>
        </label>
      </div>
    </template>
    <template v-if="questionData.questionType == 'MULTIPLE_CHOICE'">
      <div class="qusition-option" v-for="(val,key,i) in questionData.optionMap"
           :class="[{'option-right':(questionData.answerList.indexOf(key)!=-1 && recordData.indexOf(key)!=-1)},{'option-error':(questionData.answerList.indexOf(key)==-1 && recordData.indexOf(key)!=-1)}]">
        <label class="question-block">
          <div class="option">{{key}}</div>
          <div class="option-content">
            <template v-for="answer in val">
              <p v-if="answer.itemType=='TEXT'" v-html="answer.itemValue"></p>
              <img :src="answer.itemValue" alt="" v-if="answer.itemType=='IMG'">
            </template>
          </div>
        </label>
      </div>
    </template>


    <!--解析-->
    <div class="explain">
      <p class="explain-answer">正确答案是：
        <template v-for="answerItem in questionData.answerList"><span class="answer-span">{{answerItem}}</span>
        </template>
      </p>
      <div class="explain-detail">
        <template v-for="explainItem in questionData.explainList">
          <p v-if="explainItem.itemType=='TEXT'" v-html="explainItem.itemValue"></p>
          <img :src="explainItem.itemValue" alt="" v-if="explainItem.itemType=='IMG'">
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
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
    name: "SingleChoiceReport",
    data() {
      return {
        checkedValue: '',
      }
    },
    watch: {
      checkedValue(val) {
        console.log(val, "选中的值");
      }
    },
    mounted() {
      console.log(this.recordData, '  single报告的数据------')
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .single-choice {
    .question-score {
      margin-bottom: 8px;
      span {
        min-width: 48px;
        display: inline-block;
        font-size: 12px;
        color: #46A3FA;
        text-align: center;
        line-height: 12px;
        padding: 4px 0;
        background: #E7F3FD;
        border-radius: 24px;
      }
    }

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
    .qusition-option {
      width: 324px;
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      font-size: 24px;
      color: #222222;
      margin-bottom: 16px;

      .question-block {
        display: flex;
        min-height: 80px;
        padding: 14px 20px;
        box-sizing: border-box;
        align-content: center;
        align-items: center;

        .option {
          width: 32px;
          height: 32px;
          text-align: center;
          background: #fff;
          border-radius: 12px;
          line-height: 32px;
        }

        .option-content {
          margin-left: 20px;
          font-size: 18px;
          line-height: 26px;
          display: block;
          flex: 1;

          img {
            height: 120px;
          }
        }
      }
    }
    /*question-option  end*/
    .qusition-option:last-child {
      margin-bottom: 0;
    }
    .option-error {
      border: 1px solid #FF6666;
      .question-block {
        .option {
          background: #FF6666;
          color: #fff;
          box-shadow:0px 2px 4px 0px rgba(255,102,102,0.32);
        }
      }
    }
    .option-right {
      border: 1px solid #46A3FA;
      .question-block {
        .option {
          background: #46A3FA;
          color: #fff;
        }
      }
    }

    /*解析*/
    .explain {
      width: 600px;
      box-sizing: border-box;
      font-size: 16px;
      color: #606060;
      line-height: 24px;
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
      .explain-answer {
        margin-bottom: 8px;
        .answer-span {
          color: #46A3FA;
        }
      }
    }

  }
</style>
