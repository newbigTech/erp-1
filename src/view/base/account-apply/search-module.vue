<template>
    <div class="p-account-infomarion">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <div class="mb-mini">
                <label-item label="状态：">
                    <el-select v-model="searchData.status" class="s-width-small" v-sf.status>
                        <el-option v-for="item in statusOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="平台：" class="ml-sm">
                    <select-remote class="s-width-default"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote"
                                   @load="load"
                                   @change="change_channel">
                    </select-remote>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <el-select :disabled="!siteOptions.length"
                               class="s-width-default"
                               v-sf.site_code
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-model="searchData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item>
                    <el-select v-model="searchData.snType"
                               class="s-width-small ml-sm"
                               v-sf.snType>
                        <el-option v-for="type in accountOptions"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-input type="text"
                              v-sf.snText
                              v-model="searchData.snText"
                              class="width-sm"></el-input>
                </label-item>
                <!--<label-item label="服务器名：" class="ml-sm mr-mini">-->
                    <!--<el-input type="text"-->
                              <!--v-sf.server_name-->
                              <!--v-model="searchData.server_name"-->
                              <!--class="s-width-small">-->
                    <!--</el-input>-->
                <!--</label-item>-->
            </div>
            <label-item label="创建人：" class="ml-sm">
                <scroll-select v-model="account_creator" style="width:158px" class="inline"
                               textAlign="left"
                               ref="creater"
                               v-sf.account_creator
                               :remote="urlcreater"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <label-item label="创建时间：" class="ml-sm">
                <!--<el-select v-model="searchData.snDate"-->
                           <!--class="s-width-small mr-mini"-->
                           <!--v-sf.snDate>-->
                    <!--<el-option v-for="type in time_type_list"-->
                               <!--:key="type.value"-->
                               <!--:label="type.label"-->
                               <!--:value="type.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <el-date-picker
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.date_b
                    :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.date_e
                    :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-account-infomarion{
        .el-card{
            overflow: visible;
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel'
    import {api_get_account_status} from '../../../api/account-apply'
    export default {
        data(){
            return {
                // siteOptions:[{label:"",value:""}],
                siteOptions:[],
                accountOptions:[
                    {label:"账号全称",value:"name"},
                    {label:"账号简称",value:"code"}
                ],
                // time_type_list:[
                //     {label:'创建时间',value:'create_time'},
                //     {label:'交接时间',value:'transfer_time'}
                // ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.searchData.date_b) {
                            return time.getTime()<this.searchData.date_b||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },//结束时间
                urlcreater:'get|user',
                channelList:[],
            }
        },
        methods: {
            load(list){
                this.channelList = [{label:'全部',value:''},...list];
            },
            change_channel(channel){
                this.siteOptions=[];
                this.searchData.site_code='';
                this.$http(api_account_list,{channel_id:channel}).then(res=>{
                    console.log(channel,'uuueuuu',res);
                 if(res.site.length){
                     this.siteOptions=[{label:'全部',value:''},...res.site];
                 }else {
                     this.siteOptions=res.site;
                 }
                }).catch( error =>{
                   error&&this.$message({type:'error', message:error.message||error});
                });
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    this.$message({type:"error", message:code.message || code});
                });
            },
            site_remote(){
                return this.$http(api_get_channel_categories,{}).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                }).catch(code=>{
                    console.log(code);
                });
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = [{label:"全部",value:""}, ...res];
                });
            },
            // get_site(channel_id){
            //     if(!channel_id)return this.siteOptions = [{label:"",value:""}];
            //     this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
            //         if(res.site.length<=0){
            //             this.siteOptions = [{label:"",value:""}]
            //         }else{
            //             res = res.site;
            //             this.siteOptions = [{label:"全部",value:""},...res];
            //         }
            //     }).catch(code=>{
            //         console.log(code);
            //     })
            // },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
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
            search(){
                this.$emit('search');
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = 0;
                this.searchData.snType = 'name';
                this.searchData.snDate = 'create_time';
            },
            // get_status(){
            //     this.$http(api_get_account_status).then(res=>{
            //         let statusOptions = res.map(row=>{
            //             return {
            //                 label:row.remark,
            //                 value:row.status
            //             }
            //         });
            //         this.statusOptions = [{label:'全部',value:''},...statusOptions];
            //     }).catch(code=>{
            //         console.log(code);
            //     })
            // },
        },
        computed: {
            sitePlaceholder(){
                if(!this.searchData.channel_id){
                    return "请先选择平台";
                }else if(this.searchData.channel_id&&!this.siteOptions.length){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            account_creator:{
                get(){
                    return {label:this.searchData.creator, value:this.searchData.creator_id}
                },
                set(val){
                    this.searchData.creator = val?val.label:'';
                    this.searchData.creator_id = val?val.value:'';
                }
            },
        },
        watch: {
            // "searchData.channel_id"(val){
            //     this.searchData.site_code ='';
            //     this.siteOptions = [];
            //     this.get_site(val);
            // },
            'searchData.site_code'(val){
                this.get_account(this.searchData.channel_id,val);
            },
        },
        props: {
            clears:{},
            searchData:{},
            statusOptions:{}
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
