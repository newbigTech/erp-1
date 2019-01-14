<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       :warehouses="warehouses"
                       @search="search"
                       @change-warehouse="change_warehouse"
                       @select-status="select_status"></search-module>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @look-audit="look_audit"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <look-audit v-model="showDialog"
                    :form-data="formData"
                    :action="action"
                    @single-audit="single_audit"></look-audit>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        api_get_list,
        api_get_look_details,
        api_put_audit,
        api_warehous_local
    } from '@/api/warehouse-cargo-shift';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '翟雪莉',
                createdTime: '2018-12-22',
                updateTime: '2018-12-22'
            }
        },
        data(){
            return{
                warehouse_id: 2,
                status: '',//状态
                searchData: {
                    snType: 'sku',//搜索类型
                    snText: '',//搜索内容
                    operatorId: '',//操作人ID
                    operatorType: 1,//操作人类型
                    warehouse_cargo_code: '',//货位号
                    operator_time: 1,//时间类型
                    start_time: '',
                    end_time: '',
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    snType: 'sku',//搜索类型
                    operatorType: 1,//操作人类型
                    operator_time: 1,//时间类型
                    page: 1,
                    pageSize: 50,
                },
                statusBtn: [//-----状态
                    {label: '全部',value: ''},
                    {label: '作废', value: -1},
                    {label: '待审核', value: 0},
                    {label: '待处理', value: 1},
                    {label: '移位中', value: 2},
                    {label: '已完成', value: 3}
                ],
                warehouses: [],//仓库列表
                checkData: [],//表格选中列表
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                showDialog: false,
                formData: {},
                action: {
                    title: '',
                    operation: ''
                }
            }
        },
        mounted(){
            this.init();
            this.get_warehouse()
        },
        methods:{
            init(){
                this.loading = true;
                let data = this.get_init_params();
                this.$http(api_get_list, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //初始化搜索条件
            get_init_params(){
                let params = clone(this.searchData);
                //时间参数后端要的是10位时间戳
                if(this.searchData.start_time){
                    params.start_time = this.searchData.start_time/1000;
                }else {
                    params.start_time = '';
                }
                if(this.searchData.end_time){
                    params.end_time = this.searchData.end_time/1000;
                }else {
                    params.end_time = '';
                }
                if(this.searchData.snType === 'sku'&&this.searchData.snText) {
                    params.snText = this.searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }
                this.$set(params, 'status', this.status);
                this.$set(params, 'warehouse_id', this.warehouse_id);
                return params
            },
            search(){
                this.init();
            },
            change_warehouse(val){
                this.warehouse_id = val;
                this.init()
            },
            //查看 / 审核 详情
            look_audit(row, type){
                this.$http(api_get_look_details,row.id).then(res => {
                    this.formData = res;
                    this.action = {
                        title: type === 'look' ? '查看' : '审核',
                        operation: type === 'look' ? 'look' : 'audit'
                    };
                    this.showDialog = true
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //审核通过/不通过
            single_audit(row,remark,type){
                let params = {
                    ids: row.id,
                    status: type === 'pass' ? 1 : -1,
                    remark: remark
                };
                this.$http(api_put_audit,params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //获取本地仓库列表
            get_warehouse() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    if (this.warehouses.length > 0) {
                        this.warehouse_id = this.warehouses[0].value;
                        this.init();
                    } else {
                        this.warehouse_id = '';
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            //切换状态
            select_status(index, item){
                this.status = item.value;
                this.init()
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            //表格复选框
            handle_selection_change(val){

            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            lookAudit: require('./look-audit.vue').default
        }
    }
</script>