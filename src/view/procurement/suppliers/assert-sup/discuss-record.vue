<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="'洽谈记录'" v-model="show" size="large" :height="'90%'" @open="open"
                     :close-on-click-modal="true">
            <div class="mb-sm">
                <div>
                    <el-row>
                        <label class="ml-sm">供应商：{{recordData.company_name}}</label>
                    </el-row>
                </div>
                <el-row class="mt-xs">
                    <el-button size="mini" type="info" class="inline" @click.native="exportHandle">新增洽谈记录</el-button>
                </el-row>
                <el-table class="mt-sm"
                          border :data="tableData"
                          highlight-current-row
                          v-resize="{height:120}"
                          v-loading="loading"
                          @selection-change="selection_change"
                          element-loading-text="玩命加载中...">
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column label="洽谈人" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.discuss_people_name">{{row.discuss_people_name}}
                        </div>
                    </el-table-column>
                    <el-table-column label="洽谈日期" min-width="50" inline-template>
                        <times :time="row.create_time"></times>
                    </el-table-column>
                    <el-table-column label="洽谈详情" min-width="250" inline-template>
                        <div class="p-table-list-td-text" :title="row.amount | filterNumber">
                            {{row.content}}
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <el-pagination
                    class="inline"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <el-button size="mini" class="inline" @click.native="close">关 闭</el-button>
            </el-row>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search {
        .page-dialog .dialog__body {
            padding: 0 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: hidden;
            box-sizing: border-box;
            height: 100%;
            max-height: 70%;
            .mt-sm {
                margin-bottom 60px;
                max--height: 520px;
            }
        }
    }
</style>
<script>
    import {api_supplier_discuss_record,url_supplier_discuss_record} from '../../../../api/assert-sup'
    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '蓝术术',
                createTime: '2018-10-18',
                updateTime: '2018-10-19'
            }
        },
        permission: {
            url_supplier_discuss_record
        },
        data() {
            return {
                show: this.value,
                checkedAll: false,
                tableData: [],
                firstLoading: true,
                loading: false,
                total: 0,
                page: 1,
                pageSize: 50
            }
        },
        methods: {
            open() {
                this.search();
            },
            selectable(row, index) {

                return !this.checkedall;
            },
            selection_change(val) {

            },
            search() {
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    supplier_id: this.recordData.supplier_id
                };
                this.loading = true;
                this.$http(api_supplier_discuss_record, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                    // this.$emit("updata-search",this.search())
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.search()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.search();
            },
            close() {
                this.show = false;
            },
            exportHandle() {
                let params={
                    id:this.recordData.supplier_id,
                    status:1
                };
                this.$emit('change-dialog', params)
            }
        },
        filters: {
            filterNumber(val) {
                if (Number(val) > 0) {
                    return Number(val).toFixed(3);
                } else {
                    return '-- --';
                }
            },
            filterTrackingNumber(val) {
                return val === '' ? '-- --' : val;
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            'updateData'(val){
                if(val){
                    this.tableData.push(val);
                    this.total+=1;
                    this.search();
                }
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            recordData: {
                required: true
            },
            updateData:{
                default(){
                    return null
                }
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button').default,
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
