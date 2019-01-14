<template>
    <div>
        <el-table :data="tableData.list"
                  class="scroll-bar"
                  v-resize="{height:41}"
                  v-loading="loading"
                  highlight-current-row
                  @select="selectCheck($event)"
                  @select-all="selectCheck"
                  @sort-change="sort_change"
                  element-loading-text="玩命加载中">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>
            <el-table-column label="平台" inline-template sortable>
                <div>
                    <ui-tip :content="`${row.channel_id}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="站点" inline-template sortable>
                <div>
                    <ui-tip :content="`${row.site_code || '暂无站点'}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号全称" inline-template sortable>
                <div>
                    <ui-tip :content="row.account_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号简称" inline-template sortable>
                <div>
                    <ui-tip :content="row.account_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column label="服务器名" inline-template>-->
                <!--<div>-->
                    <!--<ui-tip :content="row.server_name" :width="98"></ui-tip>-->
                <!--</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="服务器地址" inline-template>-->
                <!--<div>-->
                    <!--<ui-tip :content="row.server_ip" :width="98"></ui-tip>-->
                <!--</div>-->
            <!--</el-table-column>-->
            <el-table-column label="手机号码" inline-template>
                <div>
                    <ui-tip :content="row.phone" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="电子邮箱" inline-template>
                <div>
                    <ui-tip :content="row.email" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="注册公司" inline-template width="200">
                <div>
                    <ui-tip :content="row.company" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template width="70">
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号创建人" inline-template width="150">
                <div>
                    <ui-tip :content="row.creator_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号创建时间" inline-template>
                <div>
                    <ui-tip :content="row.account_create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span class="operate"
                          @click="$emit('look-edit',scope.row,1)">查看</span>
                    |
                    <span class="operate"
                          @click="$emit('look-edit',scope.row,2)">编辑</span>
                    |
                    <span class="operate"
                          @click="operation(scope.row)">日志</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
        <page-dialog :title="title"
                     v-model="show"
                     width="80%">
            <log-info :form="logForm"></log-info>
            <el-row slot="footer" class="dialog-footer">
                <el-button size="mini" @click="show=false">关 闭</el-button>
            </el-row>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel'
    import {api_get_account, api_get_account_users,api_get_operation_log} from '../../../api/account-apply'
    import logInfo from './log-info';
    export default {
        data(){
            return {
                memDialog:false,
                memForm:[],
                mdfid:0,
                checkData:[],
                mdfTitle:'',
                title:'',
                show:false,
                logForm:{
                    log:[]
                }
            }
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            }
        },
        methods: {
            operation(row){
                this.$http(api_get_operation_log,row.id).then(res=>{
                    this.title=`查看${row.account_code?row.account_code+'的':''}操作日志`;
                    this.show=true;
                    this.$set(res,'log',res.data);
                    this.logForm=res;
                }).catch( error =>{
                    console.log(error);
                });
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            //分页器
            handle_size_change(val){
                this.$emit('size-change',val);
            },
            handle_current_change(val){
                this.$emit('page-change',val);
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*初始*/
            member_management(row){
                this.$emit('member-management',row);
            },
            selectCheck(select){
                this.checkData = select.map(row=>{
                    return row.id;
                });
                this.$emit('selectCheck', this.checkData);
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props: {
            tableData:{
                type:Object,
                require:true
            },
            loading:{
                type:Boolean,
                require:true
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,logInfo

        },
    }
</script>
