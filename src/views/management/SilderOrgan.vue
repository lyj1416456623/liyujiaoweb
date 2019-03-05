<template>
    <div class="slider-organ">
      <div class="menu-first" :class="menuFirstActive?'manage-menu-active':''" @click="topNodeClick(firstMenu)">顶上英语</div>
      <el-tree
        :data="menuListArr"
        :props="defaultProps"
        highlight-current
        check-on-click-node
        node-key = "id"
        ref="tree"
        accordion
        @node-click="handleNodeClick">
      </el-tree>
      <div class="menu-first" :class="menuLastActive?'manage-menu-active':''" @click="outNodeClick(outMenu)" v-if="outMenu.id">外部员工</div>
    </div>
</template>

<script>
    export default {
      name: "SilderOrgan",
      props:{
        menuList:{
          type:Array,
          required:true
        },
        firstMenu:{
          type:Object,
          required:true
        },
        outMenu:{
          type:Object,
          required:true
        },
        menuChange:{
          type:String,
          required:true
        },
        externalFlag:{
          type:Boolean,
          required:true
        }
      },
      data(){
        return{
          defaultProps:{
            children: 'child',
            label: 'name'
          },
          menuChangeData:this.menuChange,
          menuFirstActive:true,
          menuLastActive:false,
          menuListArr:this.menuList,
          external:this.externalFlag
        }
      },
      watch:{
        menuList(val,oldval){
          this.menuListArr = this.menuList;
        },
        menuChange(val,oldVal){
          console.log(val,oldVal,"ssss");
          if(this.externalFlag){
            this.menuFirstActive = false;
            this.menuLastActive = true;
            this.$refs.tree.setCurrentKey(null);
          }else{
            this.menuFirstActive = true;
            this.menuLastActive = false;
            this.$refs.tree.setCurrentKey(null);
          }
        }
      },
      mounted(){
        console.log(this.menuListArr);
      },
      methods:{
        handleNodeClick(data) {
          //内部员工点击事件
         // console.log(data);
          this.menuFirstActive = false;
          this.menuLastActive = false;
          this.$emit("check-menu",{data:data,isInnerEmployee:true});
        },
        //点击顶上英语
        topNodeClick(data){
          this.menuFirstActive = true;
          this.menuLastActive = false;
          this.$refs.tree.setCurrentKey(null);
          this.$emit("check-menu",{data:data,isInnerEmployee:true});
        },
        //点击外部员工
        outNodeClick(data){
          this.menuFirstActive = false;
          this.menuLastActive = true;
          this.$refs.tree.setCurrentKey(null);
          this.$emit("check-menu",{data:data,isInnerEmployee:false});
        }
      }
    }
</script>

<style scoped lang="scss">
  .slider-organ{
    margin: 20px 0;
    border-right:2px solid #e8e8e8;
  }
  .menu-first{
    height:48px;
    line-height:48px;
    padding-left:25px;
    font-size:16px;
    color:#262626;
    cursor:pointer;
  }
  .menu-first:hover{
    background:#fef6eb;
    color:#F08D00;
  }
  .manage-menu-active{
    background:#fef6eb;
    border-right:3px solid #F08D00;
    color:#F08D00;
  }

</style>
<style>
  .slider-organ .el-tree-node__content{
    height:48px;
    line-height:48px;
    font-size:14px;
  }
  .slider-organ .el-tree-node__content:hover{
    background:#fef6eb;
    color:#F08D00;
  }
  .slider-organ .el-tree-node__content > .el-tree-node__expand-icon{
    opacity: 0;
    padding:12px;
  }
  .slider-organ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background:#fef6eb;
    border-right:3px solid #F08D00;
    color:#F08D00;
  }
  .slider-organ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content:hover{
    background:#fef6eb;
    color:#F08D00;
  }
</style>
