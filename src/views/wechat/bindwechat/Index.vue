<template>
  <div class="wechat-content-homework">
    <div class="homework-content">
      <div class="query-block" v-if="!ifBind&&!searchResult">
        <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/wxuser.jpg" alt="">
        <input type="text" v-model="phone" placeholder="输入手机号，查找学生" @blur="resetWindow"/>
        <div class="submit-button" v-if="!ifTruePhone">查找</div>
        <div class="submit-button submit-button-active" v-if="ifTruePhone" @click="checkBind">查找</div>
      </div>
      <div class="content-blcok" v-if="!ifBind&&searchResult">
        <div class="user-message">
          <div class="user-top-dir">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
            <div class="user-top-message">
              <p class="user-name">{{phoneNumUserName}}</p>
              <p>手机号：{{phone}}</p>
            </div>
          </div>
          <div class="user-bottom-dir">
            <div class="user-bottom-content">
              <p>微</p>
              <img :src="wxUserInfo.headImgUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'"
                   alt="">
              <p>信</p>
            </div>
            <p>{{wxUserInfo.nickname}}</p>
          </div>
        </div>
        <p class="confirm-content">确定要用当前微信作为“{{phoneNumUserName}}”的学习用微信嘛？</p>
        <div class="submit-button submit-button-active" @click="bindWx">确定</div>
      </div>
      <div class="content-blcok" v-if="ifBindThis=='selfCount'">
        <div class="user-message">
          <div class="user-top-dir">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
            <div class="user-top-message">
              <p class="user-name">{{userName}}</p>
              <p>手机号：{{userAccount}}</p>
            </div>
          </div>
          <div class="user-bottom-dir">
            <div class="user-bottom-content">
              <p>微</p>
              <img :src="wxUserInfo.headImgUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'"
                   alt="">
              <p>信</p>
            </div>
            <p>{{wxUserInfo.nickname}}</p>
          </div>
        </div>
        <p class="confirm-content">当前微信已经是“{{userName}}”的学习微信了哦！</p>
        <div class="submit-button submit-button-active" @click="jumpStudy">去学习</div>
      </div>
      <div class="content-blcok" v-if="ifBindThis=='themWx'">
        <div class="user-message">
          <div class="user-top-dir">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
            <div class="user-top-message">
              <p class="user-name">{{phoneNumUserName}}</p>
              <p>手机号：{{phone}}</p>
            </div>
          </div>
          <div class="user-bottom-dir">
            <div class="user-bottom-content">
              <p>微</p>
              <img :src="wxHeadImgUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'" alt="">
              <p>信</p>
            </div>
            <p>{{wxUserNickname}}</p>
          </div>
        </div>
        <p class="confirm-content">“{{phoneNumUserName}}”已经有别的学习微信“{{wxUserNickname}}”了哦！ </p>
        <p class="confirm-grey">如需更换，请提前联系老师</p>
      </div>
      <div class="content-blcok" v-if="ifBindThis=='themCount'">
        <div class="user-message user-last-message">
          <div class="user-top-dir">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/kongziwx.png" alt="">
            <div class="user-top-message">
              <p class="user-name">{{phoneNumUserName}}</p>
              <p>手机号：{{phone}}</p>
            </div>
          </div>
          <div class="user-bottom-dir">
            <div class="user-bottom-content">
              <div class="user-content-item">
                <img :src="wxUserInfo.headImgUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'"
                     alt="">
                <p>{{wxUserInfo.nickname}}</p>
              </div>
              <div class="user-content-item">
                <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/lantou.png" alt="">
                <p>{{userName}}</p>
              </div>
            </div>

          </div>
        </div>
        <p class="confirm-content">你的微信已经是“{{userName}}”的学习微信了，换一个微信给“{{phoneNumUserName}}”学习用吧！ </p>
      </div>
      <div class="content-blcok" v-if="ifBindThis=='wrongPhoneNum'">
        <div class="user-message">
          <div class="user-top-dir wrong-num">
            <img src="//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/wenhao.png" alt="">
            <div class="user-top-message">
              <p class="user-name">未知的存在</p>
              <p>手机号：{{phone}}</p>
            </div>
          </div>
          <div class="user-bottom-dir">
            <div class="user-bottom-content">
              <p>微</p>
              <img :src="wxUserInfo.headImgUrl||'//ziyue-xn.oss-cn-beijing.aliyuncs.com/common/userlogo.png'"
                   alt="">
              <p>信</p>
            </div>
            <p>{{wxUserInfo.nickname}}</p>
          </div>
        </div>
        <p class="confirm-content">你输入的手机号并不是子曰的学习账号哦， </p>
        <p class="confirm-grey">看看手机号有没有输错吧！</p>
        <div class="submit-button submit-button-active" @click="resetSearch">重新查找</div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: "Index",
    data() {
      return {
        phone: "",
        userAccount: '',//账号
        userName: '',//姓名
        phoneNumUserName: '',//姓名
        searchResult: false, //是否点了查询
        ifTruePhone: false,//手机号格式是否正确
        ifBind: false, //是否已经绑定的微信
        wxUserInfo: {}, //微信数据
        wxHeadImgUrl: '',//当前手机号绑定的微信 微信头像
        wxUserNickname: '',//当前手机号绑定的微信 微信昵称
        ifBindThis: '', //是否绑定的是当前的微信号 selfCount 当前账号  themWx 绑定了别人的微信   themCount微信绑定了其他账号  wrongPhoneNum无效手机号
      }
    },
    watch: {
      phone(val) {
        var reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        this.ifTruePhone = reg.test(val);
      }
    },
    mounted() {
      var _this = this;
      this.checkWeiXinBrowser(function () {
        console.log("this is wechat");
      })
    },
    methods: {
      resetWindow() {
        window.scroll(0, 0);
      },
      jumpStudy(){
        this.$router.replace("/courseList");
      },
      checkBind() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/wx/check_bind.do',
          param: {phoneNum: _this.phone},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                var data = result.result;
                _this.userName = data.userName || '';
                _this.userAccount = data.userAccount || '';
                _this.phoneNumUserName = data.phoneNumUserName || '';
                _this.wxUserNickname = data.wxUserNickname || '';
                _this.wxHeadImgUrl = data.wxHeadImgUrl || '';
                if (data.wxHaveBindOtherUser) {
                  //当前微信绑定了别人的账号
                  _this.ifBindThis = 'themCount';
                  console.log(_this.userAccount,_this.phone,"手机号",_this.userAccount == _this.phone);
                  if(_this.userAccount == _this.phone){
                    _this.ifBindThis = 'selfCount';
                  }
                }else{
                  if (data.wrongPhoneNum) {
                    //  手机号是无效的手机号 不是我们系统里的手机号
                    _this.ifBindThis = 'wrongPhoneNum';
                  }else{
                    if (data.phoneNumHaveBindOtherWx) {
                      //当前账号绑定了别人的微信
                      _this.ifBindThis = 'themWx';
                      if(_this.userAccount == _this.phone){
                        _this.ifBindThis = 'selfCount';
                      }
                    }
                  }
                }
                if (data.wrongPhoneNum) {
                  //  手机号是无效的手机号 不是我们系统里的手机号
                  _this.ifBindThis = 'wrongPhoneNum';
                }
                if (!data.wxHaveBindOtherUser && !data.wrongPhoneNum && !data.phoneNumHaveBindOtherWx) {
                  _this.searchResult = true;
                } else {
                  _this.ifBind = true;
                }
                _this.wxUserInfo = result.result.wxUserInfo;
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      //绑定微信
      bindWx() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/wx/do_bind.do',
          param: {phoneNum: _this.phone},
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if (result.result) {
                _this.checkBind();
              }
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
          }
        })
      },
      resetSearch() {
        this.ifBindThis = '';
        this.ifBind = false;
        this.phone = '';
      }
    }
  }
</script>

<style scoped lang="scss">
  .wechat-content-homework {
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /*position: relative;*/
    .homework-content {
      background: #fff;
      .query-block {
        img {
          width: 100%;
          display: block;
        }
        input {
          width: 90%;
          background: none;
          outline: none;
          border: 0px;
          margin: 60px 5% 0;
          border-radius: 0;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 0;
        }
        input:focus {
          border-bottom: 1px solid #F08D00;
        }

      }
      .content-blcok {
        padding-top: 25px;
        .user-message {
          margin: 0 16px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0px 2px 8px 0px rgba(212, 121, 41, 0.24);
          .user-top-dir {
            display: flex;
            align-content: center;
            align-items: center;
            padding: 15px;
            background: #F08D00;
            height: 104px;
            box-sizing: border-box;
            img {
              width: 72px;
              height: 72px;
              margin-right: 16px;
            }
            .user-top-message {
              p {
                font-size: 14px;
                color: #FFDCAA;
                line-height: 24px;
              }
              .user-name {
                font-size: 16px;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 24px;
                margin-bottom: 10px;
              }
            }
          }
          .user-bottom-dir {
            width: 100%;
            height: 188px;
            .user-bottom-content {
              display: flex;
              align-content: center;
              align-items: center;
              padding-top: 32px;
              padding-bottom: 24px;
              box-sizing: border-box;
              p {
                flex: 1;
                font-size: 24px;
                font-weight: 500;
                color: #EEEEEE;
                line-height: 33px;
              }
              img {
                width: 64px;
                height: 64px;
                border-radius: 32px;
                display: block;
                margin: 0 auto;
              }
            }
            .user-content-item {
              flex: 1;
              text-align: center;
              p {
                font-size: 16px;
                color: #262626;
                font-weight: 400;
                line-height: 24px;
                margin-top: 24px;
              }
            }
            p {
              text-align: center;
              line-height: 24px;
            }
          }
          .wrong-num {
            background: #BDBDBD;
            .user-top-message {
              p:last-child {
                color: #fff;
              }
            }
          }
        }

        .user-last-message {
          box-shadow: none;
          overflow: initial;
          .user-top-dir {
            border-radius: 8px;
            box-shadow: 0px 2px 8px 0px rgba(158, 74, 0, 0.32);
          }
          .user-bottom-dir {
            margin-top: 24px;
            border-radius: 8px;
            box-sizing: border-box;
            box-shadow: 0px 2px 8px 0px rgba(212, 121, 41, 0.24);
          }
        }
        .confirm-content {
          font-size: 16px;
          margin: 48px 24px 0;
          color: #606060;
          line-height: 24px;
        }
        .confirm-grey {
          font-size: 16px;
          line-height: 24px;
          color: #BDBDBD;
          margin: 0 24px;
        }
      }
      .submit-button {
        margin: 100px 24px 0;
        height: 44px;
        background: #FADBB0;
        text-align: center;
        line-height: 44px;
        border-radius: 8px;
        color: #fff;
      }
      .submit-button-active {
        background: #f08d00;
      }
    }
  }
</style>
