<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="requestButton"
                        req-key="api_process_status"
                        @click="make_handle"
                        type="primary"
                        size="mini"
                        :route="apis.url_process_status">
                全部导出
            </permission>
        </div>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
            <el-table-column type="selection" width="35"></el-table-column>
            <!--<el-table-column type="index" width="35"></el-table-column>-->
            <el-table-column label="运输方式" min-width="50" inline-template>
                <div>{{row.processing_status_text}}</div>
            </el-table-column>
            <el-table-column label="包裹号" min-width="55" inline-template>
                <div>{{row.propose_department_text}}</div>
            </el-table-column>
            <el-table-column label="对应P0号" min-width="50" inline-template>
                <div>{{row.propose_user_name}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="55" inline-template>
                <div>{{row.abnormal_content}}</div>
            </el-table-column>
            <el-table-column label="寄出运输方式" min-width="50" inline-template>
                <div>{{row.receive_user_name}}</div>
            </el-table-column>
            <el-table-column label="寄出单号" min-width="100" inline-template>
                <div>{{row.process_begin_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="寄出日期" min-width="55" inline-template>
                <div>{{row.shipping_methods}}</div>
            </el-table-column>
            <el-table-column label="寄出运费" min-width="80" inline-template>
                <div>
                    {{row.tracking_number}}
                </div>
            </el-table-column>
            <el-table-column label="收件人姓名" min-width="80" inline-template>
                <span>{{row.purchase_order_ids ? `PO${row.purchase_order_ids}` : ''}}</span>
            </el-table-column>
            <el-table-column label="收件人手机号码" min-width="70" inline-template>
                <span>{{row.warehouse_name}}</span>
            </el-table-column>
            <el-table-column label="收件地址" min-width="90" inline-template>
                <div>{{row.ready_receive_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="寄付方式" min-width="90" inline-template>
                <div>{{row.create_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="备注" min-width="55" inline-template>
                <div>{{row.is_use_text}}</div>
            </el-table-column>
            <el-table-column label="创建时间" min-width="50" inline-template>
                <div>{{row.reply_user_name}}</div>
            </el-table-column>
            <el-table-column label="提交时间" min-width="55" inline-template>
                <div>{{row.processing_method || '--'}}</div>
            </el-table-column>
            <el-table-column label="上传凭证时间" min-width="90" inline-template>
                <div>{{row.follow_up_time | fmsdatetime}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="100" inline-template>
                <div >
                    <permission tag="trendsSelect"
                                class="inline"
                                type="primary"
                                :route="apis.url_process_status"
                                :selects="partAllOptions">
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <abnormal-handle v-model="markHandleVisible"
                         @search="$listeners['search']"
                         :abnormal-info="abnormalInfo"></abnormal-handle>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    import {url_reply_letter, api_process_status, url_process_status} from "@/api/ready-receive";
    export default {
        permission: {
            url_reply_letter,
            url_process_status
        },
        data() {
            return {
                selectedData: [],
                markHandleVisible: false,
                abnormalInfo: {},
                partAllOptions:[
                    { name:'编辑',value:0 },
                    { name:'查看',value:1 },
                    { name:'删除',value:2 },
                ]
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            batch_select(val) {
            },
            reply(row) {
                let {tracking_number, is_use_text, abnormal_type, abnormal_content, id, propose_user_id} = row;
                this.abnormalInfo = {
                    tracking_number,
                    is_use_text,
                    abnormal_content,
                    abnormal_id: id,
                    abnormal_type: abnormal_type,
                    recipient: propose_user_id
                };
                abnormal_type === 0 && (this.abnormalInfo.purchase_order_id = '');
                this.markHandleVisible = true;
            },
            make_handle() {
                let ids = this.handleSelect.map(row => row.id);
                this.$http(api_process_status, {ids}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_process_status', false);
                    }, 200);
                })
            }
        },
        computed: {
            handleSelect() {
                return this.selectedData.filter(row => {
                    if (row.processing_status === 0) {
                        if (row.is_use < 2) {
                            return true;
                        } else {
                            return row.processing_method !== '';
                        }
                    } else {
                        return false;
                    }
                })
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            abnormalHandle: require('./abnormal-handle.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            tableModule:require('./table-module').default,
        }
    }
</script>
