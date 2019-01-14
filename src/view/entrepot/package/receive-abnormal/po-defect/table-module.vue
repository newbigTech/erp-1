<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="requestButton"
                        req-key="api_process_status"
                        @click="make_handle"
                        :disabled="handleSelect.length === 0"
                        type="primary"
                        size="mini"
                        :route="apis.url_process_status">
                标记为已处理
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
            <el-table-column label="处理状态" min-width="45" inline-template>
                <div>{{row.processing_status_text}}</div>
            </el-table-column>
            <el-table-column label="发起部门" min-width="55" inline-template>
                <div>{{row.propose_department_text}}</div>
            </el-table-column>
            <el-table-column label="发起人" min-width="50" inline-template>
                <ui-tip :content="row.propose_user_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="受理人" min-width="50" inline-template>
                <ui-tip :content="row.receive_user_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="发起时间" min-width="95" inline-template>
                <div>{{row.process_begin_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="运输方式" min-width="50" inline-template>
                <ui-tip :content="row.shipping_methods" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="运单号" min-width="80" inline-template>
                <div>
                    {{row.tracking_number}}
                </div>
            </el-table-column>
            <el-table-column label="采购单号" min-width="80" inline-template>
                <ui-tip :content="row.purchase_order_ids" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="仓库" min-width="70" inline-template>
                <ui-tip :content="row.warehouse_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="预接收时间" min-width="95" inline-template>
                <div>{{row.ready_receive_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="接收时间" min-width="95" inline-template>
                <div>{{row.create_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="包裹状态" min-width="50" inline-template>
                <div>{{row.is_use_text}}</div>
            </el-table-column>
            <el-table-column label="异常类型" min-width="50" inline-template>
                <ui-tip :content="row.abnormal_content" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="跟进人" min-width="50" inline-template>
                <ui-tip :content="row.reply_user_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="跟进结果" min-width="55" inline-template>
                <div>{{row.processing_method || '--'}}</div>
            </el-table-column>
            <el-table-column label="跟进时间" min-width="95" inline-template>
                <div>{{row.follow_up_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="50" inline-template>
                <div>
                    <permission tag="span"
                                @click="reply(row)"
                                v-if="row.purchase_order_ids === ''"
                                :route="apis.url_reply_letter"
                                class="operate">跟进
                    </permission>
                    <permission tag="span"
                                v-else
                                :class="{disabled: row.purchase_order_ids !== ''}"
                                :disabled="row.purchase_order_ids !== ''"
                                :route="apis.url_reply_letter"
                                class="operate">跟进
                    </permission>
                    <span>&nbsp;|&nbsp;</span>
                    <span v-if="true" class="operate" @click="upload_img(row)">上传凭证</span>
                    <span v-else class="operate" @click="look_img(row)">查看凭证</span>
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
        <img-upload v-model="imgVisible"
                    :limit="2" sure-text="上传"
                    :image-info="imageInfo"
                    @upload="upload_img_sure"
                    :need-add="needAdd"></img-upload>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    import {
        url_reply_letter,
        api_process_status,
        api_abnormal_certificate,
        url_process_status} from "@/api/ready-receive";

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
                image: {},
                imgVisible: false,
                needAdd: true,//是否为提交凭证
                imageInfo: {
                    title: '',
                    images: [],
                },
                curParams: {},
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
                this.selectedData = val;
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
                abnormal_type === 0 && (this.$set(this.abnormalInfo,'purchase_order_ids', [{id: ''}]));
                this.markHandleVisible = true;
            },
            //上传凭证
            upload_img(row) {
                this.imageInfo = {
                    title: `提交运单号：${row.tracking_number}的凭证`,
                    images: row.certificate_files,
                };
                this.curParams = {
                    abnormal_id: row.id,
                };
                this.needAdd = true;
                this.imgVisible = true;
            },
            upload_img_sure(certificate_files) {
                let data = {
                    certificate_files: certificate_files.map(row => row.path),
                };
                Object.assign(data, this.curParams);
                this.$http(api_abnormal_certificate, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.imgVisible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            //查看凭证
            look_img(row) {
                this.imageInfo = {
                    title: `查看运单号：${row.tracking_number}的凭证`,
                    images: row.certificate_files,
                };
                this.needAdd = false;
                this.imgVisible = true;
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
            imgUpload: require('@/components/img-upload.vue').default,
        }
    }
</script>
