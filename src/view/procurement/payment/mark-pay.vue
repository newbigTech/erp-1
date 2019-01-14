<template>
    <div class="mark-pay-class">
        <page-dialog v-model="show" :title="title" width="80%" @close="close">
            <el-table border
                      :data="checkList"
                      style="width: 100%;"
                      v-loading="pay_loading">
                <el-table-column width="100" label="付款申请单号" prop="id">
                </el-table-column>
                <el-table-column label="供应商" width="150" inline-template>
                    <div class="p-table-list-td-text" :title="row.supplier">{{row.supplier}}</div>
                </el-table-column>
                <el-table-column label="结算方式" width="140" inline-template>
                    <div>{{row.balance_text | filterCount}}</div>
                </el-table-column>
                <el-table-column label="申请时间" prop="create_time_date" width="140">
                </el-table-column>
                <el-table-column label="最迟付款时间" width="120" inline-template>
                    <div :class="{'red-color': row.payment_last_time - parseInt(new Date()/1000) < 24*60*60*7}">{{row.payment_last_time | dateFilter}}</div>
                </el-table-column>
                <el-table-column label="币种" width="60" prop="currency_code">
                </el-table-column>
                <el-table-column label="申请付款总额" width="130" inline-template>
                    <div>{{row.apply_amount | pay_filter}}</div>
                </el-table-column>
                <el-table-column label="已付款金额" width="130" inline-template>
                    <div>{{row.payment_amount | pay_filter}}</div>
                </el-table-column>
                <el-table-column label="本次支付最大金额" width="150" inline-template>
                    <div>{{(row.apply_amount - row.payment_amount) | pay_filter}}</div>

                </el-table-column>
                <el-table-column label="本次付款金额" inline-template>
                    <div class="deal-center-pay">
                        <ui-limit-number v-model="row.this_payment"
                                         style="width:130px;margin-left:51px;"
                                         @blur="update_price(row)"
                                         :limit="3"
                                         :min="0"
                                         :class="{'limit-input': row.this_payment > (row.apply_amount*10000- row.payment_amount*10000)/10000}">
                        </ui-limit-number>
                        <div v-if="row.this_payment > (row.apply_amount*10000 - row.payment_amount*10000)/10000" class="red" ref="showDiv">本次付款金额不可大于本次支付最大金额</div>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <!--<el-button size="mini" type="primary" @click.native="sure_pay">确认付款</el-button>-->
                <request-button req-key="batch_failed" @click.native="sure_pay">确认付款</request-button>
                <el-button size="mini" @click.native="show = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .mark-pay-class{
        .red-color{
            color: #f00;
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .limit-input{
            .el-input__inner{
                border: 1px solid #f00;
            }
        }
        .deal-center-pay{
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 5px 5px;
        }
    }
</style>

<script>
    import {api_purchase_apply_mark_payed} from "../../../api/finance-purchase"

    export default {
        data(){
            return{
                show: false,
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        methods: {
            close(){},
            sure_pay(){//确认付款
                let ids = this.checkList.map(row => {return row.id});
                let pay_amount = this.checkList.map(row => {return row.this_payment});
                if(this.$refs.showDiv){
                    this.$reqKey('batch_failed', false);
                    return;
                }
                let obj = {};
                ids.forEach((item,index) => {
                    obj[item] = pay_amount[index];
                });
                let data = {
                    data: obj
                };
                this.$http(api_purchase_apply_mark_payed, data).then(res => {
                     this.$message({type: 'success', message: res.message || res});
                     this.show = false;
                     this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batch_failed', false);
                });
            },
            update_price(row){
                if(row.this_payment < 0){
                    row.this_payment = 0;
                }
                row.this_payment = Number((row.this_payment * 1000) / 1000).toFixed(3);
            }
        },
        filters: {
            dateFilter(val){
               if(val >0){
                   return datef('YYYY-MM-dd', val);
               }else{
                   return '-- --'
               }
            },
            pay_filter(val){
                if(Number(val)>=0){
                    return Number(val).toFixed(3);
                }
            },
            filterCount(val){
                return val ==='' ? '-- --' : val;
            },
        },
        props: {
            pay_loading: {required: true, type: Boolean},
            value: {},
            checkList: {
                required: true,
                type: Array,
            },
            title:{
                required: true,
                type: String,
            },
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number').default,
            requestButton: require('../../../global-components/request-button').default,
        }
    }
</script>

