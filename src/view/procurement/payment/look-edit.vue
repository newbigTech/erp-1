<template>
    <page-dialog class="purchase-look" v-model="visible" @close="close" size="large" :title="title">
        <div class="mt-lg">
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>申请付款总额 : </span> <span>{{checkList.currency_code}} {{checkList.apply_amount | filtersPay}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>付款状态 : </span> <span> {{checkList.status | filterStatus}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>供应商 : </span> <span>{{checkList.supplier}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>结算方式 : </span> <span>{{checkList.balance_text}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>申请时间 : </span> <span>{{checkList.create_time_date}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>最迟付款时间 : </span> <span>{{checkList.payment_last_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <div class="card-line"></div>
            <el-table :data="checkList.detail" border>
                <el-table-column inline-template label="采购单号" align="center">
                    <div style="color: #69f;cursor:pointer;" title="点击可查看采购详情" @click="look_(row)">{{row.purchase_order_code}}</div>
                </el-table-column>
                <el-table-column inline-template label="外部流水号" align="center" min-width="120">
                    <div>{{row.external_number | filterCount}}</div>
                </el-table-column>1
                <el-table-column inline-template label="1688账号" align="center">
                    <div>{{row.account_1688 | filterCount}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购单状态" align="center">
                    <div>{{row.purchase_order_status_text}}</div>
                </el-table-column>
                <el-table-column inline-template label="币种" align="center">
                    <div>{{row.currency_code}}</div>
                </el-table-column>
                <el-table-column inline-template label="申请付款金额" align="center">
                    <div>{{row.apply_amount | filtersPay}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购类型" align="center">
                    <div>{{row.purchase_type}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购员" align="center">
                    <div>{{row.purchaser}}</div>
                </el-table-column>
            </el-table>
            <div class="inline mt-lg full-width breakAll" v-if="(checkList.status ===1 && !!checkList.remark)|| (checkList.status ===3 && !!checkList.remark) || (checkList.status === -4 && !!checkList.remark)"><span class="bold-font">批注 : </span> {{checkList.remark}}</div>
            <div class="inline mt-lg full-width breakAll" v-if="checkList.status ===7 && !!checkList.remark"><span class="bold-font">取消付款原因 : </span> {{checkList.remark}}</div>
            <!--<div class="mt-lg">-->
                <!--<label>*商业发票：</label>-->
                <!--<image-upload v-model="checkList.payment_image"-->
                              <!--@remove-img="remove_payment_image"-->
                              <!--:download-img="downloadImg"-->
                              <!--:is-look="true"-->
                              <!--:show-download="true"-->
                              <!--:maximum="5"-->
                              <!--:maximize="1048576"-->
                              <!--class="inline"-->
                              <!--ref="images-file">-->
                <!--</image-upload>-->
            <!--</div>-->
            <!--<blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>-->
            <el-card style="position: absolute;right:15px;bottom:55px;z-index: 99999;"
                     v-if="showRemark"
                     class="el_card_remark">
                <div class="remark-sale-look" style="position: inherit;">
                    <label class="remark-sale-header" v-if="isInvalidAudit">审核不通过的原因: </label>
                    <label class="remark-sale-header" v-if="isCancelPay">取消付款的原因: </label>
                    <el-form class="remark-sale-body">
                        <el-form-item>
                            <el-input type="textarea" :maxlength="100" placeholder="请输入原因"
                                      :autosize="{ minRows: 4, maxRows: 6}"  v-model="reason">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="remark-sale-footer">
                        <div class="fr mb-xs">
                            <request-button :request="submit_purchaser" v-if="isInvalidAudit && checkList.status === 0">提交</request-button>
                            <request-button :request="submit_audit" v-if="isInvalidAudit && checkList.status === 2">提交</request-button>
                            <request-button :request="submit_review" v-if="isInvalidAudit && checkList.status === 4">提交</request-button>
                            <request-button :request="submit_cancel" v-if="isCancelPay">提交</request-button>
                            <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div slot="footer">
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 2">
                <permission tag="requestButton"
                            req-key="auditPass"
                            @click.native="audit"
                            :route="apis.url_purchase_apply_audit">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_apply_audit">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 4">
                <permission tag="requestButton"
                            req-key="auditApply2"
                            @click.native="audit2"
                            :route="apis.url_purchase_apply_audit2">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_apply_audit2">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 0">
                <permission tag="requestButton"
                            req-key="auditApply3"
                            @click.native="audit3"
                            :route="apis.url_purchase_audit_purchaser">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_audit_purchaser">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isCancelPay">
                <el-button size="mini" type="primary" @click.native="cancel_pay">取消付款</el-button>
            </div>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
        <!--查看采购单详情-->
        <look-list v-model="lookVisable" :lookData="lookData" :edit="false" :listId="listId"
                   @save-logistics="save_logistics">
        </look-list>
    </page-dialog>
</template>
<style lang="stylus">
    .purchase-look {
        .audit-reason {
            display: inline-block;
            vertical-align: top;
        }
        .row-content{
            display: flex;
            align-items: center;
            span:first-child{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:6px 5px;
                font-weight: bold;
            }
            span:last-child{
                width: 80%;
            }
        }
        .card-line{
            border-top: 1px solid #dee5ee;
            height: 15px;
            margin-top: 30px;
        }
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                top: 67px;
                right: 7px;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
<script>
    import {
        url_purchase_apply_audit,
        api_purchase_apply_audit,
        url_purchase_apply_audit2,
        api_purchase_apply_audit2,
        url_purchase_apply_mark_payed,
        api_purchase_apply_mark_payed,
        url_purchase_apply_cancel,
        api_purchase_apply_cancel,
        url_purchase_audit_purchaser,
        api_purchase_audit_purchaser
    } from "../../../api/finance-purchase"
    import {api_look_detail} from "../../../api/purchase"
    import {downloadFile} from '@/lib/http';
    export default {
        permission: {
            url_purchase_apply_audit,
            url_purchase_apply_audit2,
            url_purchase_apply_mark_payed,
            url_purchase_apply_cancel,
            url_purchase_audit_purchaser
        },
        data() {
            return {
                imgPath: '',
                imgDialog: false,
                removePaymentImage: [],
                listId: 0,
                lookData: {},
                lookVisable: false,
                showRemark:false,
                visible: false,
                reason: '',
                auditorList: [],
            }
        },
        filters: {
            filterCount(val){
                return val ===''? '-- --' : val;
            },
            fdatetime(val) {
                if (val) return datef("YYYY-MM-dd", val);
            },
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filtersPay(val){
                if(Number(val)>0){
                    return Number(val).toFixed(3);
                }
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
            filterNumber(val){
                if(Number(val) > 0){
                    return Number(val).toFixed(4);
                }else{
                    return '-- --';
                }
            }
        },
        methods: {
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            remove_payment_image(arr){
                this.removePaymentImage.push(...arr);
            },
            look_(info) {//查看采购详情
                this.lookVisable = true;
                this.lookData = {};
                this.$set(this, "listId", info.purchase_order_id);
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, info.purchase_order_id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            audit_cancel(){},
            cancel_pay(){
                this.showRemark = true;
            },
            submit_purchaser(){//采购审核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_audit_purchaser, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            submit_audit(){//待财务审核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            submit_review(){//财务复核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit2, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            deny() {
                this.showRemark = true;
            },
            audit3() {//采购审核核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_audit_purchaser,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply3', false);
                    }, 200);
                });
            },
            audit() {//待财务审核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditPass', false);
                    }, 200);
                });
            },
            audit2() {//财务复核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit2,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply2', false);
                    }, 200);
                });
            },
            submit_cancel() {//取消付款
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_cancel, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            refresh() {//刷新页面
                this.visible = false;
                this.$emit('search');
            },
            close() {// 关闭页面，清除缓存
                this.reason = '';
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
                if(!val){
                    this.showRemark = false;
                }
            }
        },
        computed:{},
        props: {
            value: {},
            isLook: {},
            isAudit: {},
            title: {},
            rowId:[Number,String],
            checkList: {required: true, type: Object,},
            isInvalidAudit: {required: true, type: Boolean},
            isCancelPay:{required: true, type: Boolean},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            card:require('../../../components/card.vue').default,
            lookList:require('../../procurement/purchase/look-list.vue').default,
            // imageUpload: require('./image-upload').default,
            // blowupImage: require("@/components/blowup-image").default,
        }
    }
</script>
