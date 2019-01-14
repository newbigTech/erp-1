<template>
  <div>
    <el-form-item label="完成日期：">
      <el-date-picker
        v-model="editData.fulfill_time"
        type="date"
        placeholder="选择日期"
        class="inline date"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="账号简称：">
      <el-col :span="col11">
        <el-input type="text"  v-model="editData.account_code"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="账号ID：">
      <el-col :span="col11">
        <el-input type="text" v-model="editData.account_show_id"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label class="mt-lg">
      <el-col :span="col11">
        <request-button req-key="sureKey" @click="sure" >确定</request-button>
        <el-button @click.native="close" size="mini">取消</el-button>
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      col11: 11,
    }
  },
  methods: {
    sure() {
      if(!this.verification_data()){
          this.$reqKey('sureKey',false);
          return
      }
      this.$emit('result');
    },    
    close() {
      this.editData.fulfill_time = '';
      this.editData.account_code = '';
      this.editData.account_show_id = '';
    },
    verification_data() {
       if(!this.editData.fulfill_time) {
          this.$message({type:"warning", message:"请选择完成日期！"});
          return false
       }
       if(this.editData.account_code==='') {      
          this.$message({type:"warning", message:"请填写账号简称！"});
          return false
       }
       if(this.editData.account_show_id==='') {
          this.$message({type:"warning", message:"请填写账号ID！"});
          return false
       }       
       return true
    },
  },
  props: {
    editData: {
        type: Object,
        require: true
    }
  }
}
</script>

<style lang="">
  
</style>