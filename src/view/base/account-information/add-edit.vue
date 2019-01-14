<template>
    <div>
        <page-dialog :title="action.title"
                     @open="open"
                     v-model="visible"
                     size="large"
                     class="p-account-information"
                     :close-on-click-modal="false">
            <el-form label-width="200px" :rules="rules" :model="editData" ref="editForm">
                <div class="account-title">基本资料</div>
                <el-form-item label="平台：" required prop="channel_id">
                    <select-remote v-model="editData.channel_id"
                                   @load="load"
                                   :all="false"
                                   :disabled="action.value==='edit'"
                                   @change="change_channel"
                                   :remote="channel_remote"
                                   @clear="clear">
                    </select-remote>
                </el-form-item>
                <el-form-item label="站点：" :required="isRequired" prop="site_code">
                    <el-col :span="col11">
                        <el-select :disabled="!siteOptions.length"
                                   filterable clearable multiple
                                   placeholder="请选择/可以多选"
                                   v-model="editData.site_code">
                            <el-option v-for="item in siteOptions"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="主账号全称：" prop="account_name" required>
                    <el-col :span="col11">
                        <el-input type="text" v-model="editData.account_name" :disabled="action.value==='edit'"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="主账号密码：" prop="password" required>
                    <el-col :span="col11">
                        <el-input type="password"
                                  ref="account"
                                  v-model="editData.password"
                                  :disabled="!isAdd&&isShowPassword">
                        </el-input>
                    </el-col>
                    <img src="../../../assets/eye.svg"
                         alt=""
                         v-if="isAdd"
                         @mouseup="backPassword('account')"
                         @mousedown="lookPassword('account')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                               size="mini"
                               class="ml-sm"
                               v-if="!isAdd"
                               :disabled="accountDisabled"
                               @click="viewPassword('account')">显示密码
                    </el-button>
                </el-form-item>
                <el-form-item label="子账号全称：">
                    <el-col :span="col11">
                        <el-input type="text" v-model="editData.account_name_minor"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="子账号密码：">
                    <el-col :span="col11">
                        <el-input type="password"
                                  ref="account_minor"
                                  v-model="editData.password_minor"
                                  :disabled="!isAdd && isShowMinorPassword">
                        </el-input>
                    </el-col>
                    <img src="../../../assets/eye.svg"
                         alt=""
                         v-if="isAdd"
                         @mouseup="backPassword('account_minor')"
                         @mousedown="lookPassword('account_minor')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                               size="mini"
                               class="ml-sm"
                               v-if="!isAdd"
                               :disabled="minorAccountDisabled"
                               @click="viewPassword('account_minor')">显示密码
                    </el-button>
                </el-form-item>

                <el-form-item label="账号简称：" required prop="account_code">
                    <el-col :span="col11">
                        <el-input type="text"
                                  v-model="editData.account_code">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="服务器IP地址：" required>
                    <el-input class="inline" v-model="serverIp" :disabled="true"></el-input>
                    <el-button type="primary" size="mini" class="inline ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                    <div v-if="editData.channel_id !== 0 && alreadyBind.length > 0 && !isAdd">
                        <span>该服务器已绑定{{channelName}}账号：</span>
                        <span v-for="(item, index) in alreadyBind"
                              :key="index"
                              class="mr-xs error">
                                {{item.account_code}}
                            </span>
                    </div>
                </el-form-item>
                <el-form-item label="手机号：" required prop="phone">
                    <el-col :span="col11">
                        <el-input v-model="editData.phone"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="主账号邮箱：" required prop="email">
                    <el-col :span="col11">
                        <el-input v-model="editData.email"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="邮箱密码：" required prop="email_password">
                    <el-col :span="col11">
                        <el-input v-model="editData.email_password"
                                  ref="email"
                                  type="password"
                                  :disabled="!isAdd && isShowEmailPassword">
                        </el-input>
                    </el-col>
                    <span @mouseup="backPassword('email')"
                          @mousedown="lookPassword('email')">
                                <img src="../../../assets/eye.svg"
                                     alt=""
                                     v-if="isAdd"
                                     style="vertical-align: middle;width: 20px;height: 20px;">
                            </span>
                    <el-button type="primary"
                               size="mini"
                               v-if="!isAdd"
                               class="ml-sm"
                               :disabled="emailDisabled"
                               @click="viewPassword('email')">显示密码
                    </el-button>
                    <!--</el-col>-->
                </el-form-item>
                <!--邮件设置-->
                <div class="account-title">邮件设置</div>
                <el-form-item label="邮件服务器地址：">
                    <el-col :span="col11">
                        <el-select v-model="editData.email_server_id">
                            <el-option v-for="item in emailServer"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <div  style="font-size:1.4rem">
                            <i class="el-icon-plus ml-sm" @click="add_email_server"></i>
                            <i class="el-icon-edit ml-sm" @click="edit_email_server"></i>
                            <i class="el-icon-delete ml-sm" @click="delete_email_server"></i>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="接收邮件：">
                    <el-radio v-model="editData.email_allowed_receive" :label="0">启用</el-radio>
                    <el-radio v-model="editData.email_allowed_receive" :label="1">停用</el-radio>
                </el-form-item>
                <el-form-item label="发送邮件：">
                    <el-radio v-model="editData.email_allowed_send" :label="0">启用</el-radio>
                    <el-radio v-model="editData.email_allowed_send" :label="1">停用</el-radio>
                </el-form-item>
                <!--公司资料-->
                <div class="account-title">公司资料</div>
                <el-form-item label="公司名称：" required prop="company_id">
                    <el-col :span="col11">
                        <el-select v-model="editData.company_id"
                                   :disabled="!editData.channel_id||action.value==='edit'"
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
                    </el-col>
                    <el-button type="primary" size="mini" class="ml-sm inline"
                               :disabled="!editData.channel_id" @click.native="add_company">新增
                    </el-button>
                </el-form-item>
                <el-form-item label="公司注册号：" prop="company_registration_number">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  v-model="editData.company_registration_number"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="公司法人：">
                    <el-col :span="col11">
                        <el-input :disabled="true" v-model="editData.corporation"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="法人身份证号：" prop="corporation_identification">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  v-model="editData.corporation_identification"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="VAT：">
                    <el-col :span="col11">
                        <el-input :disabled="true" v-model="editData.vat">
                            <span slot="append">%</span>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="公司成立时间：">
                    <el-date-picker :disabled="true"
                                    v-model="editData.company_time"
                                    type="date"
                                    placeholder="选择日期"
                                    class="inline date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="公司注册地址：">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  type="textarea"
                                  v-model="editData.company_address"></el-input>
                    </el-col>
                </el-form-item>
                <el-row class="account-title">账号信息</el-row>
                <el-form-item label="信用卡：">
                    <el-col :span="col11">
                        <el-input v-model="editData.credit_card" ></el-input>
                    </el-col>
                </el-form-item>
                <el-row v-for="(row,index) in editData.collection_msg" :key="index">
                    <el-form-item :label="`收款账号${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_account"></el-input>
                        </el-col>
                        <el-button type="primary" size="mini" class="ml-sm inline"
                                   v-if="index===0" @click.native="add">新增
                        </el-button>
                        <span v-else style="font-size: 20px;"
                              @click="del(row,index)"><i class="el-icon-delete"></i></span>
                    </el-form-item>
                    <el-form-item :label="`收款账号平台${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_type"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="`收款账号邮箱${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_email"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="`收款方${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_user"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <!--账号创建人-->
                <div class="account-title">账号创建人</div>
                <el-form-item label="账号创建人：" required prop="account_creator">
                    <scroll-select v-model="accounts" style="width:158px" class="inline"
                                   textAlign="left"
                                   ref="creater"
                                   :remote="urlcreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account"
                                   :disabled="action.value==='edit'">
                    </scroll-select>
                </el-form-item>
                <el-form-item label="账号创建时间：" required prop="account_create_time">
                    <el-date-picker
                            v-model="editData.account_create_time"
                            type="date"
                            :disabled="action.value==='edit'"
                            placeholder="选择日期"
                            class="inline date"
                            :picker-options="finishTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="当前账号状态：">
                    <el-radio-group v-model="editData.status" disabled>
                        <el-radio v-for="item in statusOption"
                                  :key="item.status"
                                  :label="item.status">
                            {{item.remark}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button req-key="sureKey" @click="sure">确定</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
        <add-email-server v-model="emailServerDialog"
                          :cur-page="curPage"
                          :id="emailServerId"
                          @update="update_email_server"
                          @submit='submit_email_server'></add-email-server>
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
        <add-look-edit v-model="addCompanyShow" :title="title"
                       :flag="0" :id="0" :form="form" @refresh="refresh_company_data">
        </add-look-edit>
    </div>
</template>
<style lang="stylus">
    .p-account-information{
        .dialog__body{
            /*max-height:770px !important;*/
        }
        .el-form-item{
            margin-bottom: 5px;
        }
        .account-title{
            height: 20px;
            line-height: 20px;
            margin-bottom: 6px;
            padding: 0 10px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
        }
        .inputNomargin {
            .el-select__input {
                width: 1px !important;
                margin-left: 0 !important;
            }
        }
        .more-select{
            .el-select__tags {
                height: 30px !important;
                max-width: 359px !important;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
        .el-form-item__error{
            position: static;
            display: inline-block;
            line-height: 26px;
            margin-left: 10px;
        }
        .el-select__tags{
            height: 50px!important;
            max-width: 359px!important;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list,api_email_server,api_delete_email_server} from  '@/api/report-channel';
    import {api_add_account, api_updata_account, api_get_account_status, api_get,
        api_get_already,api_get_company_name,api_get_company_data} from '@/api/account-information'
    import {email,chinese} from '../../../define/validator_reg'
    import {mapActions,mapGetters} from 'vuex';
    import addLookEdit from '@/view/base/company-information/add-look-edit';
    import datef from 'datef'
    export default {
        data(){
            var checkEmail = (rule, value, callback) => {
                if(!value){
                    callback(new Error('请输入邮箱'));
                } else if (!email.test(value)) {
                    callback(new Error('请输入正确的邮箱'));
                } else {
                    callback();
                }
            };
            let checkChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("不允许出现中文！")):callback();
                }else{
                    callback();
                }
            };
            return {
                rules: {
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    site_code: [
                        { required: this.isRequired, message: '请选择站点', trigger: 'change', type:'array'}
                    ],
                    account_code: [
                        { required: true, message: '请填写账号简称', trigger: 'blur'}
                    ],
                    account_name: [
                        { required: true, message: '请填写账号全称', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请填写账号密码', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '请填写手机号码', trigger: 'blur'}
                    ],
                    email: [
                        { validator: checkEmail, required: true, trigger: 'blur'}
                    ],
                    company_registration_number: [
                        { validator: checkChinese, trigger: 'blur'}
                    ],
                    corporation_identification: [
                        { validator: checkChinese, trigger: 'blur'}
                    ],
                    email_password: [
                        { required: true, message: '请填写邮箱密码', trigger: 'blur'}
                    ],
                    company_id: [
                        { required: true, message: '请填写公司名称', trigger: 'change',type:'number'}
                    ],
                    account_creator: [
                        { required: true, message: '请选择账号创建人', trigger: 'change', type:'number'}
                    ],
                    account_create_time: [
                        { required: true, message: '请选择账号创建日期', trigger: 'change',}
                    ]
                },
                col11:11,
                channelList:[],
                channelName:'',
                siteOptions:[],
                statusOption:[],
                paypalOption:[],
                visible: false,
                retype_visible:false,
                retypeData:{
                    type:'',
                    account_id:'',
                    password:''
                },
                urlcreater:'get|user',
                urlip:'get|servers',
                passwordUrl:'get|account-basics/password',
                isShowEmailPassword:true,
                isShowPassword:true,
                isShowMinorPassword:true,
                oldPassword:'',
                oldEmailPassword:'',
                alreadyBind:[],
                emailServer:[],
                emailServerDialog:false,
                curPage:'',
                emailServerId:0,
                dialogShow: false,
                companyData:[],
                addCompanyShow:false,
                title:'添加公司资料',
                form:{},
                tempChannel:0,
                isAddCompany:false,
                tempServerIpId:this.serverIpId,
                accountDisabled:false,
                minorAccountDisabled:false,
                emailDisabled:false,
                finishTime:{
                    disabledDate: (time)=> {
                        return time.getTime()>Date.now();
                    }
                },
            }
        },
        mounted(){
            this.get_status();
            this.get_paypal();
            this.get_email_server();
        },
        methods: {
            clear(){
                this.editData.site_code=[];
                this.editData.company_id=' ';
                this.clear_company();
            },
            add(){
                let obj={
                    collection_account:'',
                    collection_type:'',
                    collection_email:'',
                    collection_user:''
                };
                this.editData.collection_msg.push(obj);
            },
            del(row,index){
                this.editData.collection_msg.splice(index,1);
            },
            change_channel(channel,company){
                this.get_site(channel);
                this.$http(api_get_company_name,{channel_id:channel}).then(res=>{
                    this.companyData=res.data.map(row=>{
                        return {label:row.company,value:row.id};
                    });
                    this.$set(this,'tempChannel',channel);
                    let find=this.companyData.find(row=>row.label===company);
                    if(this.isAddCompany&&company&&find){
                        this.editData.company_id=find.value;
                    }
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_company_data(id){
                if(id==='')return;
                let type={}.toString.call(id),param;
                if(type==='[object String]'){
                    let find=this.companyData.find(row=>row.label===id);
                    if(find){
                        param=find.value;
                    }else {
                        return;
                    }
                }else{
                    param=id;
                }
                this.$http(api_get_company_data,param).then(res=>{
                    this.$set(this.editData,'company_registration_number',res.company_registration_number);
                    this.$set(this.editData,'corporation',res.corporation);
                    this.$set(this.editData,'corporation_identification',res.corporation_id);
                    this.$set(this.editData,'company_registration_number',res.company_registration_number);
                    this.$set(this.editData,'vat',res.vat);
                    this.$set(this.editData,'company_time',res.company_time?res.company_time*1000:'');
                    this.$set(this.editData,'company_address',res.company_address_zip);
                    let account=(res.collection_account&&res.collection_account.length)?res.collection_account.filter(row=>row!==''):[];
                    this.$set(this.editData,'collection_account',account);
                    this.$set(this,'paypalOption',account);
                    this.clear=false;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            clear_company(){
                this.$set(this.editData,'company_registration_number','');
                this.$set(this.editData,'corporation','');
                this.$set(this.editData,'corporation_identification','');
                this.$set(this.editData,'company_registration_number','');
                this.$set(this.editData,'vat','');
                this.$set(this.editData,'company_time','');
                this.$set(this.editData,'company_address','');
                this.$set(this.editData,'collection_account',[]);
            },
            add_company(){
                this.form={
                    company:'',
                    charter_url:'',
                    company_type:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_id:'',
                    corporation_id_front:'',
                    corporation_id_contrary:'',
                    company_time:'',
                    company_address_zip:'',
                    corporation_address_zip:'',
                    status:0,
                    channel:[],
                    id:0,
                    log:[],
                    collection_account:'',
                    credit_card:'',
                    vat:0
                };
                this.addCompanyShow=true;
                this.isAddCompany=false;
            },
            refresh_company_data(company){
                this.isAddCompany=true;
                this.change_channel(this.tempChannel,company.company);
            },
            submit_email_server(data){
                let newData = {
                    label:data.imap_url,
                    value:data.id
                };
                this.emailServer.push(newData);
                this.editData.email_server_id = newData.value
            },
            update_email_server(data,id){
                let find = this.emailServer.find(row=>row.value===Number(id));
                if(find)find.label = data.imap_url;
            },
            add_email_server(){
                this.emailServerDialog = true;
                this.curPage = 'add'
            },
            edit_email_server(){
                this.emailServerId = this.editData.email_server_id;
                if(!this.emailServerId)return this.$message({type:'warning',message:'请先选择一个邮件服务器地址'});
                this.emailServerDialog = true;
                this.curPage = 'edit';
            },
            delete_email_server(){
                if(!this.editData.email_server_id)return this.$message({type:'warning',message:'请先选择一个邮件服务器地址'});
                this.$confirm('此操作将删除当前', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_email_server,this.editData.email_server_id,this.editData.id||0).then(res => {
                        this.$message({type:'success',message:res.message||res})
                        let index = this.emailServer.findIndex(row=>row.value===this.editData.email_server_id);
                        if(index>-1){
                            this.emailServer.splice(index,1);
                            this.editData.email_server_id = '';
                        }

                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                        console.log(code);
                    })
                }).catch(() => {

                });
            },
            get_email_server(){
                this.$http(api_email_server,{page:1,pageSize:999999999}).then(res => {
                    this.emailServer = res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.imap_url
                        }
                    });
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            open(){
                if(this.isAdd){
                    this.rules.account_create_time[0].type = 'object';
                }else {
                    this.rules.account_create_time[0].type = 'number';
                }
                this.isShowPassword = true;
                this.isShowEmailPassword = true;
                this.isShowMinorPassword=true;
                this.accountDisabled=false;
                this.minorAccountDisabled=false;
                this.emailDisabled=false;
                this.oldPassword = window.clone(this.editData.password);
                this.oldEmailPassword = window.clone(this.editData.email_password);
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            load(list){
                this.channelList = list;
            },
            get_site(channel_id){
                this.siteOptions = [];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.siteOptions = [...res.site];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                // if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_status(){
                this.$http(api_get_account_status).then(res=>{
                    this.statusOption = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_paypal(){
                let param = {
                    page: 1,
                    pageSize: 1000,
                    is_invalid:0,
                    snType:'account_name',
                    snDate:'create_date'
                };
                this.$http(api_get, param).then(res=>{
                    this.paypalOption = res.data.map(row=>{
                        return {
                            label:row.account_name,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            lookPassword(type){
                if(this.action.value === 'add'){
                    this.$refs[type].$refs.input.type = 'text';
                }
            },
            backPassword(type){
                if(this.action.value === 'add') {
                    this.$refs[type].$refs.input.type = 'password';
                }
            },
            viewPassword(type){
                if(!this.isAdd){
                    this.retypeData = {
                        account_id: this.editData.id,
                        type:type
                    };
                    this.retype_visible = true;
                }
            },
            transferTime(param, timeName){
                let data = clone(param);
                if(this.action.value === 'add'){
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName].getTime()/1000);
                    }else {
                        data[timeName]='';
                    }
                } else {
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName]/1000);
                    }else {
                        data[timeName]='';
                    }
                }
                return data[timeName];
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            sure(){
                console.log(this.editData.account_create_time);
                if(this.editData.account_create_time&&this.action.value === 'add'){
                    this.editData.account_create_time=new Date(this.editData.account_create_time);
                }
                if(typeof this.editData.account_create_time!=='number'&&this.action.value === 'edit'){
                    this.editData.account_create_time=new Date(this.editData.account_create_time).getTime();
                }
                console.log(this.editData,'this.editData',this.editData.account_create_time);
                this.$refs.editForm.validate((valid) => {
                    if (valid) {

                        let minorAccount1=!!this.editData.account_name_minor&&!this.editData.password_minor;
                        let minorAccount2=!this.editData.account_name_minor&&!!this.editData.password_minor;
                        console.log(minorAccount1,minorAccount2,'minorAccount1');
                        if(minorAccount1||minorAccount2){
                            return this.$message({type:'warning',message:'子账号全称和子账号密码两项中有一项未填写！ 必须两项全填或全不填'})
                        }
                        if(this.editData.account_name_minor===this.editData.account_name){
                            return this.$message({type:'warning',message:'子账号全称不可和主账号全称相同！'})
                        }
                        if(this.editData.account_create_time){
                            this.editData.account_create_time=(datef('YYYY-MM-dd',this.editData.account_create_time));
                        }
                        let mess=this.editData.collection_msg.filter(row=>{
                            let isEmpty =row.collection_account===''&&row.collection_type===''&&row.collection_email===''
                                &&row.collection_user==='';
                            return !isEmpty;
                        });
                        if(!mess.length){
                            mess=[{collection_account:'',collection_type:'',collection_email:'',collection_user:''}];
                        }
                        // this.editData.site_code.length>0?(this.editData.site_code=this.editData.site_code.join(',')):(this.editData.site_code='');
                        let param={
                            channel_id:this.editData.channel_id,
                            site_code:this.editData.site_code,
                            account_name:this.editData.account_name,
                            password:this.editData.password,
                            account_name_minor:this.editData.account_name_minor?this.editData.account_name_minor:'',
                            password_minor:this.editData.password_minor?this.editData.password_minor:'',
                            account_code:this.editData.account_code,
                            server_id:this.tempServerIpId,
                            phone:this.editData.phone,
                            email:this.editData.email,
                            email_password:this.editData.email_password,
                            email_server_id:this.editData.email_server_id,
                            email_allowed_receive:this.editData.email_allowed_receive,
                            email_allowed_send:this.editData.email_allowed_send,
                            company_id:this.editData.company_id,
                            account_creator:this.editData.account_creator,
                            account_create_time:this.editData.account_create_time,
                            status:this.editData.status,
                            collection_msg:mess,
                            credit_card:this.editData.credit_card
                        };
                        // this.editData.site_code.length>0?(data.site_code = data.site_code.join(',')):(data.site_code = '');
                        // delete data.id;
                        // data.company_time = this.transferTime(this.editData, 'company_time');
                        // data.account_create_time = this.transferTime(this.editData, 'account_create_time');
                        console.log('test',param);
                        if(this.action.value === 'add'){
                            this.$http(api_add_account, param).then(res=>{
                                this.$emit('submit',res);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        } else {
                            // if(data.password === this.oldPassword){
                            //     delete data.password;
                            // }
                            // if(data.email_password === this.oldEmailPassword){
                            //     delete data.email_password;
                            // }
                            this.$http(api_updata_account, this.editData.id, param).then(res=>{
                                this.$emit('submit',res,this.editData.id);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        }
                    } else {
                        this.$reqKey('sureKey',false);
                        this.$message({type:"error", message:"信息未填写完整！"});
                    }
                });
            },
            //选择服务器
            choose_server(obj){
                this.$emit('choose-server',obj.ip);
                this.editData.server_id = obj.id;
                this.tempServerIpId=obj.id;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'account_minor'){
                    this.isShowMinorPassword= false;
                    this.editData.password_minor = password;
                    this.minorAccountDisabled=true;
                } else if(type==='account'){
                    this.isShowPassword = false;
                    this.editData.password = password;
                    this.accountDisabled=true;
                }else {
                    this.isShowEmailPassword = false;
                    this.editData.email_password = password;
                    this.emailDisabled=true;
                }
            },
            get_alreadyBind(){
                if(!!this.editData.server_id && this.editData.channel_id !== 0){
                    let data = {
                        channel_id:this.editData.channel_id,
                        server_id:this.editData.server_id
                    };
                    this.$http(api_get_already, data).then(res=>{
                        this.alreadyBind = res;
                        this.channelList.find(row=>{
                            if(row.value === this.editData.channel_id){
                                this.channelName = row.label;
                            }
                        })
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }
            }
        },
        computed: {
            isRequired(){
                return !!this.siteOptions.length;
            },
            sitePlaceholder(){
                console.log(this.siteOptions,'this.siteOptions');
                if(this.editData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.editData.channel_id&&!this.siteOptions.length){
                    return "该平台下暂无站点";
                }else if(this.editData.channel_id&&this.siteOptions.length){
                    return "请选择/可以多选"
                }
            },
            isEbay(){
                if(!this.editData.collection_account){
                    this.editData.collection_account[0] = '';
                }
                return this.editData.channel_id === 1;
            },
            isAdd(){
                return this.action.value === 'add';
            },
            accounts:{
                get(){
                    return {label:this.editData.account_creator_name,
                        value:this.editData.account_creator}
                },
                set(val){
                    this.editData.account_creator_name = val.label;
                    this.editData.account_creator = val.value;
                }
            },
            // serverIp:{
            //     get(){
            //         return {label:this.editData.server_name,
            //             value:this.editData.server_id}
            //     },
            //     set(val){
            //         this.editData.server_name = val.label;
            //         this.editData.server_id = val.value;
            //     }
            // }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
                if(val){
                    this.isAddCompany=false;
                    if(this.editData.channel_id){
                        this.change_channel(this.editData.channel_id);
                    }
                    this.tempServerIpId=this.serverIpId;
                    if(this.editData.company_id){
                        this.get_company_data(this.editData.company_id);
                    }
                }
            },
            editData:{
                deep:true,
                handler(val){
                    if(!val.collection_account){
                        val.collection_account=[]
                    }
                }
            },
            companyData:{
                deep:true,
                handler(val){
                    if(val.length&&this.editData.company_id){
                        let find =val.find(row=>row.value===this.editData.company_id);
                        if(find){
                            this.editData.company=find.label;
                        }
                    }
                }
            },
            "editData.channel_id"(val){
                if(val){
                    this.get_alreadyBind();
                    this.editData.site_code.length&&this.get_account(val,this.editData.site_code);
                }
            },
            'editData.site_code'(val){
                if(val.length&&this.editData.channel_id){
                    this.get_account(this.editData.channel_id,val);
                }
            },
            'editData.server_id'(val){
                val&&this.get_alreadyBind();
            }
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{},
            serverIp:{},
            serverIpId:{}
        },
        components: {
            // pageDialog:require("../../../components/page-dialog.vue").default,
            selectRemote:require('../../../components/select-remote.vue').default,
            retypePassword:require('./retype-password.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            addEmailServer:require('./add-email-server.vue').default,
            chooseServer:require('./choose-server').default,
            addLookEdit
        },
    }
</script>
