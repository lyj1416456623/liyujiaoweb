<template>
  <div>
    <div class="top_nav_box">
      <div class="logo">
        <router-link :to="{ path: '/manage' }">
          <img src="//official-web.oss-cn-beijing.aliyuncs.com/logo/logo_purple.png" alt="">
        </router-link>
      </div>
      <ul class="top-nav">
        <li class="first_menu_item"><a href="https://www.topschool.com/" class="fm_a" target="_blank">首页</a></li>
        <li class="first_menu_item fmi_cur"><a href="http://liuyuan.topschool.com/toefl.html" class="fm_a" target="_blank">顶上留园<span
          class="menu_icon iconfont icon-down"></span></a>
          <div class="second_menu">
            <ul>
              <li class="cur"><a href="http://liuyuan.topschool.com/toefl.html" target="_blank">TOEFL</a></li>
              <li class=""><a href="http://liuyuan.topschool.com/ielts.html" target="_blank">IELTS</a></li>
              <li><a href="http://liuyuan.topschool.com/sat.html" target="_blank">SAT</a></li>
              <li><a href="http://liuyuan.topschool.com/ssat.html" target="_blank">SSAT</a></li>
              <li><a href="http://liuyuan.topschool.com/act.html" target="_blank">ACT</a></li>
            </ul>
          </div>
        </li>
        <li class="first_menu_item"><a href="https://www.towords.com/" class="fm_a" target="_blank">顶上拓词</a></li>
        <li class="first_menu_item"><a href="http://waijiao.topschool.com/abroad.html" class="fm_a" target="_blank">顶上外教课<span
          class="menu_icon iconfont icon-down"></span></a>
          <div class="second_menu">
            <ul>
              <li class=""><a href="http://waijiao.topschool.com/abroad.html" target="_blank">留学备考青春</a></li>
              <li><a href="http://waijiao.topschool.com/about.html" target="_blank">关于青春</a></li>
            </ul>
          </div>
        </li>
        <li class="first_menu_item"><a href="#" class="fm_a">语文</a></li>
      </ul>
    </div>
    <div class="login-content">
      <div class="wechat-content" v-show="boxList.wechatLoginBox">
        <h2>语文 · 微信扫码登入</h2>
        <div id="wechat-qrcode"></div>
        <p>使用微信扫码登入语文</p>
        <div class="weui-loadmore weui-loadmore-line">
          <span class="weui-loadmore-tips" @click="restBox('formLoginBox')">账号密码登入</span>
        </div>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <div class="wechat-content" v-show="boxList.dingLoginBox">
        <h2>语文 · 钉钉扫码登入</h2>
        <div class="ding-img" id="login_container">

        </div>
        <!--<p>内部员工使用钉钉扫码登入语文</p>-->
        <el-button type="primary" @click="restBox('wechatLoginBox')">返回</el-button>
      </div>
      <div class="wechat-content" v-if="boxList.formLoginBox">
        <h2>语文 · 账号密码登入</h2>
        <div class="form-login">
          <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="user">
              <el-input v-model="loginForm.user" clearable placeholder="手机号码/邮箱" name="phone"></el-input>
            </el-form-item>
            <el-form-item prop="userPassword">
              <el-input v-model="loginForm.userPassword" clearable type="password" placeholder="密码"
                        name="userPassword"></el-input>
              <el-input type="password" placeholder="密码" id="userPassword" style="display:none"></el-input>
              <p :class="iserror?'error-tip active':'error-tip'">账号与密码不匹配</p>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" @click="formLogin('loginForm')">登入</el-button>
        <p class="forget-password">
          <span @click="forgetPhonePass('loginForm')">忘记密码</span>
        </p>
        <div class="weui-loadmore weui-loadmore-line">
          <span class="weui-loadmore-tips wechat-tips" @click="restBox('wechatLoginBox')">微信登入</span>
        </div>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <!--找回密码-->
      <div class="wechat-content" v-if="boxList.formForgetBox">
        <h2>语文 · 找回密码</h2>
        <div class="form-login">
          <el-form :model="forgetForm" :rules="imgCoderules" ref="forgetForm" class="demo-ruleForm">
            <el-form-item prop="phone">
              <el-input v-model="forgetForm.phone" clearable placeholder="手机号码" type="text"></el-input>
            </el-form-item>
            <el-form-item prop="imgPassword">
              <el-input v-model="forgetForm.imgPassword" placeholder="图形验证码" type="text">
                <img slot="suffix" :src="imgCode" @click="getImgCode"
                     style="width: 80px;height: 30px;margin-top: 5px;border-left:1px solid #DCDFE6;padding-left:5px">
              </el-input>
              <el-input type="text" placeholder="密码" id="imgPassword" style="display:none"></el-input>
              <p :class="codeImageError?'error-tip active':'error-tip'">图形验证码错误</p>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" @click="checkImgCode('forgetForm')">获取短信验证码</el-button>
        <p class="forget-back" @click="backPhonePass('forgetForm')">返回</p>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <!--填写短信验证码-->
      <div class="wechat-content forget-content" v-if="boxList.formForgetBox2">
        <h2>语文 · 找回密码</h2>
        <div class="form-login">
          <el-form :model="forgetForm2" :rules = "phoneCoderules" ref="forgetForm2" class="demo-ruleForm">
            <div class="phone-edit">
              <span>手机号码：{{forgetForm.phone}}</span>
              <span @click="setPhoneNumber('forgetForm2')" style="cursor: pointer">修改</span>
            </div>
            <el-form-item prop="imgPassword">
              <el-input v-model="forgetForm2.phoneCode" placeholder="短信验证码">
                <div slot="suffix" v-if="timeDown == '重新获取'" @click = "getPhoneCode"
                     style="width: 110px;height: 30px;text-align:center;padding-left: 5px;line-height:30px;cursor:pointer;margin-top: 5px;border-left:1px solid #DCDFE6;color:#F08D00">
                  {{timeDown}}
                </div>
                <div slot="suffix" v-else
                     style="width: 110px;height: 30px;text-align:center;padding-left: 5px;line-height:30px;margin-top: 5px;border-left:1px solid #DCDFE6;color:#F08D00">
                  {{timeDown}}
                </div>
              </el-input>
              <p :class="codePhoneError?'error-tip active':'error-tip'">{{codePhoneErrorText}}</p>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" @click="setPasswordPage('forgetForm2')">下一步</el-button>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <!--设置新密码-->
      <div class="wechat-content" v-if="boxList.newForgetBox">
        <h2>语文 · 设置新密码</h2>
        <div class="form-login">
          <el-form :model="newPassForm" :rules="passFormRules" ref="newPassForm" class="demo-ruleForm">
            <el-form-item prop="newPassword">
              <el-input v-model="newPassForm.newPassword" clearable placeholder="新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input v-model="newPassForm.checkPass" placeholder="再次输入新密码" type="password">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" @click="savePassword('newPassForm')">完成</el-button>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <!--微信未关联-->
      <div class="wechat-content wechat-content-unrelated" v-if="boxList.wechatUnrelateBox">
        <h2>微信未关联</h2>
        <p class="wechat-unrelated">你的微信并没有和语文账号进行关联，请使用<br>账号密码登入</p>
        <el-button type="primary" @click="restBox('formLoginBox')">知道了</el-button>
        <div class="staff-only" @click="restBox('dingLoginBox')">员工通道</div>
      </div>
      <div class="wechat-content wechat-content-unrelated" v-if="boxList.dingUnrelateBox">
        <h2>非内部员工</h2>
        <p class="wechat-unrelated">你不在钉钉的组织架构里哦，还是使用<br>账号密码登入吧！</p>
        <el-button type="primary" @click="restBox('formLoginBox')">知道了</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import QRCode from 'qrcodejs2'
  function NX() {
    return new Promise(function (resolve, reject) {
      window.onload = function () {
        resolve(NX)
      }
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js";
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }

  var GFunc = {
    init: function () {
      var obj = DDLogin({
        id: "login_container",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid%3ddingoazlirftbgizlnjcon%26response_type%3dcode%26scope%3dsnsapi_login%26state%3dSTATE%26redirect_uri%3dhttp%3a%2f%2fx.topschool.com%2fz-gateway%2fding_talk%2fqr_login",
        style: "border:none;background-color:#FFFFFF;",
        width: "365",
        height: "400"
      });
      var hanndleMessage = function (event) {
        var origin = event.origin;
        console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          var redirect_uri = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid%3ddingoazlirftbgizlnjcon%26response_type%3dcode%26scope%3dsnsapi_login%26state%3dSTATE%26redirect_uri%3dhttp%3a%2f%2fx.topschool.com%2fz-gateway%2fding_talk%2fqr_login&loginTmpCode=" + loginTmpCode;
          window.location.href = redirect_uri;
        }
      };

      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', hanndleMessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', hanndleMessage);
      }

    },
  };
  export default {
    name: "index",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.newPassForm.checkPass !== '') {
            this.$refs.newPassForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.newPassForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        boxList: {
          wechatLoginBox: false,
          wechatUnrelateBox: false,
          formLoginBox: true,
          dingLoginBox: false,
          dingUnrelateBox: false,
          formForgetBox: false,
          formForgetBox2: false,
          newForgetBox: false
        },
        tokenUuid: '',//微信二维码uuid
        imgUuid:'',//图片uuid
        imgCode:'',
        timedInterval:'',
        checkInterval:'',
        timeDownInterval:'',//倒计时interval
        timeDown:'重新获取',//倒计时获取短信验证码
        timeDownSecond:60,//倒计时
        loginForm: {
          user: '15011191306',
          userPassword: '11'
        },
        forgetForm: {
          phone: '',
          imgPassword: '',
        },
        forgetForm2:{
          phoneCode:''
        },
        iserror: false,//账号密码不匹配
        codeImageError:false,//图形验证码
        codePhoneError:false,//短信验证码
        codePhoneErrorText:"请输入短信验证码",
        newPassForm: {
          newPassword: '',
          checkPass: ''
        },
        rules: {
          user: [
            {required: true, message: '账号不能为空哦', trigger: 'blur'},
          ],
          userPassword: [
            {required: true, message: '密码不能为空哦！', trigger: 'blur'}
          ],
        },
        imgCoderules: {
          phone: [
            {required: true, message: '手机号码不能为空哦', trigger: 'blur'},
          ],
          imgPassword: [
            {required: true, message: '图形验证码不能为空哦！', trigger: 'blur'}
          ]
        },
        phoneCoderules: {
          phoneCode:[
            {required: true, message: '手机验证码不能为空哦！', trigger: 'blur'}
          ]
        },
        passFormRules: {
          newPassword: [
            {validator: validatePass, trigger: 'blur'},
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        },
      }
    },
    watch: {
      boxList() {
        console.log("boxList变化")
      }
    },
    updated() {
      this.$nextTick(function () {
        GFunc.init();
      })
    },
    destroyed(){
      clearInterval(this.timedInterval);
      clearInterval(this.checkInterval);
    },
    mounted() {
      var _this = this;
      //钉钉二维码
      this.$nextTick(function () {
        NX().then(nx => {
          GFunc.init();
        })
      })
      // _this.qrcode();
      // _this.getImgCode();
      // _this.timedInterval = setInterval(() => _this.qrcode(), 60000);
      // _this.checkInterval = setInterval(() => _this.checkWechatQrcode(), 3000);
    },
    methods: {
      //获取图形验证码
      getImgCode(){
        var _this = this;
        _this.imgUuid = _this.uuid(32, 16);
        _this.imgCode = '/p-innermgrweb/password/create_img_code?imageCodeId='+_this.imgUuid;
      },
      //生成uuid
      uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          // rfc4122, version 4 form
          var r;

          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }

        return uuid.join('');
      },
      //生成微信二维码
      qrcode() {
        var _this = this;
        _this.tokenUuid = _this.uuid(32, 16);
        console.log(_this.tokenUuid, "uuid");
        //向后台发送uuid
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/wx/save_qr_token_pass.do',
          param: {
            qrToken: _this.tokenUuid,
          },
          success: function (data) {
            console.log(data);
            if (data.code == 200) {
              console.log("发送数据成功");
            } else {
              _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
        document.getElementById("wechat-qrcode").innerHTML = '';
        let qrcode = new QRCode('wechat-qrcode', {
          width: 280,
          height: 280, // 高度
          text: "http://xi.topschool.com/qrcodelogin/" + _this.tokenUuid, // 二维码内容
          render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        })
      },
      //检查二维码token状态
      checkWechatQrcode() {
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/wx/check_qr_token_pass.do',
          param: {
            qrToken: _this.tokenUuid,
          },
          success: function (result) {
            console.log(result);
            if (result.code == 200) {
              if(result.result!='') {
                localStorage.setItem("token", result.result);
                if (_this.$router.history.current.query.redirect == location.hostname) {
                  _this.$router.go(-1);
                } else {
                  _this.$router.replace('/')
                }
              }
            } else {
              _this.qrcode();
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      },
      //切换登录方式
      restBox(boxName) {
        var _this = this;
        // console.log(_this.boxList);
        for (var i in _this.boxList) {
          _this.boxList[i] = false;
        }
        _this.boxList[boxName] = true;
        _this.boxList = JSON.parse(JSON.stringify(_this.boxList));
        console.log(boxName, _this.boxList);
      },
      //账号密码登录
      formLogin(formName) {
        var _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.request({
              method: 'post',
              url: '/login.do',
              param: {
                userAccount: _this.loginForm.user,
              },
              success: function (data) {
                console.log(data);
                if (data.code == 200) {
                  localStorage.setItem("token", data.token);
                  if (_this.$router.history.current.query.redirect == location.hostname) {
                    _this.$router.go(-1);
                  } else {
                    _this.$router.replace('/')
                  }
                } else {
                  _this.iserror = true;
                  _this.$message.error('账号和密码不匹配');
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
              }
            })
          } else {
            return false;
          }
        });
      },
      //校验图片验证码
      checkImgCode(formName){
        var _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.request({
              method: 'post',
              url: '/p-innermgrweb/password/check_img_code.do',
              param: {
                imageCodeId: _this.imgUuid,
                imgCode: _this.forgetForm.imgPassword
              },
              success: function (data) {
                console.log(data,"校验图形验证码");
                if (data.code == 200) {
                  _this.getPhoneCode();
                  _this.restBox('formForgetBox2');
                } else {
                  _this.codeImageError = true;
                  //刷新图片验证码
                  _this.getImgCode();
                  _this.$message.error('图形验证码错误');
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
              }
            })
          } else {
            return false;
          }
        });
      },
      //修改手机号
      setPhoneNumber(formName){
        this.$refs[formName].clearValidate();
        this.restBox('formForgetBox');
        this.timeDownSecond = 60;
        this.timeDown = "60秒后重新获取";
        this.forgetForm2.phoneCode = "";
        this.codePhoneError = false;
        clearInterval(this.timeDownInterval);
      },
      // 返回账号密码登录
      backPhonePass(formName){
        this.restBox('formLoginBox');
        this.$refs[formName].clearValidate();
      },
      //点击忘记密码重置验证
      forgetPhonePass(formName){
        this.restBox('formForgetBox');
        this.$refs[formName].clearValidate();
      },
      //发送短信验证码
      getPhoneCode(){
        var _this = this;
        _this.request({
          method: 'post',
          url: '/p-innermgrweb/password/send_verify_code.do',
          param: {
            userMobilePhone:_this.forgetForm.phone,
            imageCodeId: _this.imgUuid,
            imgCode: _this.forgetForm.imgPassword
          },
          success: function (data) {
            console.log(data,"获取短信验证码");
            if (data.code == 200) {
              _this.setTimeDownSecond();
              _this.timeDownInterval = setInterval(() => _this.setTimeDownSecond(), 1000);
            } else {
              _this.$message.error('获取短信验证码失败');
            }
          },
          error: function (error) {
            //服务器异常
            console.log(error);
            _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
          }
        })
      },
      //倒计时
      setTimeDownSecond(){
        this.timeDownSecond--;
        if(this.timeDownSecond == 0){
          this.timeDown = '重新获取';
          clearInterval(this.timeDownInterval);
          this.timeDownSecond = 60;
          return false;
        }
        this.timeDown = this.timeDownSecond+'秒后重新获取';
      },
      //验证短信验证码
      setPasswordPage(formName){
        console.log(formName,"ddd");
        var _this = this;
        _this.$refs[formName].validate((valid) => {
          console.log(valid,"ddddddd");
          if (valid) {
            if(_this.forgetForm2.phoneCode == ''){
              _this.codePhoneError = true;
              _this.codePhoneErrorText = "请输入短信验证码";
            }else{
              _this.codePhoneError = false;
              _this.request({
                method: 'post',
                url: '/p-innermgrweb/password/check_verify_code.do',
                param: {
                  userMobilePhone: _this.forgetForm.phone,
                  code: _this.forgetForm2.phoneCode
                },
                success: function (data) {
                  console.log(data,"校验短信验证码");
                  if (data.code == 200) {
                    _this.restBox('newForgetBox');
                  } else {
                    _this.codePhoneError = true;
                    _this.codePhoneErrorText = "请短信验证码错误";
                    _this.$message.error('短信验证码错误');
                  }
                },
                error: function (error) {
                  //服务器异常
                  console.log(error);
                  _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      //保存密码
      savePassword(formName){
        var _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.request({
              method: 'post',
              url: '/p-innermgrweb/password/update_user_password.do',
              param: {
                userMobilePhone: _this.forgetForm.phone,
                code: _this.forgetForm2.phoneCode,
                password:_this.newPassForm.newPassword
              },
              success: function (data) {
                console.log(data,"修改密码");
                if (data.code == 200) {
                  _this.forgetForm = {
                    phone: '',
                    imgPassword: '',
                  };
                  _this.forgetForm2 = {
                    phoneCode:''
                  }
                  _this.newPassForm = {
                    newPassword: '',
                    checkPass: ''
                  }
                  _this.restBox('formLoginBox');
                } else {
                  _this.restBox('formLoginBox');
                  _this.$message.error(data.message);
                }
              },
              error: function (error) {
                //服务器异常
                console.log(error);
                _this.$message.error('网络加载失败，去右上角菜单中刷新页面。');
              }
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
<style>
  .login-content .el-button--primary {
    width: 320px;
    height: 40px;
    margin-top: 24px;
    border-radius: 8px;
  }

  .login-content .el-button--primary span {
    font-size: 16px;
  }

  .login-content .el-form-item {
    margin-bottom: 48px;
  }

  .login-content .el-form-item.is-success .el-input__inner, .login-content .el-form-item.is-success .el-input__inner:focus, .login-content .el-form-item.is-success .el-textarea__inner, .login-content .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #dcdfe6;
  }
</style>
<style scoped lang="scss">
  .top_nav_box {
    padding: 0 80px;
    height: 60px;
    line-height: 56px;
    min-width: 900px;
    background: #fff;
    .logo {
      float: left;
      img {
        width: 135px;
        display: block;
        padding-top: 10px;
      }
    }
    .top-nav {
      float: right;
      .first_menu_item {
        padding: 0 20px;
        margin-left: 20px;
        float: left;
        border-top: 4px solid #fff;
        border-top: 3px solid #fff;
        position: relative;
        padding: 0 10px;
        a {
          color: #4C3C66;
        }
        .menu_icon {
          font-size: 16px;
          color: #3b0886;
          transition: all ease .3s;
          padding-left: 10px;
        }
      }
      .first_menu_item:last-child {
        border-top: 3px solid #F08D00;
      }
      .first_menu_item:hover{
        border-top: 3px solid #F08D00;
        color: #3b0886;
      }
    }
  }

  .login-content {
    text-align: center;
    .wechat-content {
      width: 520px;
      height: 520px;
      padding: 48px 0;
      box-sizing: border-box;
      background: #fff;
      position: fixed;
      top: 50%;
      left: 50%;
      margin-left: -260px;
      margin-top: -260px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 32px 0px rgba(26, 7, 71, 0.3);
      border-radius: 8px;
      #wechat-qrcode {
        width: 280px;
        margin: 24px auto 0;
      }
    }
    .wechat-content-unrelated {
      height: 328px;
    }
    .forget-content {
      height: 480px;
    }
    h2 {
      font-size: 24px;
      font-weight: inherit;
      color: rgba(38, 38, 37, 1);
      line-height: 32px
    }
    img {
      width: 280px;
    }
    .ding-img {
      min-height: 280px;
      max-height: 300px;
      overflow: hidden;
    }
    p {
      font-size: 16px;
      margin-top: 4px;
      color: rgba(143, 141, 139, 1);
      line-height: 24px;
    }
    .wechat-unrelated {
      margin: 48px auto 40px;
    }
    .forget-password {
      text-align: right;
      padding: 0 100px;
      margin-top: 12px;
      margin-bottom: 44px;
      font-size: 14px;
      color: #C0C0C0;
      span {
        cursor: pointer;
      }
      span:hover {
        color: #F08D00;
        text-decoration: underline;
      }
    }
    .forget-back {
      margin-top: 24px;
      color: #F08D00;
    }
    .weui-loadmore {
      width: 320px;
      margin: 1.5em auto;
      line-height: 1.6em;
      font-size: 14px;
      text-align: center;
    }
    .weui-loadmore-line {
      border-top: 1px solid #E5E5E5;
      margin-top: 38px;
      .weui-loadmore-tips {
        position: relative;
        top: -0.9em;
        padding: 0 16px;
        background-color: #FFFFFF;
        color: #808080;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      .weui-loadmore-tips:hover {
        color: #F08D00;
      }
      .wechat-tips:hover {
        color: #42A831;
      }
    }
    .form-login {
      width: 320px;
      margin: 52px auto;
    }
    .staff-only {
      position: fixed;
      right: 40px;
      bottom: 40px;
      font-size: 12px;
      color: rgba(144, 144, 144, 1);
      line-height: 20px;
      cursor: pointer;
    }
    /*找回密码  验证码页面*/
    .phone-edit {
      margin-bottom: 45px;
      span:first-child {
        float: left;
        color: #909399;
      }
      span:last-child {
        float: right;
        color: #F08D00;
      }
    }
    .phone-edit:after {
      clear: both;
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    .error-tip {
      color: #F5222D;
      text-align: left;
      font-size: 12px;
      display: none;
    }
    .error-tip.active {
      display: block;
    }
    .is-error-tip {
      border-color: #f5222d;
    }
    .is-error-tip .el-input__inner {
      border-color: #f5222d !important;
    }
  }

  .help-doc {
    position: absolute;
    bottom: 40px;
    left: 40px;
    font-size: 12px;
    color: #909090;
    display: block;
    i {
      font-size: 12px;
      margin-right: 3px;
    }
  }

  .first_menu_item .second_menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    width: 100%;
    background-color: #fff;
  }

  /*.first_menu_ul .fmi_cur .second_menu,*/
  .first_menu_item:hover .second_menu {
    display: block !important;
  }

  .first_menu_item .second_menu ul li {
    text-align: center;
    cursor: pointer;
  }

  .first_menu_item .second_menu ul li a {
    display: block;
    font-size: 14px;
    line-height: 3.5;
    text-align: center;
    color: #373737;
  }

  .first_menu_item .second_menu ul li:hover a,
  .first_menu_item .second_menu ul .cur a {
    color: #3b0886;
  }
</style>

