<template>
    <div>    
        <!-- :disabled="hasRegister" -->
        <el-row>
            <el-col :span="12">
                <el-form-item label="注册日期：" title="注册日期">
                    <el-col :span="col16">
                        <el-date-picker
                            v-model="editData.register_time" disabled
                            type="date"     
                            placeholder="选择日期"
                            class="width-all date">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="注册邮箱：">
                    <el-col :span="col16">
                        <el-input v-model="editData.email" class="width-all" ></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="12">
                <el-form-item label="电话号码：" title="电话号码">
                    <el-col :span="col16">
                        <el-input v-model="editData.phone" class="width-all"  disabled></el-input>                                       
                    </el-col>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="邮箱密码：">
                    <el-col :span="col16">
                        <el-input  ref='email' type="password"  v-model="editData.email_password" class="width-all"  ></el-input>
                    </el-col>

                    <img src="../../../../assets/eye.svg"
                        v-if="isAdd||editData.status<=2||!isShowPassword"
                        @mouseup="backPassword('email')"
                        @mousedown="lookPassword('email')"
                        style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                            size="mini"
                            class="ml-sm"
                            v-else
                            @click="viewPassword('account')">显示密码
                    </el-button>

                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="公司注册号：">
                    <el-col :span="col16">
                        <el-input type="text"
                                v-model="editData.company_registration_number"
                                disabled></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="帐号全称：">
                    <el-col :span="col16">
                        <el-input type="text"
                                v-model="editData.account_name"
                            ></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="12">
                <el-form-item label="公司成立时间：">
                    <el-col :span="col16">
                        <el-date-picker
                            v-model="editData.company_time"
                            disabled
                            type="date"
                            placeholder="选择日期"
                            class="width-all date">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="店铺密码：">
                    <el-col :span="col16">
                        <el-input type="password"
                            ref="account"    
                            class="width-all"
                            v-model="editData.password"
                           >
                        </el-input>
                    </el-col>                                    
                    <img src="../../../../assets/eye.svg"
                        v-if="isAdd||editData.status<=2||!isShowPassword"
                        @mouseup="backPassword('account')"
                        @mousedown="lookPassword('account')"
                        style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                            size="mini"
                            class="ml-sm"
                            v-else
                            @click="viewPassword('account')">显示密码
                    </el-button>

                </el-form-item>
            </el-col>                  
        </el-row>


        <el-row>
            <el-col :span="12">
                <el-form-item label="公司地址+邮编：">
                    <el-col :span="col16">
                        <el-input type="text"
                                v-model="editData.company_address" class="width-all" disabled>
                        </el-input>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收款账号：">
                    <el-col :span="col16" class="more-select">
                        <el-input type="text"
                                v-model="editData.collection_account[0]"                               
                                class="width-all"
                            >
                        </el-input>                                  
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="12">
                <el-form-item label="法人身份证号：">
                    <el-col :span="col16">
                        <el-input type="text"
                                class="width-all"
                                v-model="editData.corporation_identification"
                                disabled></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收款账号平台：">
                    <el-col :span="col16">
                        <el-input type="text"
                            class="width-all"    
                            v-model="editData.collection_type"
                            ></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="12">
                <el-form-item label="法人地址+邮编：">
                    <el-col :span="col16">
                        <el-input type="text"
                            class="width-all"
                            v-model="editData.corporation_address"
                            disabled></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收款账号登录邮箱：">
                    <el-col :span="col16">
                        <el-input type="text"
                                class="width-all"
                                v-model="editData.collection_email"
                            ></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row class="mt-lg">                            
            <el-col :span='12'>
                <el-form-item label="">
                    <request-button req-key="sureKey" @click="sure">确定</request-button>
                    <el-button @click.native="close" size="mini" >取消</el-button>
                </el-form-item>
            </el-col>                                                        
        </el-row>

         <retype-password v-model="retype_visible"
                :retype-data="retypeData"
                :password-url="passwordUrl"
                @get-password="get_password">
        </retype-password>
    </div>
</template>

<script>

import {email,chinese,phone} from '../../../../define/validator_reg'
export default {
    data() {
        return {
            col16: 16,
            retype_visible: false,
            retypeData:{
                type:'',
                account_id:'',
                password:''
            },
            isShowPassword:true,
            passwordUrl:'get|account-apply/password',
        }
    },
    methods: {
        backPassword(type) {            
            this.$refs[type].$refs.input.type = 'password';
        },
        lookPassword(type) {
            this.$refs[type].$refs.input.type = 'text';
        },
        viewPassword(type) {
            if(!this.isAdd||this.editData.status>1){
                this.retypeData = {
                    account_id: this.editData.id,
                    type:type
                };
                this.retype_visible = true;
            }
        },
        get_password(password, type){
            this.$refs[type].$refs.input.type = 'text';
            if(type === 'account'){
                this.isShowPassword = false;
                this.editData.password = password;
            } else {
                this.isShowEmailPassword = false;
                this.editData.email_password = password;
            }
        },
        sure() {
            if(!this.verification_data()){
                this.$reqKey('sureKey',false);
                return
            }
            this.$emit('register', 'register');
        },
        verification_data() {
             if(!email.test(this.editData.email)) {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输正确入注册邮箱！"});
                return false;
            }
            if(this.editData.email_password==='') {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入邮箱密码！"});
                return false;
            }
            if(this.editData.email_password.length<6) {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "邮箱密码请输入6位以上！"});
                return false;
            }
        
            if(this.editData.account_name.trim()==='') {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入店铺名！"});
                return false;
            }

            if(this.editData.password==='') {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入店铺密码！"});
                return false;
            }
            if(this.editData.password.length<6) {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "店铺密码请输入6位以上！"});
                return false;
            }

            if(this.editData.collection_account[0]==='') {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入收款账号！"});
                return false;
            }
        
            if(this.editData.collection_type.trim()==='') {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入收款账号平台！"});
                return false;
            }    
            if(!email.test(this.editData.collection_email)) {
                this.$reqKey('sureKey', false);
                this.$message({type: "warning", message: "请输入正确收款账号登录邮箱！"});
                return false;
            }
            return true;
        },
        close() {
            this.editData.email = '';
            this.editData.email_password = '';
            this.editData.account_name = '';
            this.editData.password = '';
            this.editData.collection_account = '';
            this.editData.collection_type = '';
            this.editData.collection_email= '';
        }
    },
    computed: {
        isAdd() {
            return this.action.value === 'add';
         },
    },
    props: {
        editData: {
            type: Object,
            required: true
        },
        notRegister: {
            require: true
        },
        action: {
            type: Object
        }        
    },
    components: {
        retypePassword:require('../retype-password.vue').default,
    }
}
</script>


<style lang="stylus">
    
</style>