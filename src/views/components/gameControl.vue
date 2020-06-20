<template>
  <div class="control">
    <div class="item">时间：<el-input v-model="time" disabled></el-input></div>
    <div class="item">雷量：<el-input v-model="bombCount" disabled></el-input></div>
    <el-button type="primary" @click="isShowDialog = true;">新建游戏</el-button>

    <el-dialog
      title="新建游戏"
      :visible.sync="isShowDialog"
      :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form_node">
        <el-form-item label="宽度" prop="width">
          <el-input v-model.trim="formData.width"></el-input>
        </el-form-item>
        <el-form-item label="高度" prop="height">
          <el-input v-model.trim="formData.height"></el-input>
        </el-form-item>
        <el-form-item label="雷数量" prop="bombCount">
          <el-input v-model.trim="formData.bombCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data(){//储存数据
    var validateWidthHeight = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (value !=null && reg.test(value)) {
        callback();
      }
      else {
        callback(new Error('请输入正整数'));
      }
    };
    var validateBombCount = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (value !=null && reg.test(value)) {
        if(value>this.formData.width*this.formData.height){
          callback(new Error('雷量必须小于方格数'));
        }
        else{
          callback();
        }
      }
      else {
        callback(new Error('请输入正整数'));
      }
    };
    return {
      isShowDialog: false,
      time: 0,
      count: 0,
      interVal:null,//计时器，作为标志对象

      formData: {
        width: '10',
        height: '10',
        bombCount: '10',
      },
      rules: {
        width: [
          { required: true, message: '请输入宽度', trigger: 'blur' },
          { validator: validateWidthHeight, trigger: 'blur' }
        ],
        height: [
          { required: true, message: '请输入高度', trigger: 'blur' },
          { validator: validateWidthHeight, trigger: 'blur' }
        ],
        bombCount: [
          { required: true, message: '请输入雷量', trigger: 'blur' },
          { validator: validateBombCount, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {//储存方法
    submit(){
      this.$refs.form_node.validate((valid) =>{//提交校验
        if(valid){//校验成功
          var data = JSON.parse(JSON.stringify(this.formData));//JSON.stringify将对象转为字符串;JSON.parse将字符串转为对象
          data.width = Number(data.width);
          data.height = Number(data.height);
          data.bombCount = Number(data.bombCount);
          // console.log(data.width,data.height,data.bombCount)
          this.$emit('startGame',data);//通过$emit实现子传父
          this.isShowDialog = false;
          this.$store.commit('updateBombCount',{ bombCount: data.bombCount});//讲自己设置的雷量做一个更新设置到显示上
        }
      });
    },
  },
  watch:{
    isStart(newval,oldval){
      if(newval){
        clearInterval(this.interVal);
        this.interVal=setInterval(()=>{
          this.time++;
        },1000);
      }
      else{
        clearInterval(this.interVal);
        this.time=0;
      }
    }
  },
  computed:{
    isStart(){
      return this.$store.getters.isStart;
    },
    bombCount(){
      return this.$store.getters.bombCount;
    }
  },
  components: {//注册组建
  },
}
</script>

<style lang="scss" scoped>
.control{
  display: flex;
  justify-content: center;
  .item{
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: 10px;
  }
}
/deep/{
  .el-input.is-disabled .el-input__inner{
    width: 100px;
  }
}
</style>
