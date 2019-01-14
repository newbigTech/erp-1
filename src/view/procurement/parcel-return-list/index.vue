<template>
    <page class="p-picking-sku">
        <serch-module
            @search="search"
            :warehouse-list="warehouseList"
            :clears="clears"
            :search-data="searchData"></serch-module>
        <table-module
            :table-data="tableData"
            class="mt-sm"
            :search-data="searchData"
            :loading="loading"
            :total="total"
            @search="search"
            @handle-size-change="handle_size_change"
            @handle-current-change="handle_current_change">
        </table-module>
    </page>
</template>

<style lang="stylus">
    .p-picking-sku {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>

<script>
    import {api_warehouses} from '@/api/global';
    import {api_receive_abnormal} from "@/api/ready-receive";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '黄伟杰',
                createTime: '2018-11-20',
                updateTime: '2018-11-22'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                loading: false,
                searchData: {
                    warehouse_id:2,
                    processing_status: '',
                    bill_type: 1,
                    bill_number: '',
                    person_type: 0,
                    person_id: '',
                    person_name: '',
                    time_type: 1,
                    page: 1,
                    pageSize: 50,
                    date_b: '',
                    date_e: '',
                },
                clears: {
                    warehouse_id:2,
                    bill_type: 1,
                    bill_number: '',
                    person_type: 0,
                    person_id: '',
                    person_name: '',
                    time_type: 1,
                    date_b: '',
                    date_e: '',
                },
                total: 0,
                warehouseList: [],
                tableData: [],
                sort_field: '',
                sort_type: '',
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                    this.searchData.warehouse_id = this.warehouseList[0].value;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
            search(){
                this.init();
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_receive_abnormal, data).then(res => {
                    this.tableData = res.list;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            init_params: function () {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });

                let searchData = clone(this.searchData);
                if (this.searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (this.searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    searchData.date_e = '';
                }
                if (searchData.bill_number !== '') {
                    searchData.bill_number = searchData.bill_number.split('\n').filter(row => !!row).map(row => row.trim());
                }

                this.sort_field && (searchData.sort_field = this.sort_field);
                this.sort_type && (searchData.sort_type = this.sort_type);

                return Object.assign({}, searchData, {warehouse_id: this.searchData.warehouse_id});
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            serchModule:require('./search-module').default,
            tableModule: require('./table-module.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
