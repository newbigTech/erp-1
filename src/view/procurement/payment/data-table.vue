<template>
    <div class="purchase-apply-data-table">
        <div class="mb-sm mt-sm">
            <!--导出按钮-->
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :route="apis.url_purchase_apply_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <!--采购审核通过虚拟付款申请-->
            <permission tag="request-button" :route="apis.url_purchase_audit_purchaser"
                        class="inline ml-xs"
                        req-key="url_purchase_audit_purchaser"
                        :mintime="200"
                        v-if="this.paymentStatus === 0"
                        :request="audit" :disabled="selects.length === 0 || this.paymentStatus !== 0">批量审核通过
            </permission>
            <!--财务审核通过虚拟付款申请-->
            <permission tag="request-button" :route="apis.url_purchase_apply_audit"
                        class="inline ml-xs"
                        req-key="url_purchase_apply_audit"
                        :mintime="200"
                        v-if="this.paymentStatus === 2"
                        :request="audit1" :disabled="selects.length === 0 || this.paymentStatus !== 2">批量审核通过
            </permission>
            <!--财务复核通过虚拟付款申请-->
            <permission tag="request-button" :route="apis.url_purchase_apply_audit2"
                        class="inline ml-xs"
                        req-key="url_purchase_apply_audit2"
                        :mintime="200"
                        v-if="this.paymentStatus === 4"
                        :request="audit2" :disabled="selects.length === 0 || this.paymentStatus !== 4">批量审核通过
            </permission>
            <request-button @click="batch_no_pass"
                            class="inline ml-xs"
                            v-if="this.paymentStatus === 0 || this.paymentStatus === 2 || this.paymentStatus === 4"
                            :disabled="selects.length === 0">批量审核不通过</request-button>
            <permission tag="request-button"
                        :route="apis.url_purchase_apply_mark_payed"
                        class="inline ml-xs"
                        v-if="this.paymentStatus === 5"
                        :mintime="200"
                        :disabled="selects.length === 0 || this.paymentStatus !== 5"
                        req-key="url_purchase_apply_mark_payed"
                        @click="mark_all">批量标记付款
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_purchase_apply_cancel"
                        class="inline ml-xs"
                        v-if="this.paymentStatus === 5"
                        type="primary"
                        size="mini"
                        :mintime="200"
                        :disabled="selects.length === 0 || this.paymentStatus !== 5"
                        @click="all_no_pass">批量取消付款
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_purchase_export_fuyou"
                        class="inline ml-xs"
                        :mintime="200"
                        type="primary"
                        size="mini"
                        :disabled="selects.length === 0"
                        @click="export_fuyou">导出至富友
            </permission>
            <div class="fr mt-sm red bold-font">
                <div><span>申请付款总额：CNY {{payTotal.CNY | pay_filter}}<span class="ml-md">USD </span>{{payTotal.USD | pay_filter}}</span>
                <span class="ml-lg">已付款金额：CNY {{paidTotal.CNY | pay_filter}}<span class="ml-md">USD </span>{{paidTotal.USD | pay_filter}}</span>
                </div>

            </div>
        </div>
        <el-table
            :data="tableData"
            v-loading="loading" element-loading-text="玩命加载中..."
            highlight-current-row
            v-resize="{height:41}"
            style="width: 100%"
            @selection-change="select_change"
            @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column label="付款申请单号"  min-width="50" inline-template>
                <div>{{row.id}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="50" inline-template>
                <div class="cut-off-td">{{row.purchaser}}</div>
            </el-table-column>
            <el-table-column label="供应商" min-width="100" inline-template>
                <div class="p-table-list-td-text pointer">
                    <!--<permission tag="span" :route="apis.url_look_supplier" @click="look_supplier(row)"-->
                                <!--style="color: #69f;" title="点击可查看供应商详情">{{row.supplier}}-->
                    <!--</permission>-->
                    <span style="color: #69f;" title="点击可查看供应商详情" @click="look_supplier(row)">{{row.supplier}}</span>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" min-width="65" inline-template>
                <div class="p-table-list-td-text" :title="row.balance_text | filterCount">{{row.balance_text | filterCount}}</div>
            </el-table-column>
            <el-table-column label="币种" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.currency_code">{{row.currency_code}}</div>
            </el-table-column>
            <el-table-column label="申请付款总额" min-width="65" inline-template sortable>
                <div class="p-table-list-td-text" :title="row.apply_amount|filterAmount">{{row.apply_amount | filterAmount}}</div>
            </el-table-column>
            <el-table-column label="已付款金额" min-width="65" inline-template sortable>
                <div class="p-table-list-td-text cut-off-td" :title="row.payment_amount|filterAmount">{{row.payment_amount|filterAmount}}</div>
            </el-table-column>
            <el-table-column label="付款状态" min-width="55" inline-template>
                <div style="position: relative">
                    <span>{{row.status | filterStatus}}</span>
                </div>
            </el-table-column>
            <el-table-column label="采购类型" min-width="75" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_plan_type">{{row.purchase_plan_type}}</div>
            </el-table-column>
            <el-table-column label="申请时间" inline-template min-width="80" sortable>
                <ui-tip :content="row.create_time_date" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column label="付款时间" inline-template min-width="80" sortable>
                <ui-tip :content="row.payment_time | timeFilter" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column label="最迟付款日期" inline-template min-width="60" sortable>
                <div :class="{'red-color': row.payment_last_time>0?new Date(now).toDateString() === new Date(row.payment_last_time*1000).toDateString() || row.payment_last_time < thisNow:''}">{{row.payment_last_time | dataFilter}}</div>
            </el-table-column>
            <!--<el-table-column label="距离最迟付款时间" inline-template min-width="65" v-if="late_time">-->
                <!--<div :class="{'red-color': row.payment_last_time >0 ? row.payment_last_time - this.now <= 24*60*60*7 : ''}">{{ row.payment_last_time | lateFilter}}</div>-->
            <!--</el-table-column>-->
            <el-table-column min-width="70" inline-template label="操作">
                <trends-select :key="row.id" :selects="get_operate(row)" @trigger="action($event,row)">
                </trends-select>
            </el-table-column>
        </el-table>
        <!--采购单号详情-->
        <look-list v-model="lookVisable" :lookData="lookData" :edit="false" :listId="listId" @save-logistics="save_logistics">
        </look-list>
        <look-edit v-model="lookEditVisable"
                   @search="$listeners['reflash']"
                   :check-list="checkList"
                   :is-invalid-audit="isInvalidAudit"
                   :title="look_title"
                   :is-cancel-pay="isCancelPay">
        </look-edit>
        <payment-look v-model="paymentVisable"
                      v-loading="loading_payment"
                      element-loading-text="玩命加载中..."
                      @search="$listeners['reflash']"
                      :title="look_title"
                      :check-list="checkListDeal">
        </payment-look>
        <edit-lookover v-model="dialog"
                       :isLook="true"
                       :removeFile="removeFile"
                       :removeInformation="removeInformation"
                       :look-edit-form="lookEditForm"
                       :title="editLookTitle" >
        </edit-lookover>
        <!--操作日志-->
        <operation-log v-model="log_view" :checkList="operationLog"></operation-log>
        <!--标记付款-->
        <mark-pay v-model="markPayVisable" :checkList="checkListMarkPay" :title="mark_title" :pay_loading="loading_mark" @search="$listeners['reflash']"></mark-pay>
        <!--批量审核不通过-->
        <look-reason v-model="failedVisable" :addData="failed_data" :title="view_title" @add_ymx="submit_audit" :reason="input_reason"></look-reason>
        <!--导出富有弹框-->
        <export-fuyou v-model="fuyou_lay" @export_sure="export_sure" :fuyouRate="fuyouRate"></export-fuyou>
        <!--导出队列-->
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
    </div>
</template>
<style lang="stylus">
    .purchase-apply-data-table {
        .red-color{
            color: #f00;
        }
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        .box-label {
            box-sizing: border-box;
            width: 100%;
            color: #5e6d82;
            font-size: 1.25rem;
            padding: 0 21px 10px;
            display: inline-block;
            border-bottom: 2px solid #dee5ee;
            margin-bottom: 20px;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
            overflow-y: auto;
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9*/
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari Chrome */
                -o-transform: scale(1.1); /* opera */
            }
        }
        .p-table-list-td-text {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .el-table__row td{
            padding: 0 0;
        }
        .el-table__row .cell{
            padding: 0 0;
        }
        .el-table__row .cell .cut-off-td:not(:last-child) {
            border-bottom: 1px solid #e0e6ed;
        }
        .el-table__row .cell .cut-off-td {
            height: 25px;
            line-height: 25px;
        }
        .el-dropdown .el-button-group .el-button--warning {
            color: #fff;
            background-color: #2ea0e3;
            border-color: #2ea0e3;
        }
        .el-dropdown .el-button-group .el-button--primary {
            color: #fff;
            background-color: #33b2f;
            border-color: #33b2f;
        }
    }
</style>
<script>
    import {
        api_cancel_pay,
        url_purchase_apply_export,
        api_purchase_apply_export,
        url_purchase_look_apply,
        api_purchase_look_apply,
        url_purchase_edit_apply,
        api_purchase_edit_apply,
        api_calculating_money,
        api_purchase_apply_mark_payed,
        url_purchase_apply_mark_payed,
        url_purchase_audit_purchaser,
        url_purchase_apply_audit,
        url_purchase_apply_audit2,
        api_purchase_apply_audit2,
        api_purchase_apply_audit,
        api_purchase_audit_purchaser,
        api_purchase_apply_cancel,
        url_purchase_apply_cancel,
        url_purchase_export_fuyou,
        api_purchase_export_fuyou,
        api_goods_export_template,
        api_purchase_apply_export_fields,
        api_purchase_operation_log,
        url_purchase_operation_log,
    } from "../../../api/finance-purchase"
    import {api_finance_pay, url_finance_pay,url_finance_pay_apply,api_finance_pay_apply,api_finance_list,url_finance_list} from "../../../api/Payment"
    import {api_look_detail, url_publish_look_detail} from "../../../api/purchase"
    import {api_look_supplier, url_look_supplier} from "../../../api/assert-sup"
    import lookList from "../../procurement/purchase/look-list.vue"
    import editLookover from '../suppliers/assert-sup/edit-lookover.vue';
    import {downloadFile} from '../../../lib/http';
    const actions = {
        look: {
            name: "查看",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.isInvalidAudit = false;
                    this.look_title = `查看付款申请单号：${row.id} 信息`;

                })
            }
        },
        log: {
            name: "操作日志",
            api: url_purchase_operation_log,
            action(row) {
                this.$http(api_purchase_operation_log, row.id).then(res => {
                    this.operationLog = res;
                    this.log_view = true;
                })
            }
        },
        audit: {
            name: "审核",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.isInvalidAudit = true;
                    this.look_title = `审核付款申请单号：${row.id} 信息`;
                })
            }
        },
        // export_invoice: {
        //     name: "导出发票",
        //     api: url_purchase_look_apply,
        //     action(row) {
        //         this.$http(api_purchase_look_apply, row.id).then(res => {
        //             this.checkList = res;
        //             this.lookEditVisable = true;
        //             this.isInvalidAudit = false;
        //             this.look_title = `查看付款申请单号：${row.id} 信息`;
        //         })
        //     }
        // },
        // upload_invoice: {
        //     name: "上传发票",
        //     api: url_purchase_look_apply,
        //     action(row) {
        //         this.$http(api_purchase_look_apply, row.id).then(res => {
        //             this.checkList = res;
        //             this.lookEditVisable = true;
        //             this.isInvalidAudit = false;
        //             this.look_title = `查看付款申请单号：${row.id} 信息`;
        //         })
        //     }
        // },
        deal: {
            name: "处理",
            api: url_purchase_edit_apply,
            action(row){
                this.$http(api_purchase_edit_apply, row.id).then(res => {
                    this.checkListDeal = res;
                    this.checkListDeal.detail.forEach(row => {
                            row.apply_amount = Number(row.apply_amount).toFixed(3);
                        });
                    this.paymentVisable = true;
                    this.loading_payment = false;
                    this.look_title = `处理付款申请单号: ${row.id} 信息`;
                })
            }
        },
        do_pay: {
            name: "标记付款",
            api: url_finance_list,
            action(row){
                this.$http(api_finance_list, {id: row.id, pageSize: 500}).then(res => {
                    res.data.map(row => {
                        this.$set(row, 'this_payment', Number(row.apply_amount - row.payment_amount).toFixed(3));
                    });
                    this.checkListMarkPay = res.data;
                    this.markPayVisable = true;
                    this.loading_mark = false;
                    this.mark_title = `标记付款申请单号: ${row.id} 信息`;
                })
            }
        },
        cancel_pay: {
            name: "取消付款",
            api: url_purchase_look_apply,
            action(row){
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.isCancelPay = true;
                    this.look_title = `取消付款申请单号: ${row.id} 信息`;
                })
            }
        }
    };
    export default {
        permission: {
            url_finance_pay,
            url_publish_look_detail,
            url_look_supplier,
            url_finance_list,
            url_purchase_apply_export,
            url_finance_pay_apply,
            url_purchase_look_apply,
            url_purchase_edit_apply,
            url_purchase_apply_mark_payed,
            url_purchase_audit_purchaser,
            url_purchase_apply_audit,
            url_purchase_apply_audit2,
            url_purchase_apply_cancel,
            url_purchase_export_fuyou,
        },
        data() {
            return {
                fuyouRate:{
                    rate: '',
                },
                fuyou_lay: false,
                checkListMarkPay:[],
                operationLog: [],
                log_view: false,
                removeInformation: [],
                removeFile: [],
                failed_data:{
                    remark:'',
                    status:'',
                    id:'',
                },
                export_visible: false, //导出管理队列
                input_reason: '',
                view_title:'',
                failedVisable: false,
                loading_payment: true,
                loading_mark: true,
                look_title:'',
                mark_title: '',
                isInvalidAudit: false,
                isCancelPay: false,
                button_list:{},
                checkList: {
                    detail:[],
                },
                checkListDeal: {},
                lookEditVisable: false,
                paymentVisable: false,
                payTotal:{
                    CNY: 0,
                    USD: 0,
                },
                paidTotal:{
                    CNY: 0,
                    USD: 0,
                },
                selects: [],
                lookVisable: false,
                markPayVisable: false,
                lookData: {},
                listId: 0,
                dialog: false,
                editLookTitle: '',
                lookEditForm: {},
                export_model_type: {
                    type: 12
                },
                exportVisable: false,
                fields: [],
                templates: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
            }
        },
        mounted(){
            this.get_templates();
            this.get_fields();
        },
        methods: {
            sort_change(val){
                this.$emit('sort-change',val)
            },
            get_fields() {//获取导出字段
                this.$http(api_purchase_apply_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selects.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            get_templates() {//保存导出模板
                this.$http(api_goods_export_template, {type: 12}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            public(url,params){
                return this.$http(url, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.failedVisable = false;
                    this.failed_data.remark = '';
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batch_failed',false);
                });
                return Promise.resolve();
            },
            submit_audit(){//提交批量审核不通过
                this.failed_data.remark = this.failed_data.remark.trim();
                if(this.failed_data.remark ===''){
                    this.$message({type: 'error', message: '请填写原因'});
                    this.$reqKey('batch_failed',false);
                    return;
                }
                let params = {
                    status: -1,
                    id: this.selects.map(row => row.id).join(','),
                    remark: this.failed_data.remark
                };
                let params2 = {
                    id: this.selects.map(row => row.id).join(','),
                    remark: this.failed_data.remark
                };
                if(this.paymentStatus === 0){
                    this.public(api_purchase_audit_purchaser,params);
                }else if(this.paymentStatus === 2){
                    this.public(api_purchase_apply_audit,params);
                }else if(this.paymentStatus === 4){
                    this.public(api_purchase_apply_audit2,params);
                }else{
                    this.public(api_purchase_apply_cancel,params2);
                }
            },
            all_no_pass(){//点击批量取消付款
                this.failedVisable = true;
                if(this.paymentStatus === 5){
                    this.view_title = '批量取消付款';
                    this.input_reason = '请填写取消付款的理由';
                }
            },
            batch_no_pass(){//点击批量审核不通过
                this.failedVisable = true;
                if(this.paymentStatus === 0 || this.paymentStatus === 2 || this.paymentStatus === 4){
                    this.view_title = '批量审核不通过';
                    this.input_reason = '请填写审核不通过的批注';
                     }
                },
            get_operate(row){
                let act = this.operateSelects(row);
                return act.filter(row => {
                    return this.$hasPermission(row.api);
                })
            },
            //点击查看 编辑等
            action(act, row) {
                this.listId = row.id;
                act.action.call(this, row);
            },
            operateSelects(row){//操作按钮 显示
                let action = [];
                if(row.button_list.is_display_view_bt === 1) {
                    action.push(actions.look);
                }
                if(row.button_list.is_display_view_log_bt === 1) {
                    action.push(actions.log);
                }
                if(row.button_list.is_display_audit_bt === 1) {
                    action.push(actions.audit);
                }
                // if(row.button_list.is_display_view_bt === 1) {//导出发票
                //     action.push(actions.export_invoice);
                // }
                // if(row.button_list.is_display_view_bt === 1) {//上传发票
                //     action.push(actions.upload_invoice);
                // }
                if (row.button_list.is_display_deal_bt === 1) {
                    action.push(actions.deal);
                }
                if (row.button_list.is_display_do_pay_bt === 1) {
                    action.push(actions.do_pay);
                }
                if (row.button_list.is_display_cancel_pay_bt === 1) {
                    action.push(actions.cancel_pay);
                }
                return action;
            },
            order_export(params) {//部分 全部导出
                return this.$http(api_purchase_apply_export, params).then(res => {
                    if(res.join_queue === 1){
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    }else {
                        let params = {
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: 'success', message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_excel(val) {
                // val.action.call(this, val);
                if (val.value === 2 && this.selects.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            init_params() {
                let params = window.clone(this.searchData);
                if (this.searchData.date_b) {
                    params.date_b = datef("YYYY-MM-dd", this.searchData.date_b / 1000)
                } else {
                    params.date_b = "";
                }
                if (this.searchData.date_e) {
                    params.date_e = datef("YYYY-MM-dd", this.searchData.date_e / 1000)
                } else {
                    params.date_e = "";
                }
                if(params.snText.trim()){
                    params.snText = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                }else{
                    params.snText = '';
                }
                if(this.searchData.balance_type.length >0){
                    params.balance_type = this.searchData.balance_type.join(',');
                }else{
                    params.balance_type = '';
                }
                params.payment_status = this.paymentStatus;
                return params
            },
            //check 选择
            select_change(val) {
                this.selects = val;
                let arr2 = this.selects.map(row => row.id);
                let arr3 = this.selects.length === 0 ? '' : arr2.map(String);
                this.$http(api_calculating_money, {ids: arr3}).then(res => {
                    this.payTotal = res.total_apply_amount;
                    this.paidTotal = res.total_payment_amount;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //点击批量审核通过
            audit() {//采购审核核通过
                let ids = this.selects.map(row => row.id);
                ids = ids.join(',');
                let params = {
                    status: 1,
                    id: ids,
                };
                this.$confirm(`此操作为批量审核通过勾选的数据, 确认此操作吗 ?`, '提示',{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                this.$http(api_purchase_audit_purchaser,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit("reflash");
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_purchase_audit_purchaser', false);
                    }, 200);
                 });
                }).catch(() => {
                    this.$message({type: "info", message: "已取消", duration: 800});
                })
            },
            audit1() {//待财务审核通过
                let ids = this.selects.map(row => row.id);
                ids = ids.join(',');
                let params = {
                    status: 1,
                    id: ids,
                };
                this.$confirm(`此操作为批量审核通过勾选的数据, 确认此操作吗 ?`, '提示',{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                this.$http(api_purchase_apply_audit,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit("reflash");
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_purchase_apply_audit', false);
                    }, 200);
                });
            }).catch(() => {
                  this.$message({type: "info", message: "已取消", duration: 800});
             })
            },
            audit2() {//待财务复核通过
                let ids = this.selects.map(row => row.id);
                    ids = ids.join(',');
                let params = {
                    status: 1,
                    id: ids,
                };
                this.$confirm(`此操作为批量审核通过勾选的数据, 确认此操作吗 ?`, '提示',{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                this.$http(api_purchase_apply_audit2,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit("reflash");
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_purchase_apply_audit2', false);
                    }, 200);
                    })
                }).catch(() => {
                    this.$message({type: "info", message: "已取消", duration: 800});
                })
            },
            mark_all(){//点击批量标记付款
                if (this.selects.length === 0) {
                    this.$reqKey('url_purchase_apply_mark_payed', false);
                    this.$message({type: 'warning', message: '请选择一条数据',});
                    return
                }
                this.mark_title = "批量标记付款";
                let ids = this.selects.map(row => row.id);
                let name = this.selects.map(row => row.purchase_order_id);
                ids = ids.join(',');
                name = name.join(',');
                this.$http(api_finance_list, {id:ids,pageSize: 500}).then(res =>{
                    res.data.map(row => {
                        this.$set(row, 'this_payment', Number(row.apply_amount - row.payment_amount).toFixed(3));
                    });
                    this.checkListMarkPay = res.data;
                    this.markPayVisable = true;
                    this.loading_mark = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    this.$reqKey('url_purchase_apply_mark_payed', false);
                })
            },
            show_message(info,type){//导出提示
                if(info.message&&Array.isArray(info.message)) {
                    let newDatas = [];
                    const h = this.$createElement;
                    for (let i in info.message) {
                        newDatas.push(h('p', null, info.message[i]));
                    }
                    this.$msgbox({title: '提示', type, message: h('div', null, newDatas) || info});
                }else{
                    this.$message({type, message:info.message||info});
                }
            },
            export_sure(){//确定导出至富友
                let ids = this.selects.map(row => row.id);
                this.$http(api_purchase_export_fuyou,{ids: ids,export_type: 2, rate: this.fuyouRate.rate}).then(res => {
                    if(res.join_queue ===1){
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    }else{
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.show_message(res,'success');
                        this.fuyou_lay = false;
                    }
                }).catch(code => {
                    this.show_message(code,'error');
                })
            },
            export_fuyou(){//导出至富友弹框
                this.fuyou_lay = true;
            },
            cancel_pay(row) {//取消付款
                this.$confirm(`您将为采购单${row.purchase_order_code}取消付款, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.Nopay({id: row.id, status: 3}, row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            // 取消付款 的付款接口 api_cancel_pay
            Nopay(data) {
                return this.$http(api_cancel_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit("reflash");
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //审核通过
            mark_pay(row) {
                this.$confirm(`此操作为采购单${row.purchase_order_code}审核通过, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pay({id: row.id, status: 1})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审核'
                    });
                });
            },
            //付款接口
            pay(data) {
                return this.$http(api_finance_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit("reflash");
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //采购单详情
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date)
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            /*------查看供应商*/
            look_supplier(row) {
                this.editLookTitle = `查看供应商: ${row.supplier} 信息`;
                this.$http(api_look_supplier, row.supplier_id).then(res => {
                    this.lookEditForm = res;
                    this.dialog = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            }

        },
        filters: {
            filterCount(val){
                return val ==='' ? '-- --' : val;
            },
            filterStatus(val){//付款状态
                const statusArr = new Map()
                    .set(0,"待采购审核")
                    .set(1,"采购审核不通过")
                    .set(2,"待财务审核")
                    .set(3,"财务审核不通过")
                    .set(4,"待采购排款")
                    .set(5,"待付款")
                    .set(6,"已付款")
                    .set(7,"取消付款")
                    .set(8,"部分付款")
                    .set(-1,"作废")
                    .set(-4,"财务复核不通过");
                return statusArr.get(val);
            },
            pay_filter(val){
                return val? Number(val).toFixed(3):'0.000';
            },
            // lateFilter(val){
            //     let dateNow = Math.ceil(new Date().getTime()/1000);
            //     let sec = dateNow - val;
            //         sec = Math.abs(sec);
            //     let d = Math.floor(sec/86400);
            //     let h = Math.floor((sec-(d*86400))/3600);
            //     if((dateNow > val)&& val>0){
            //         return  d < 1 ? '0天' : `已超时${d}天${h}时`;
            //     }else if(val >= dateNow){
            //         return `${d}天${h}时`;
            //     }else{
            //         return '-- --'
            //     }
            // },
            paymentFilter(val) {
                switch (val) {
                    case 0:
                        return "待审核";
                        break;
                    case 1:
                        return "已审核";
                        break;
                }
            },
            dataFilter(val) {
                if(val>0){
                    return datef('YYYY-MM-dd', val);
                } else{
                    return '-- --'
                }
            },
            timeFilter(val){
                if(val>0){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else{
                    return '-- --'
                }
            },
            filterAmount(val){
                if(Number(val)>=0){
                    return Number(val).toFixed(3);
                }
            }
        },
        computed: {
            now(){
                return new Date().getTime();
            },
            thisNow(){
                return Math.ceil(new Date().getTime()/1000);
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
            // time_show(){
            //     if(this.paymentStatus === 6 || this.paymentStatus === 8 || this.paymentStatus  === ''){
            //         return true;
            //     }else{
            //         return false;
            //     }
            // },
            // late_time(){
            //     if(this.paymentStatus === 6 || this.paymentStatus === 8){
            //         return false;
            //     }else{
            //         return true;
            //     }
            // }
        },
        watch: {
            lookEditVisable(val) {
                if(!val){
                    this.isInvalidAudit = false;
                    this.isCancelPay = false;
                }
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            paymentStatus: {},
            loading: {
                required: true,
                type: Boolean
            },
            searchData: {},
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            lookList,
            editLookover,
            uiTips: require("../../../components/ui-tips.vue").default,
            times: require('../../../components/times.vue').default,
            trendsSelect: require('../../../components/trends-select').default,
            uiTip: require('@/components/ui-tip.vue').default,
            lookEdit:require('./look-edit.vue').default,
            paymentLook:require('./payment-look.vue').default,
            lookReason:require('./look-reason.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            exportDialog: require('../../report/export-dialog').default,
            exportField: require("@/components/export-field").default,
            operationLog: require('./operation-log.vue').default,
            markPay: require('./mark-pay.vue').default,
            exportFuyou: require('./export-fuyou.vue').default
        }
    }
</script>
