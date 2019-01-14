<template>
    <el-form :model="form" ref="baseForm" label-width="100px" class="c-account-apply-base">
        <el-row>
            <el-col :span="12">
                <el-form-item label="发起日期：">
                    <span v-if="flag===1&&!isEdit">{{form.initiate_time|fymd}}</span>
                    <el-date-picker v-else
                                    v-model="form.initiate_time"
                                    type="date"
                                    placeholder="选择日期"
                                    :disabled="true">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="负责人：">
                    <span v-if="flag===1&&!isEdit">{{form.initiate_man_name}}</span>
                    <scroll-select v-else
                                   v-model="accounts" style="width:158px" class="inline"
                                   textAlign="left"
                                   ref="creater"
                                   :remote="urlCreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account"
                                   :disabled="form.status===4||form.status>5">
                    </scroll-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="平台：">
                    <span v-if="flag===1&&!isEdit">{{look_at_channel(form.channel_id)}}</span>
                    <select-remote v-else
                                   v-model="form.channel_id"
                                   :all="false"
                                   :disabled="form.status===4||form.status>5"
                                   :remote="channel_remote"
                                   @load="load"
                                   @change="change_channel"
                                   @clear="clear_channel">
                    </select-remote>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="站点：">
                    <span v-if="flag===1&&!isEdit" v-text="form.site_code.join(',')"></span>
                    <el-select v-else filterable
                               clearable multiple
                               v-model="form.site_code"
                               :disabled="!siteOptions.length||form.status===4||form.status>5"
                               class="inline">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="品类：">
            <span v-if="flag===1&&!isEdit">{{form.breed}}</span>
            <el-input v-else
                      v-model="form.breed" clearable
                      :disabled="form.status===4||form.status>5"></el-input>
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司名称：">
                    <span v-if="flag===1&&!isEdit">{{companyName}}</span>
                    <el-select v-else
                               v-model="form.company_id"
                               :disabled="!form.channel_id||form.status===4||form.status>5"
                               filterable clearable
                               placeholder="请选择"
                               @change="get_company_data"
                               @clear="clear_company">
                        <el-option v-for="item in companyData"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="营业执照图片：">
                    <span v-if="(!tempBusinessImage.length&&flag!==1)||(!tempBusinessImage.length&&flag===1&&isEdit)">
                         <i class="el-icon-upload2"></i>上传附件
                    </span>
                    <span v-if="!tempBusinessImage.length&&flag===1&&!isEdit">
                        没有图片
                    </span>
                    <upload-img v-if="tempBusinessImage.length"
                                :images="tempBusinessImage"
                                :edit="false">
                    </upload-img>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司注册号：">
                    <span v-if="flag===1&&!isEdit">{{form.company_registration_number}}</span>
                    <el-input v-else
                              v-model="form.company_registration_number"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="注册日期：">
                    <span v-if="flag===1&&!isEdit">{{form.register_time|fymd}}</span>
                    <el-date-picker v-else
                                    v-model="form.register_time"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="registerTime"
                                    :disabled="true">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司类型：">
                    <span v-if="flag===1&&!isEdit">{{form.company_type}}</span>
                    <el-input v-else
                              v-model="form.company_type"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="公司成立时间：">
                    <span v-if="flag===1&&!isEdit">{{form.company_time|fymd}}</span>
                    <el-date-picker v-else
                                    v-model="form.company_time"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="registerTime"
                                    :disabled="true">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公司地址+邮编：">
                    <span v-if="flag===1&&!isEdit">{{form.company_address_zip}}</span>
                    <el-input v-else
                              v-model="form.company_address_zip"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="VAT：">
                    <span v-if="flag===1&&!isEdit">{{form.vat}}</span>
                    <el-input v-else
                              v-model="form.vat"
                              type="number"
                              :disabled="true">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="法人姓名：">
                    <span v-if="flag===1&&!isEdit">{{form.corporation}}</span>
                    <el-input v-else
                              v-model="form.corporation"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="电话号码：">
                    <span v-if="flag===1&&!isEdit">{{form.phone}}</span>
                    <el-input v-else
                              v-model="form.phone"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="法人身份证号：">
                    <span v-if="flag===1&&!isEdit">{{form.corporation_id}}</span>
                    <el-input v-else
                              v-model="form.corporation_id"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="法人地址+邮编：">
                    <span v-if="flag===1&&!isEdit">{{form.corporation_address_zip}}</span>
                    <el-input v-else
                              v-model="form.corporation_address_zip"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="身份证正面照：">
                    <span v-if="(!tempIDFrontImage.length&&flag!==1)||(!tempIDFrontImage.length&&flag===1&&isEdit)">
                         <i class="el-icon-upload2"></i>上传附件
                    </span>
                    <span v-if="!tempIDFrontImage.length&&flag===1&&!isEdit">
                        没有图片
                    </span>
                    <upload-img v-if="tempIDFrontImage.length"
                            :images="tempIDFrontImage"
                                :edit="false">
                    </upload-img>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="身份证反面照：">
                    <span v-if="(!tempIDBackImage.length&&flag!==1)||(!tempIDBackImage.length&&flag===1&&isEdit)">
                         <i class="el-icon-upload2"></i>上传附件
                    </span>
                    <span v-if="!tempIDBackImage.length&&flag===1&&!isEdit">没有图片</span>
                    <upload-img v-if="tempIDBackImage.length"
                            :images="tempIDBackImage"
                                :edit="false">
                    </upload-img>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="">
            <template v-if="flag===1&&!isEdit">
                <el-button type="primary" size="mini"
                           :disabled="form.status===4||form.status>5"
                           @click="isEdit=true">编 辑</el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="mini"
                           :disabled="form.status===4||form.status>5"
                           @click="submit">确 定</el-button>
                <el-button size="mini" :disabled="form.status===4||form.status>5"
                           @click="cancel">取 消</el-button>
            </template>
        </el-form-item>
    </el-form>
</template>

<style lang="stylus">
    .c-account-apply-base{
        .el-select__tags{
            height: 50px!important;
            max-width :300px!important;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>

<script>
    import selectRemote from '@/components/select-remote';
    import scrollSelect from '@/components/scroll-select.vue';
    import uploadImg from '@/view/base/company-information/upload-img';
    import datef from 'datef';
    import {api_get_channel, api_account_list} from  '@/api/report-channel';
    import {api_get_company_name,api_get_company_data} from '@/api/account-information';
    import {api_add_account_info,api_update_base_info,} from '@/api/account-apply';
    export default {
        name: "base-info",
        data() {
            return {
                urlCreater:'get|user',
                startTime:{
                    disabledDate: (time)=> {
                        return time.getTime() < (Date.now()-24*60*60*1000);
                    }
                },
                channelList:[],
                siteOptions:[],
                registerTime:{
                    disabledDate: (time)=> {
                        return time.getTime()>Date.now();
                    }
                },
                companyData:[],
                tempBusinessImage:this.businessImage,
                tempIDFrontImage:this.IDFrontImage,
                tempIDBackImage:this.IDBackImage,
                isEdit:false
            }
        },
        mounted(){
            if(this.flag){
                this.form.channel_id&&this.change_channel(this.form.channel_id);
                this.form.company_id&&this.get_company_data(this.form.company_id);
                this.flag===1&&this.channel_remote();
            }
        },
        computed: {
            companyName(){
                if(this.companyData.length){
                    let find = this.companyData.find(row=>row.value===this.form.company_id);
                    if(find){
                        return find.label;
                    }else{
                        return '未找到对应公司名称';
                    }
                }
            },
            accounts:{
                get(){
                    return {label:this.form.initiate_man_name,value:this.form.initiate_man};
                },
                set(val){
                    this.form.initiate_man_name = val.label;
                    this.form.initiate_man = val.value;
                }
            },
        },
        methods: {
            fix_params_account({page,pageSize,keyword}){//账号参数
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:"department_id",
                    snText:333,
                    status:1
                };
            },
            fix_result_account(res){  //账号结果
                console.log(res,'fuzeren');
                return {
                    options: res.data.map(row => {
                        return {label: row.realname,value: row.id}
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    if(!!callback){
                        callback(res);
                    }else{
                        this.channelList = res;
                    }
                }).catch(code=>{
                    console.log(code);
                });
            },
            load(list){
                this.channelList = list;
            },
            look_at_channel(channel){
                if(this.channelList.length){
                    let find =this.channelList.find(row=>row.value===channel);
                    if(find){
                        return find.label;
                    }else {
                        return '未找到对应平台';
                    }
                }
            },
            change_channel(channel){
                this.siteOptions=[];
                this.get_site(channel);
                this.$http(api_get_company_name,{channel_id:channel}).then(res=>{
                    this.companyData=res.data.map(row=>{
                        return {label:row.company,value:row.id};
                    });
                }).catch( error =>{
                    console.log(error);
                });
            },
            clear_channel(){
                this.siteOptions=[];
                this.form.company_id='';
                this.clear_company();
            },
            get_site(channel_id){
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.siteOptions=res.site;
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_company_data(company_id){
                this.$http(api_get_company_data,company_id).then(res=>{
                    this.$set(this.form,'company_registration_number',res.company_registration_number);
                    this.$set(this.form,'corporation',res.corporation);
                    this.$set(this.form,'corporation_identification',res.corporation_id);
                    this.$set(this.form,'vat',res.vat);
                    this.$set(this.form,'company_time',res.company_time?res.company_time*1000:'');
                    this.$set(this.form,'register_time',res.register_time?res.register_time*1000:'');
                    this.$set(this.form,'company_address',res.company_address_zip);
                    this.$set(this.form,'phone',res.phone);
                    this.$set(this.form,'company_type',res.company_type);
                    this.$set(this,'tempBusinessImage',res.charter_url?[{name:res.charter_url}]:[]);
                    this.$set(this,'tempIDFrontImage',res.corporation_id_front?[{name:res.corporation_id_front}]:[]);
                    this.$set(this,'tempIDBackImage',res.corporation_id_contrary?[{name:res.corporation_id_contrary}]:[]);
                }).catch( error =>{
                    console.log(error);
                });
            },
            clear_company(){
                this.$set(this.form,'company_registration_number','');
                this.$set(this.form,'corporation','');
                this.$set(this.form,'corporation_identification','');
                this.$set(this.form,'company_registration_number','');
                this.$set(this.form,'phone','');
                this.$set(this.form,'company_type','');
                this.$set(this.form,'vat','');
                this.$set(this.form,'register_time','');
                this.$set(this.form,'company_time','');
                this.$set(this.form,'company_address','');
                this.$set(this,'tempBusinessImage',[]);
                this.$set(this,'tempIDFrontImage',[]);
                this.$set(this,'tempIDBackImage',[]);
            },
            cancel(){
                if(!this.flag){
                    this.$set(this.form,'initiate_man',0);
                    this.$set(this.form,'initiate_man_name','');
                    this.$set(this.form,'channel_id','');
                    this.$set(this.form,'site_code','');
                    this.$set(this.form,'company_id','');
                    this.$set(this.form,'breed','');
                    this.clear_company();
                }else{
                    this.$set(this.form,'initiate_man_name',this.everForm.initiate_man_name);
                    this.$set(this.form,'initiate_man',this.everForm.initiate_man);
                    this.$set(this.form,'channel_id',this.everForm.channel_id);
                    this.$set(this.form,'site_code',this.everForm.site_code);
                    this.$set(this.form,'company_id',this.everForm.company_id);
                    this.$set(this.form,'breed',this.everForm.breed);
                    this.get_company_data(this.everForm.company_id);
                    if(this.flag===1){
                        this.isEdit=false;
                    }
                }
            },
            submit(){
                if(this.form.initiate_time){
                    this.form.initiate_time=datef('YYYY-MM-dd',this.form.initiate_time);
                }
                console.log(this.form.status,'iii');
                let param={
                    initiate_time:this.form.initiate_time,
                    initiate_man:this.form.initiate_man,
                    channel_id:this.form.channel_id,
                    site_code:this.form.site_code,
                    breed:this.form.breed,
                    company_id:this.form.company_id
                };
                if(!this.flag&&!this.form.id){
                    this.$http(api_add_account_info,param).then(res=>{
                        this.$message({type:'success',message:res.message||res});
                        let status=this.form.status>res.data.status?this.form.status:res.data.status+1;
                        this.$set(this.form,'status',status);
                        this.$set(this.form,'id',res.data.id);
                        this.$emit('base-submit');
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else{
                    this.$http(api_update_base_info,this.form.id,param).then(res=>{
                        this.$message({type:'success',message:res.message||res});
                        if(this.flag===1){
                            this.baseEdit=false;
                        }
                    }).catch( error =>{
                        this.baseEdit=true;
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }
            }
        },
        props: {
            form:{
                type:Object,
                required:true
            },
            businessImage:{
                type:Array
            },
            IDFrontImage:{
                type:Array
            },
            IDBackImage:{
                type:Array
            },
            flag:{},
            everForm:{
                type:Object
            },
        },
        components: {
            selectRemote,scrollSelect,uploadImg
        },
    }
</script>

