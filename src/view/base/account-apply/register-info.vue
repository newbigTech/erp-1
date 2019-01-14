<template>
    <div>
        <el-form :model="form" ref="registerForm" label-width="100px" >
            <el-row class="register-account-common">注册信息</el-row>
            <el-form-item label="注册邮箱：" prop="email">
                <el-col :span="10">
                    <span v-if="flag===1&&!isEdit">{{form.email}}</span>
                    <el-input v-else
                              v-model="form.email"
                              clearable
                              :disabled="form.status===4||form.status>5">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="邮箱密码：">
                <el-col :span="10">
                    <span v-if="flag===1&&!isEdit">{{form.email_password?'***':''}}</span>
                    <el-input v-else
                              v-model="form.email_password"
                              type="password"
                              ref="email" clearable
                              :disabled="(!!flag&&emailDisabled)||(!flag&&form.status===4||form.status>5)">
                    </el-input>
                </el-col>
                <img src="../../../assets/eye.svg"
                     class="ml-sm"
                     v-if="!flag"
                     @mouseup="backPassword('email')"
                     @mousedown="lookPassword('email')"
                     style="vertical-align: middle;width: 20px;height: 20px;">
                <el-button type="primary" size="mini"
                           class="ml-sm"
                           v-if="flag===2||(flag===1&&isEdit)"
                           @click="show_password('email')"
                           :disabled="(form.status===4||form.status>5)||((form.status===5||form.status<4)&&emailPassword)">
                    显示密码</el-button>
            </el-form-item>
            <el-form-item label="账号全称：">
                <el-col :span="10">
                    <span v-if="flag===1&&!isEdit">{{form.account_name}}</span>
                    <el-input v-else
                              v-model="form.account_name" clearable
                              :disabled="form.status===4||form.status>5"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="店铺密码：">
                <el-col :span="10">
                    <span v-if="flag===1&&!isEdit">{{form.password?'***':''}}</span>
                    <el-input v-else
                              v-model="form.password" type="password"
                              ref="account" clearable :disabled="(!!flag&&accountDisabled)||(!flag&&form.status===4||form.status>5)"></el-input>
                </el-col>
                <img src="../../../assets/eye.svg"
                     class="ml-sm"
                     v-if="!flag"
                     @mouseup="backPassword('account')"
                     @mousedown="lookPassword('account')"
                     style="vertical-align: middle;width: 20px;height: 20px;">
                <el-button type="primary" size="mini"
                           class="ml-sm"
                           v-if="flag===2||(flag===1&&isEdit)"
                           @click="show_password('account')"
                           :disabled="(form.status===4||form.status>5)||((form.status===5||form.status<4)&&accountPassword)">
                    显示密码</el-button>
            </el-form-item>
            <el-row class="register-account-common">注册信息</el-row>
            <el-form-item label="信用卡：">
                <el-col :span="15">
                    <span v-if="flag===1&&!isEdit">{{form.credit_card}}</span>
                    <el-input v-else
                              v-model="form.credit_card"
                              clearable
                              :disabled="form.status===4||form.status>5"></el-input>
                </el-col>
            </el-form-item>
            <el-row v-for="(row,index) in form.collection_msg" :key="index">
                <el-form-item :label="`收款账号${index!==0?index:''}：`">
                    <el-col :span="15">
                        <span v-if="flag===1&&!isEdit">{{row.collection_account}}</span>
                        <el-input v-else
                                  v-model.trim="row.collection_account"
                                  clearable
                                  :disabled="form.status===4||form.status>5"></el-input>
                    </el-col>
                    <el-button type="primary" size="mini" class="ml-sm inline"
                               v-if="(flag!==1&&index===0)||(flag===1&&isEdit&&index===0)"
                               :disabled="form.status===4||form.status>5"
                               @click.native="add">新增
                    </el-button>
                    <span v-if="(flag!==1&&index!==0)||(flag===1&&isEdit&&index!==0)" style="font-size: 20px;"
                          @click="del(row,index)">
                     <i class="el-icon-delete"></i>
                 </span>
                </el-form-item>
                <el-form-item :label="`收款账号平台${index!==0?index:''}：`">
                    <el-col :span="15">
                        <span v-if="flag===1&&!isEdit">{{row.collection_type}}</span>
                        <el-input v-else
                                  v-model.trim="row.collection_type"
                                  clearable
                                  :disabled="form.status===4||form.status>5"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="`收款账号邮箱${index!==0?index:''}：`">
                    <el-col :span="15">
                        <span v-if="flag===1&&!isEdit">{{row.collection_email}}</span>
                        <el-input v-else
                                  v-model.trim="row.collection_email"
                                  clearable
                                  :disabled="form.status===4||form.status>5"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="`收款方${index!==0?index:''}：`">
                    <el-col :span="15">
                        <span v-if="flag===1&&!isEdit">{{row.collection_user}}</span>
                        <el-input v-else
                                  v-model.trim="row.collection_user"
                                  clearable
                                  :disabled="form.status===4||form.status>5"></el-input>
                    </el-col>
                </el-form-item>
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
                    <el-button size="mini"
                               :disabled="form.status===4||form.status>5"
                               @click="cancel">取 消</el-button>
                </template>
            </el-form-item>
        </el-form>
        <retype-password v-model="passwordShow"
                         :retype-data="passwordData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
    </div>
</template>

<style lang="stylus" scoped>
    .register-account-common{
        text-indent:3em;
        border-bottom : 1px solid #797979;
        margin-bottom :6px;
    }
</style>

<script>
    import {email} from '../../../define/validator_reg';
    import {api_update_register_info,} from '@/api/account-apply';
    import retypePassword from '@/view/base/account-information/retype-password'
    export default {
        name: "register-info",
        data() {
            return {
                isEdit:false,
                passwordShow:false,
                passwordData:{},
                passwordUrl:'get|account-apply/password',
                emailDisabled:true,
                accountDisabled:true,
                emailPassword:false,
                accountPassword:false
            }
        },
        mounted(){
            this.emailDisabled=true;
            this.accountDisabled=true;
            this.emailPassword=false;
            this.accountPassword=false;
        },
        methods: {
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            },
            show_password(type){
                this.passwordData={
                    account_id:this.form.id,
                    type:type
                };
                this.passwordShow=true;
            },
            get_password(password,type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'email'){
                    this.emailDisabled= false;
                    this.form.email_password=password;
                    this.emailPassword=true;
                }else if(type==='account'){
                    this.accountDisabled= false;
                    this.form.password=password;
                    this.accountPassword=true;
                }
            },
            add(){
                let obj={
                    collection_account:'',
                    collection_type:'',
                    collection_email:'',
                    collection_user:''
                };
                this.form.collection_msg.push(obj);
            },
            del(row,index){
                this.form.collection_msg.splice(index,1);
            },
            submit(){
                if(this.form.email) {
                    let checkEmail=email.test(this.form.email);
                    if(!checkEmail){
                        return this.$message({type:'warning',message:'注册邮箱格式不正确'});
                    }
                }
                let mess=this.form.collection_msg.filter(row=>{
                    let isEmpty =row.collection_account===''&&row.collection_type===''&&row.collection_email===''
                        &&row.collection_user==='';
                    return !isEmpty;
                });
                if(!mess.length){
                    mess=[{collection_account:'',collection_type:'',collection_email:'',collection_user:''}];
                }else{
                    let map=mess.map(row=>row.collection_email);
                    let find = map.find(row=>!email.test(row));
                    if(find){
                        return this.$message({type:'warning',message:'检测到有收款账号邮箱格式填写不正确'});
                    }
                }
                this.$http(api_update_register_info,this.form.id,{
                    email:this.form.email,
                    email_password:this.form.email_password,
                    account_name:this.form.account_name,
                    password:this.form.password,
                    credit_card:this.form.credit_card,
                    collection_msg:mess
                }).then(res=>{
                    this.$message({type:'success', message:res.message||res});
                    let status=this.form.status>res.data.status?this.form.status:res.data.status+1;
                    this.$set(this.form,'status',status);
                    this.$emit('register-submit');
                    this.isEdit=false;
                }).catch( error =>{
                    this.isEdit=true;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            cancel(){
                if(!this.flag){
                    this.$set(this.form,'email','');
                    this.$set(this.form,'email_password','');
                    this.$set(this.form,'account_name','');
                    this.$set(this.form,'password','');
                    this.$set(this.form,'credit_card','');
                    this.$set(this.form,'collection_msg',[{
                        collection_account:'',
                        collection_type:'',
                        collection_email:'',
                        collection_user:''
                    }]);
                }else {
                    this.$set(this.form,'email',this.everForm.email);
                    this.$set(this.form,'email_password',this.everForm.email_password);
                    this.$set(this.form,'account_name',this.everForm.account_name);
                    this.$set(this.form,'password',this.everForm.password);
                    this.$set(this.form,'credit_card',this.everForm.credit_card);
                    this.$set(this.form,'collection_msg',this.everForm.collection_msg);
                    if(this.flag===1){
                        this.isEdit=false
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
        components:{retypePassword}
    }
</script>

