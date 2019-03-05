<template>
    <div class="authority-silder">
      <div class="authority-list">
        <template v-for="item in authoritylist.role">
          <div class="authority-list-item"v-if="!item.status">
            <div class="authority-list-items" @click="checkAuthority(item)">
              <p class="name-overflow">{{item.name}}</p>
              <!--<div class="authority-list-operation">-->
                <!--<el-tooltip content="复制" placement="top">-->
                  <!--<i class="iconfont icon-copy" @click.stop="copyAuth(item)"></i>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip content="删除" placement="top" manual v-if="item.type!='default'">-->
                  <!--<div class="authority-item-del">-->
                    <!--<i class="iconfont icon-delete" @click.stop="delAuthMask(item)"></i>-->
                  <!--</div>-->
                <!--</el-tooltip>-->
              <!--</div>-->
            </div>
            <!--<div class="xiniao-popover" v-if="item.visible">-->
              <!--<p class="xiniao-popover-title"><i class="iconfont icon-warning-circle-fill xiniao-warning"></i>你确定删除这个身份嘛？</p>-->
              <!--<div style="text-align: right; margin: 0">-->
                <!--<el-button size="mini" @click="item.visible = false">取消</el-button>-->
                <!--<el-button type="primary" size="mini" @click="delAuth(item,0)">确定</el-button>-->
              <!--</div>-->
            <!--</div>-->
          </div>
          <div class="authority-list-item-active" v-if="item.status" >
            <p class="authority-list-name name-overflow">{{item.name}}</p>
            <p class="authority-list-time">由{{item.createUserName}}创建于{{item.createTimeString}}</p>
            <!--<p class="authority-edit-records" @click="showUpdateRecord(item)">查看身份修改记录</p>-->
            <!--<div class="authority-list-operation">-->
              <!--<el-tooltip content="复制" placement="top">-->
                <!--<i class="iconfont icon-copy" @click.stop="copyAuth(item)"></i>-->
              <!--</el-tooltip>-->
              <!--<el-tooltip content="删除" placement="top" manual v-if="item.type!='default'">-->
                <!--<div class="authority-item-del">-->
                  <!--<i class="iconfont icon-delete" @click.stop="delAuthMask(item)"></i>-->
                <!--</div>-->
              <!--</el-tooltip>-->
            <!--</div>-->
            <!--<div class="xiniao-popover" v-if="item.visible">-->
              <!--<p class="xiniao-popover-title"><i class="iconfont icon-warning-circle-fill xiniao-warning"></i>你确定删除这个身份嘛？</p>-->
              <!--<div style="text-align: right; margin: 0">-->
                <!--<el-button size="mini" @click="item.visible = false">取消</el-button>-->
                <!--<el-button type="primary" size="mini" @click="delAuth(item)">确定</el-button>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </template>
        <el-dialog
          :title="currentClickData.name+'的修改记录'"
          :visible.sync="dialogVisible"
          :modal-append-to-body='false'
          width="528px">
          <div class="time-height">
            <div class="line" v-for="item in recordList" v-if="recordList.length>0">
              <time-line :recordList="item" :recordType="'width:340px'"></time-line>
            </div>
            <div v-if="recordList.length==0" style="text-align: center;line-height: 400px">暂无修改记录</div>
          </div>
        </el-dialog>
        <el-dialog title="复制身份" :visible.sync="dialogFormVisible"  :modal-append-to-body='false' width="528px">
          <el-form class="authority-silder-form" :model="nameValidateForm" ref="nameValidateForm">
            <p class="copy-toptip">复制的身份将拥有“{{nameValidateForm.name}}”相同的权限</p>
            <el-form-item label="身份名："  prop="authName" :label-width="formLabelWidth" :rules="[{ required: true, message: '身份名不能为空'}]">
              <el-input v-model="nameValidateForm.authName" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="submitForm('nameValidateForm')" size="small">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    import TimeLine from "./TimeLine";
    export default {
        name: "authoritySilder",
        data(){
          return{
            visible2:true,
            currentCheckedData:{},
            currentClickData:{},
            dialogVisible:false,
            dialogFormVisible: false,
            newFormVisible:false,
            nameValidateForm:{
              authName:'',
              name:''
            },
            formLabelWidth: '90px',
            recordList: []
          }
        },
      props:{
        authoritylist:{
          type:Object,
          required:true
        },
      },
      components:{ TimeLine },
      methods:{
        //  删除身份弹窗
        delAuthMask(data){
          console.log(data);
          var _this = this;
          _this.request({
            method: 'post',
            url: '/p-innermgrweb/role/getUseRoleNum.do',
            param: {roleId:data.id},
            success: function (result) {
              console.log(result.result);
              if (result.code == 200) {
                if(result.result > 0){
                  _this.$confirm('身份“'+data.name+'”正在被'+result.result+'位员工使用，如果删除，这些员工将失去该身份，对日常工作产生影响。', '确定要删除这个身份嘛？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    confirmButtonClass:'el-button--danger is-plain',
                    center: false
                  }).then(() => {
                    _this.delAuth(data,result.result);
                  }).catch(() => {
                  });
                }else{
                  _this.$emit("del-authority",data);
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
        delAuth(data,num){
        //  删除身份
          var _this = this;
          _this.request({
            method: 'post',
            url: '/p-innermgrweb/role/delete.do',
            param: {roleId:data.id},
            success: function (result) {
              console.log(result.result);
              if (result.code == 200) {
                if(result.result){
                  data.visible = false;
                  _this.$emit("refresh-authlist",data.id);
                  if(num>0){
                    _this.$message({
                      message: '已删除身份“'+data.name+'”，请及时为原使用该身份的人添加新身份',
                      type: 'warning'
                    });
                  }
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
        //身份修改记录
        showUpdateRecord(data){
          var _this = this;
          _this.currentClickData = data;
          _this.request({
            method: 'post',
            url: '/p-innermgrweb/log/get_role_update_log_by_roleId.do',
            param: {roleId:data.id},
            success: function (result) {
              console.log(result.result);
              if (result.code == 200) {
                if(result.result){
                  _this.recordList = result.result;
                  _this.dialogVisible = true;
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
        //复制身份
        copyAuth(data){
          this.dialogFormVisible = true;
          this.currentClickData = data;
          this.nameValidateForm.name = data.name;
          this.nameValidateForm.authName = data.name+'的副本';
        },
        //提交复制身份表单
        submitForm(formName){
          var _this = this;
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.request({
                method: 'post',
                url: '/p-innermgrweb/role/copy.do',
                param: {roleId:_this.currentClickData.id,roleName:_this.nameValidateForm.authName},
                success: function (result) {
                  console.log(result.result);
                  if (result.code == 200) {
                    if(result.result){
                      _this.$emit("refresh-authlist");
                      _this.dialogFormVisible = false;
                      _this.nameValidateForm.authName = '';
                      _this.$message({
                        message: '成功复制身份',
                        type: 'success'
                      });
                    }
                  }
                },
                error: function (error) {
                  //服务器异常
                  console.log(error);
                  _this.$message.error('网络加载失败，去右上角菜单中刷新页面。')
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //选中身份
        checkAuthority(data){
          console.log(data);
          this.$emit('check-authority',data);
        }
      }
    }
</script>

<style scoped lang="scss">
  .authority-silder{
    .authority-add{
      width:240px;
      height:64px;
      border-radius: 4px;
      border: dashed 1px #d9d9d9;
      box-sizing: border-box;
      text-align: center;
      line-height:64px;
      font-size: 16px;
      color: #909090;
      margin-left:20px;
      cursor:pointer;
      i{
        margin-right:8px;
      }
    }
    .authority-add:hover{
      border: dashed 1px #F08D00;
      color: #F08D00;
    }
    .authority-silder-title{
      margin-top:24px;
      font-size: 14px;
      line-height: 1.57;
      color: #c0c0c0;
      margin-left:20px;
    }
    .authority-list{
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .authority-list-operation{
      position:absolute;
      top:12px;
      right:12px;
      i{
        cursor:pointer;
      }
    }
    .authority-list-item{
      width:240px;
      height:64px;
      font-size: 16px;
      color: #909090;
      margin-left:20px;

      box-sizing: border-box;
      margin-top:12px;
      cursor: pointer;
      position:relative;
      .authority-list-operation{
        top:20px;
        display:none;
        i{
          color:#F08D00;
        }
      }
    }
    .authority-list-items{
      width:100%;
      height:100%;
      background:#fff;
      box-sizing: border-box;
      padding-left:16px;
      padding-top:19px;
      border-radius: 4px;
      border: solid 1px #E8E8E8;
    }
    .authority-list-items:hover{
      border-left:4px solid #F08D00;
      .authority-list-operation{
        display:block;
      }
    }
    .authority-list-item-active{
      width:240px;
      /*height:120px;*/
      margin-left:20px;
      margin-top:12px;
      border-radius: 4px;
      padding:12px;
      box-sizing: border-box;
      background-blend-mode: normal, soft-light;
      background-image: linear-gradient(#F08D00, #F08D00), radial-gradient(circle at 98% 0, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.14));
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12);
      position:relative;
      color:#fafafa;
    }
    .name-overflow{
      width:160px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .authority-list-name{
      width:190px;
      font-size: 16px;
      line-height: 1.5;
    }

    .authority-list-time{
      opacity: 0.55;
      font-size: 12px;
      line-height: 1.67;
      color: #ffffff;
    }
    .authority-edit-records{
      opacity: 0.85;
      font-size: 14px;
      line-height: 1.57;
      margin-top:26px;
      text-decoration: underline;
      cursor: pointer;
    }
    .authority-item-del{
      display:inline-block;
      margin-left:16px;
      position:relative;
    }
    .xiniao-popover{
      width: 213px;
      background: #fff;
      min-width: 150px;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      padding: 16px;
      color: #606266;
      line-height: 1.57;
      font-size: 14px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      transform-origin: center bottom 0px;
      z-index: 2023;
      position: absolute;
      top: -108px;
      right:-3px;
      box-sizing: border-box;
    }
    .xiniao-popover:after{
      position: absolute;
      display: inline-block;
      bottom: -5px;
      right: 18px;
      width: 0;
      height: 0;
      content: '';
      border-style: solid;
      border-width: 5px;
      border-color: #fff #fff transparent transparent;
      transform: rotate(135deg);
      box-shadow: 2px -2px 2px rgba(0,0,0,.1);
    }
    .xiniao-popover-title{
      padding-bottom:12px;
      i{
        margin-right:8px;
      }
      .xiniao-warning{
        color:#faad14;
      }
    }
  }
  /*复制弹窗padding*/
  .authority-silder-form{
    padding:0 20px 0 16px!important;
  }
  .copy-toptip{
    font-size:14px;
    color:#c0c0c0;
    line-height:22px;
    margin-bottom:24px;
  }
  .dialog-footer{
    padding: 0 20px;
  }
  .time-height{
    height:400px;
    overflow-y: auto;
  }
</style>
