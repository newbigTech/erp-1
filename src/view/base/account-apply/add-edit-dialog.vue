<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="80%"
                 :close-on-click-modal="false"
                 @change="open_dialog"
                 class="c-account-apply-dialog">
        <el-form :model="formData" label-width="400px" >
            <el-form-item label="当前账号状态：">
                <el-steps :space="100" :active="active(formData.status)">
                    <el-step v-for="(item,index) in statusList"
                             :key="index"
                             :status="step_status(item,index)"
                             :title="item.label"
                    ></el-step>
                </el-steps>
            </el-form-item>
        </el-form>
        <el-tabs type="border-card" v-model="activeTab" @tab-click="tab_click_item">
            <el-tab-pane v-for="tab in tabShow" :label="tab.label" :name="tab.value" :key="tab.name" ref="pane">
                <base-info :form="formData" ref="base" v-if="tab.value==='base'"
                           :businessImage="businessImage"
                           :IDFrontImage="IDFrontImage"
                           :IDBackImage="IDBackImage"
                           :flag="flag"
                           :ever-form="everForm"
                           @base-submit="base_submit">
                </base-info>
                <register-info :form="formData" ref="register" v-if="tabs[1].show&&tab.value==='register'"
                               :flag="flag"
                               :ever-form="everForm"
                               @register-submit="register_submit">
                </register-info>
                <audit-info :form="formData" ref="auditPane" v-if="tabs[2].show&&tab.value==='audit'"
                            :flag="flag"
                            :is-edit="auditEdit"
                            @edit="auditEdit=true"
                            @cancel="audit_cancel"
                            @audit-submit="audit_submit">
                </audit-info>
                <registration-info :form="formData" v-if="tabs[3].show&&tab.value==='registration'"
                                   :flag="flag"
                                   :ever-form="everForm"
                                   @close="close">
                </registration-info>
                <log-info :form="formData" v-if="tabs[4].show&&tab.value==='log'"></log-info>
            </el-tab-pane>
            <!--<el-tab-pane label="基本信息" name="base">-->
            <!--<base-info :form="formData" ref="base" :businessImage="businessImage"-->
            <!--:IDFrontImage="IDFrontImage" :IDBackImage="IDBackImage"-->
            <!--:flag="flag" @base-submit="base_submit"></base-info>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="注册信息" name="register" v-if="tabPane.registerShow">-->
            <!--<register-info :form="formData" :flag="flag" ref="register" @register-submit="register_submit"></register-info>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="审核" name="audit" v-if="tabPane.auditShow">-->
            <!--<audit-info :form="formData" :flag="flag" ref="auditPane"-->
            <!--@audit-submit="audit_submit"></audit-info>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="注册结果" name="registration" v-if="tabPane.registrationShow">-->
            <!--<registration-info :form="formData" :flag="flag"-->
            <!--@registration-submit="registration_submit"></registration-info>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="操作日志" name="log" v-if="tabPane.logShow">-->
            <!--<log-info :form="formData"></log-info>-->
            <!--</el-tab-pane>-->
        </el-tabs>
        <little-remark v-if="remarkShow&&activeTab==='audit'" :title="remarkTitle" :cardStyle="remarkStyle"
                       @remark-submit="remark_submit" @cancel="remarkShow=false"></little-remark>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       v-if="formData.status===5&&activeTab==='audit'&&flag!==1"
                       @click.native="nullify">作 废
            </el-button>
            <el-button size="mini" @click="close">关 闭
            </el-button>
        </el-row>
    </page-dialog>
</template>

<script>
    import baseInfo from './base-info';
    import registerInfo from './register-info';
    import auditInfo from './audit-info';
    import registrationInfo from './registration-info'
    import logInfo from './log-info';
    import littleRemark from './little-remark';
    import {api_update_audit,api_get_operation_log,api_update_nullify_status,api_get_account_apply_status} from '@/api/account-apply';
    export default {
        name: "add-edit-dialog",
        data() {
            return {
                activeTab:'base',
                tabs:[
                    {label:'基本信息',value:'base',show:true},
                    {label:'注册信息',value:'register',show:false},
                    {label:'审核',value:'audit',show:false},
                    {label:'注册结果',value:'registration',show:false},
                    {label:'操作日志',value:'log',show:false}
                ],
                show:this.value,
                registerStatusList:[],
                tabPane:{
                    baseShow:false,
                    registerShow:false,
                    auditShow:false,
                    registrationShow:false,
                    logShow:false
                },
                businessImage:[],
                IDFrontImage:[],
                IDBackImage:[],
                remarkShow:false,
                remarkTitle:'',
                auditButton:'audit' ,//audit nullify,
                everForm:{},//编辑打开时的form,
                auditEdit:false,
                baseEdit:false
            }
        },
        computed: {
            tabShow(){
                return this.tabs.filter(row=>row.show);
            },
            statusList(){
                if(this.formData.status!==5){ //1新增 2已注册 3审核中 4注册成功 5注册失败 6已作废 7已推送
                    if(this.formData.status!==6){//
                        return this.registerStatusList.filter(row=>row.value!==4&&row.value!==5)
                    }else {//作废
                        return this.registerStatusList.filter(row=>row.value!==3&&row.value!==6)
                    }
                }else{//失败
                    return this.registerStatusList.filter(row=>row.value!==3&&row.value!==5);
                }
            },
            remarkStyle(){
                if(this.remarkShow&&this.activeTab==='audit'){
                    if(this.auditButton==='nullify'&&this.formData.status===5){//作废
                        return {width:'300px',position:'absolute',right:'15px',bottom:'55px',zIndex:999,}
                    }else if(this.auditButton==='audit'){
                        return {width:'300px',position:'absolute',left:'75px',bottom:'110px',zIndex:999,}
                    }
                }
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.remarkShow=false;
                    this.auditEdit=false;
                    this.baseEdit=false;
                    this.auditButton='audit';
                    this.activeTab='base';
                    this.businessImage=[];
                    this.IDFrontImage=[];
                    this.IDBackImage=[];
                    if(this.flag){
                        this.tabs.forEach(row=>{
                            switch (row.value){
                                case 'base':
                                    this.$set(row,'show',true);
                                    break;
                                case 'register':
                                    if(this.formData.status>=2){
                                        this.$set(row,'show',true);
                                    }else{
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 'audit':
                                    if(this.formData.status>=3){
                                        this.$set(row,'show',true);
                                    }else{
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 'registration':
                                    if(this.formData.status===4||this.formData.status===7){
                                        this.$set(row,'show',true);
                                    }else {
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 'log':
                                    this.$set(row,'show',true);
                                    break;
                            }
                        });
                        this.everForm=JSON.parse(JSON.stringify(this.formData));
                    }else{
                        this.tabs.forEach(row=>{
                            this.$set(row,'show',false);
                        });
                        this.tabs[0].show=true;
                        this.everForm={};
                    }
                    let StatusList = JSON.parse(localStorage.getItem('registerStatusList'));
                    if(!StatusList||!StatusList.length){
                        this.get_register_status();
                    }else {
                        this.registerStatusList=StatusList;
                    }
                }
            },
            get_register_status(){
                this.$http(api_get_account_apply_status).then(res=>{
                    this.registerStatusList=res.map(row=>{
                        if(row.label==='已注册'){
                            row.label='注册';
                        }
                        return {label:row.label,value:row.value};
                    });
                    localStorage.removeItem('registerStatusList');
                    localStorage.setItem('registerStatusList',JSON.stringify(this.registerStatusList));
                }).catch( error =>{
                    console.log(error);
                });
            },
            active(status){
                if(status<5||(status===6)){
                    return status
                }else if(status===5){
                    return this.statusList.findIndex(row=>row.label==='注册失败')+1;
                }else if(status===7){
                    return this.statusList.findIndex(row=>row.label==='已推送')+1;
                }
            },
            step_status(status,index){
                if(status.value<this.formData.status){
                    if(status.value===4||status.value===5){
                        return 'error';
                    }else{
                        return 'success';
                    }
                }
            },
            tab_click_item(tab,event){
                if(tab.name==="log"){
                    this.get_log_info();
                }
            },
            get_log_info(){
                this.$http(api_get_operation_log,this.formData.id).then(res=>{
                    this.$set(this.formData,'log',res.data);
                }).catch( error =>{
                    console.log(error);
                });
            },
            base_submit(){
                this.tabs[1].show=true;
                this.activeTab='register';
                this.tabs[4].show=true;
            },
            register_submit(){
                if(!this.tabs[2].show){
                    this.activeTab='audit';
                }
                this.tabs[2].show=true;
            },
            audit_submit(num){
                switch (num){
                    case 3:
                        if(!this.formData.address_billing&&!this.formData.grant_receipt){
                            return this.$message({type:"warning",message:'地址账单和收款证明必填一项！'})
                        }else{
                            this.audit(3);
                        }
                        break;
                    case 4:
                        this.remarkTitle='审核不通过的原因';
                        this.auditButton='audit';
                        this.remarkShow=true;
                        break;
                }
            },
            audit(num,reason){
                this.$http(api_update_audit,this.formData.id,{
                    address_billing:this.formData.address_billing,
                    grant_receipt:this.formData.grant_receipt,
                    status:num,
                    type_msg:reason?reason:'',
                }).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.remarkShow=false;
                    this.$set(this.formData,'status',num+1);
                    if(!this.tabs[3].show&&num===3&&this.formData.status===4){
                        this.activeTab='registration';
                        this.tabs[3].show=true;
                    }else {
                        this.tabs[3].show=false;
                    }
                    this.auditEdit=false;
                }).catch( error =>{
                    this.auditEdit=true;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            audit_cancel(){
                this.$set(this.formData,'address_billing',this.everForm.address_billing);
                this.$set(this.formData,'grant_receipt',this.everForm.grant_receipt);
                this.auditEdit=false;
            },
            nullify(){
                this.remarkTitle='作废的原因';
                this.auditButton='nullify';
                this.remarkShow=true;
            },
            remark_submit(remark){
                let str=remark.trim();
                if(!str){
                    return this.$message({type:'warning', message:'请输入原因'});
                }
                if(this.auditButton==='audit'){
                    this.audit(4,str);
                }else if(this.auditButton==='nullify'){
                    this.nullify_submit(str);
                }
            },
            nullify_submit(param){
                this.$http(api_update_nullify_status,this.formData.id,{type_msg:param}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.remarkShow=false;
                    this.$set(this.formData,'status',6);
                    this.close();
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            close(){
                this.$emit('refresh');
                this.show=false;
            }
        },
        props: {
            value:{},
            title:{},
            formData:{},
            flag:{}//add 0 look 1 edit 2
        },
        components: {
            baseInfo,registerInfo,auditInfo,registrationInfo,logInfo,littleRemark
        },
    }
</script>

