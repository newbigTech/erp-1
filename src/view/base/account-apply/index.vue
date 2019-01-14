<template>
    <page class="channel-profit">
        <search-module ref="search_module" :searchData="searchData" :clears="clears"
                       @search="search"
                       :statusOptions="searchStatus"></search-module>
        <div class="inline mt-xs mb-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       @click="add_account">添加账号资料
            </el-button>
            <!--<permission tag="ElButton"-->
                        <!--:route="apis.url_add_account"-->
                        <!--class="mr-sm"-->
                        <!--size="mini"-->
                        <!--type="primary"-->
                        <!--@click.native="addAccount">测试下-->
            <!--</permission>-->
            <el-button type="primary"
                       size="mini"
                       v-for="item in statusOptions"
                       @click.native="updateStatus(item.value)"
                       :key="item.value">{{item.label}}</el-button>
        </div>
        <table-module ref="table_module"
                      :loading="tableLoading"
                      :table-data="tableData"
                      :first-loading="firstLoading"
                      @member-management="member_management"
                      @size-change="size_change"
                      @page-change="page_change"
                      @look-edit="look_edit"
                      @sort-change="sort_change"
                      @selectCheck="select">
        </table-module>
        <!--成员管理-->
        <mem-management
                :is-loading="memLoading"
                :mem-form="memForm"
                :mdf-title="mdfTitle"
                v-model="memDialog"
                :id="mdfid"
                @cancel-member="cancel_member"
        ></mem-management>
        <!--添加编辑-->
        <!--<add-edit v-model="addVisiable"-->
                  <!--:action="action"-->
                  <!--@submit="submit"-->
                  <!--:searchData="searchData"-->
                  <!--:editData="editData">-->
        <!--</add-edit>-->
        <add-edit-dialog v-model="addEditShow"
                         :title="addEditTitle"
                         :form-data="formData"
                         :flag="flag"
                         ref="accountDialog"
                         @refresh="init">
        </add-edit-dialog> </page>
</template>
<style lang="stylus">
    .el-input__inner{
        line-height:27px;
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel'
    import addEditDialog from './add-edit-dialog';
    import {
        api_edit_account,
        api_updata_account_status,
        api_get_account,
        api_get_account_users,
        api_get_account_basics_changes,
        url_add_account,api_account_apply_list_edit,api_get_account_apply_status,api_get_operation_log} from '../../../api/account-apply'
    export default{
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-8-26',
                updateTime:'2017-8-28'
            }
        },
        permission:{
            url_add_account
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                firstLoading: true,
                memLoading:false,
                tableLoading:false,
                mdfTitle:'',
                memDialog:false,
                mdfid:0,
                sort_field:'',
                sort_type:'',
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                    count:0
                },
                status:'',
                statusOptions:[],
                searchData:{
                    status:'',
                    channel_id:0,
                    site_code:'',
                    snType:'name',
                    snText:'',
                    snDate:'create_time',
                    // server_name:'',
                    creator:'',
                    creator_id:'',
                    date_b:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_e:Date.now(),
                },
                clears:{
                    channel_id:0,
                    snType:'name',
                    date_b:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_e:Date.now(),
                },
                checkData:[],
                editData:{
                    register_time:'',
                    channel_id:'',
                    server_type:'',
                    site_code:[],
                    account_code:'',
                    account_show_id:'',
                    use_account_name:'',
                    use_account_id:'',
                    account_name:'',
                    breed:'',
                    password:'',
                    server_id:'',
                    phone:'',
                    email:'',
                    email_password:'',
                    company:'',
                    company_registration_number:'',
                    corporation:'',
                    collection_email:'',
                    corporation_identification:'',
                    collection_account:[],
                    company_type:'',
                    vat:'',
                    creator:'',
                    creator_id:'',
                    company_time:'',
                    company_address:'',
                    account_creator_name:'',
                    account_creator:'',
                    account_create_time:'',
                    status:0,
                    initiate_time:'',
                    initiate_man:'',
                    initiate_man_name:'',
                    collection_type:'',
                    corporation_address:'',
                    address_billing:'',
                    grant_receipt:'',
                    fulfill_time:'',
                    has_initiate:true,
                    /*vat_:'',//新增vat
                    reMarks:''//新增备注*/
                },
                action:{},
                addVisiable:false,
                memForm:[],
                addEditShow:false,
                addEditTitle:'',
                formData:{},
                flag:0,
                searchStatus:[],
                logShow:false,
                logTitle:'',
                logData:[]
            }
        },
        mounted(){
            this.get_operation_btn();
            this.init();
            let StatusList = JSON.parse(localStorage.getItem('registerStatusList'));
            if(!StatusList||!StatusList.length){
                this.$http(api_get_account_apply_status).then(res=>{//search status
                    this.searchStatus=[{label:'全部',value:''},...res.map(row=>{
                        if(row.label==='已注册'){
                            row.label='注册';
                        }
                        return {label:row.label,value:row.value}
                    })].filter(item=>item.label!=='新增');
                }).catch( error =>{
                    console.log(error);
                });
            }else {
                this.searchStatus=[{label:'全部',value:''},...StatusList.filter(row=>row.label!=='新增')];
            }
        },
        methods:{
            look(row,num){
                console.log(row,num,'ew');
            },
            add_account(){
                this.formData={
                    status:1,
                    initiate_time:Date.now(),
                    initiate_man:0,
                    channel_id:'',
                    site_code:'',
                    breed:'',
                    company_id:'',

                    company_registration_number:'',
                    corporation:'',
                    corporation_identification:'',
                    vat:0,
                    company_time:'',
                    company_address:'',

                    email:'',
                    email_password:'',
                    account_name:'',
                    password:'',
                    credit_card:'',
                    collection_msg:[{collection_account:'',
                        collection_type:'',
                        collection_email:'',
                        collection_user:'',} ],
                    address_billing:'',
                    grant_receipt:'',
                    fulfill_time:'',
                    account_code:'',
                    account_show_id:'',
                };
                this.flag=0;
                this.addEditTitle='添加账号资料';
                this.addEditShow=true;
            },
            get_operation_btn(){
                this.$http(api_get_account_basics_changes).then(res=>{
                    this.statusOptions = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status
                        }
                    });
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            submit(res,id){
                if(res.data&&res.data.length>0){
                    let obj = res.data[0];
                    if(!!id){
                        let find = this.tableData.list.find(row=>Number(row.id)===Number(id));
                        if(find) Object.assign(find,obj);//Object.assign(target, ...sources)
                    }else{
                        this.tableData.list.unshift(obj);
                        this.tableData.count++
                    }
                }
            },
            search(){
                this.init();
            },
            init(){
                this.tableLoading = true;
                let data=clone(this.searchData);
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                if(this.sort_field) this.$set(data,'sort_field',this.sort_field);
                if(this.sort_type) this.$set(data,'sort_type',this.sort_type);
                //处理年月日 YYYY-MM-dd
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd', this.searchData.date_b/1000):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd', this.searchData.date_e/1000):'';
                this.$http(api_get_account, data).then(res=>{
                    res.data.forEach(row=>{
                        if(row.site_code.indexOf('[')>-1||row.site_code.indexOf(']')>-1){
                            let str=row.site_code.replace(/[\ |\\|\[|\]|\"|\']/g,"");
                            this.$set(row,'site_code',str);
                        }
                    });
                    this.tableLoading = false;
                    this.firstLoading = false;
                    this.tableData.list = res.data;
                    this.tableData.count = res.count;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            member_management(row){
                this.mdfid=row.id;
                this.mdfTitle=row.account_code;
                this.memDialog = true;
                this.mem_init(row.id);
            },
            cancel_member(){

            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init();
            },
            page_change(page){
                this.tableData.page = page;
                this.init();
            },
            mem_init(id) {
                this.memLoading = true;
                let param = {
                    account_id: id,
                    content: ''
                };
                this.$http(api_get_account_users, param).then(res => {
                    this.memForm = res;
                    this.memLoading = false;
                }).catch(code => {
                    this.loading = false;
                    console.log(code);
                })
            },
            sort_change(val){
                this.sort_type = val.order==='ascending'?'asc':'desc';
                switch (val.column.label){
                    case '平台':
                        this.sort_field = 'channel_id';
                        break;
                    case '站点':
                        this.sort_field = 'site_code';
                        break;
                    case '账号全称':
                        this.sort_field = 'account_name';
                        break;
                    case '账号简称':
                        this.sort_field = 'account_code';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.init();
            },
            select(checkData){
                this.checkData = checkData;
            },
            addAccount(){
                this.action = {title:'添加账号资料', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.has_initiate = true;
                this.editData.channel_id = '';
                this.editData.status = 0;
                this.editData.collection_account = [];
                this.addVisiable = true;
            },
            look_edit(row,num){
                this.$http(api_account_apply_list_edit,row.id).then(res=>{
                    if(!res.collection_msg.length||!res.collection_msg){
                        res.collection_msg=[
                            {
                                collection_account:'',
                                collection_type:'',
                                collection_email:'',
                                collection_user:''
                            }
                        ];
                    }
                    res.initiate_time=res.initiate_time?res.initiate_time:'';
                    res.status+=1;
                    let site=[];
                    if(typeof res.site_code==='string'){
                        if(res.site_code){
                            if((res.site_code.indexOf('[')>-1||res.site_code.indexOf(']')>-1)){
                                site=JSON.parse(res.site_code);
                            }else {
                                site=res.site_code.split(',');
                            }
                        }
                    }
                    this.$set(res,'initiate_time',res.initiate_time?res.initiate_time*1000:'');
                    this.$set(res,'fulfill_time',res.fulfill_time?res.fulfill_time*1000:'');
                    this.$set(res,'register_time',res.register_time?res.register_time*1000:'');
                    this.$set(res,'site_code',site);
                    this.formData=res;
                    this.flag=num;
                    this.addEditTitle=`${num===1?'查看':'编辑'}${row.account_code}资料信息`;
                    this.addEditShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                // this.action = {title:`编辑${row.channel_id}账号简称：${row.account_code} 资料信息`, value:'edit'};
                // this.$http(api_edit_account, row.id).then(res=>{
                //     if(!!res.company_time){
                //         res.company_time = res.company_time * 1000;
                //     } else {
                //         res.company_time = '';
                //     }
                //     if(!!res.account_create_time){
                //         res.account_create_time= res.account_create_time * 1000;
                //     }else{
                //         res.account_create_time='';
                //     }
                //     if(!!res.create_time){
                //         res.create_time = res.create_time * 1000;
                //     } else {
                //         res.create_time = '';
                //     }
                //     if(!!res.fulfill_time){
                //         res.fulfill_time= res.fulfill_time * 1000;
                //     }else{
                //         res.fulfill_time='';
                //     }
                //     if(!!res.initiate_time){
                //         res.initiate_time = res.initiate_time * 1000;
                //     } else {
                //         res.initiate_time = '';
                //     }
                //     if(!!res.register_time){
                //         res.register_time= res.register_time * 1000;
                //     }else{
                //         res.register_time='';
                //     }
                //     if(!!res.update_time){
                //         res.update_time= res.update_time * 1000;
                //     }else{
                //         res.update_time='';
                //     }
                //     this.editData = res;
                //     this.editData.type_status === 1 && (this.editData.status += 1);
                //     this.addVisiable = true;
                // }).catch(code=>{
                //     this.$message({type:"error",message:code.message || code});
                // });
            },
            updateStatus(val){
                let params = {
                    ids:this.checkData,
                    status:val
                };
                if(this.checkData.length<=0)return this.$message({type:'warning',message:'请勾选所要操作的数据'});
                this.$confirm('您将更改账号资料状态，确认此操作吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_updata_account_status, params).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.init(this.searchData);
                        this.checkData.length = 0;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        computed:{
            statusPlaceholder(){
                if(this.checkData.length<=0){
                    return "请先选择账号";
                }
            }
        },
        components:{
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            // addEdit:require('./add-edit.vue').default,
            memManagement:require('./member-management.vue').default,
            addEditDialog,
        }
    }
</script>
