<template>
    <el-form :model="form" ref="registrationForm" label-width="100px">
        <el-form-item label="完成日期：">
            <el-col :span="15">
                <span v-if="flag===1&&!isEdit">{{form.fulfill_time|fymd}}</span>
                <el-date-picker v-else
                                v-model="form.fulfill_time"
                                type="date"
                                placeholder="选择日期"
                                :disabled="form.status===7"
                                :picker-options="finishTime">
                </el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="账号简称：">
            <el-col :span="15">
                <span v-if="flag===1&&!isEdit">{{form.account_code}}</span>
                <el-input v-else
                          v-model="form.account_code" clearable
                          :disabled="form.status===7"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="账号ID：">
            <el-col :span="15">
                <span v-if="flag===1&&!isEdit">{{form.account_show_id}}</span>
                <el-input v-else
                          v-model="form.account_show_id" clearable
                          :disabled="form.status===7"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="" >
            <div v-if="flag===1&&!isEdit">
                <el-button type="primary" size="mini"
                           :disabled="form.status===7"
                           @click.native="isEdit=true">编辑</el-button>
            </div>
            <div v-else>
                <el-button type="primary" size="mini"
                           :disabled="form.status===7"
                           @click="submit">确 定</el-button>
                <el-button size="mini" :disabled="form.status===7"
                           @click="cancel">取 消</el-button>
            </div>

        </el-form-item>
    </el-form>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_update_registration,} from '@/api/account-apply';
    import datef from 'datef';
    export default {
        name: "registration-info",
        data() {
            return {
                finishTime:{
                    disabledDate: (time)=> {
                        return time.getTime()>Date.now();
                    }
                },
                isEdit:false
            }
        },
        mounted(){
            this.isEdit=false;
        },
        methods: {
            submit(){
                if(this.form.fulfill_time){
                    this.form.fulfill_time=datef('YYYY-MM-dd',this.form.fulfill_time);
                }
                this.$http(api_update_registration,this.form.id,{
                    fulfill_time:this.form.fulfill_time,
                    account_code:this.form.account_code,
                    account_show_id:this.form.account_show_id
                }).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.isEdit=false;
                    let status=this.form.status>res.data.status?this.form.status:res.data.status+1;
                    this.$set(this.form,'status',status);
                    this.$emit('close');
                }).catch( error =>{
                    this.isEdit=true;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            cancel(){
                if(!this.flag){
                    this.$set(this.form,'fulfill_time','');
                    this.$set(this.form,'account_code','');
                    this.$set(this.form,'account_show_id','');
                }else {
                    this.$set(this.form,'fulfill_time',this.everForm.fulfill_time);
                    this.$set(this.form,'account_code',this.everForm.account_code);
                    this.$set(this.form,'account_show_id',this.everForm.account_show_id);
                    if(this.flag===1){
                        this.isEdit=false;
                    }
                }
            }
        },
        props: {
            form:{},
            flag:{},
            everForm:{
                type:Object
            }
        },
    }
</script>

