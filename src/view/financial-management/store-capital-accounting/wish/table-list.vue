<template>
    <div>
        <el-table :data="table.list"
                  v-loading="loading"
                  v-resize="{height:41}"
                  element-loading-text="玩命加载中..."
                  @selection-change="selectionChange"
                  @select-all="select_all"
                  highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>>
            <el-table-column type="selection"
                             :selectable="can_checkbox"
                             width="40">
            </el-table-column>
            <el-table-column label="日期范围" inline-template width="170">
                <span v-if="row.hasDate">{{row.date_s}}--{{row.date_e}}</span>
                <span class="bold-font" v-else>汇 总</span>
            </el-table-column>
            <el-table-column label="账号简称" prop="account"></el-table-column>
            <el-table-column label="销售员" prop="seller" width="80"></el-table-column>
            <el-table-column label="订单金额">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.order_amount}}</div>
                </template>
            </el-table-column>
            <el-table-column label="交易款项-放款">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.payment_for_transactions_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="退款金额">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.refund_amount_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="退款比例" >
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.refund_amount_aum_propertion}}</div>
                </template>
            </el-table-column>
            <el-table-column label="释放暂扣货款">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.withheld_transactions_released_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="其他款项" >
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.other_payments_sum}}</div>
                </template>
            </el-table-column>
            <!--<el-table-column label="扣除退款" prop="refund_deduction_sum"></el-table-column>-->
            <el-table-column label="其他费用">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.fees_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="罚款或暂扣贷款金额"  width="130">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.fines_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="现金返还" >
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.wish_express_cash_back_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="转账金额" >
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.gross_amount_sum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="转账比例">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.gross_amount_sum_propertion}}</div>
                </template>
            </el-table-column>
            <el-table-column label="扣除数额">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.amount_withheld_sum}}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="table.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
        </el-pagination>
    </div>
</template>

<style scoped>

</style>

<script>
    export default {
        computed:{
            emptyText() {
                return this.firstTime?'等待查询数据中...':'暂无数据'
            },
        },
        methods: {
            can_checkbox(row, index){
                return row.hasDate;
            },
            selectionChange(val) {
                this.$emit('select-change',val)
            },
            select_all(val){
                this.$emit('select-all',val)
            },
            handleSizeChange(val){
                this.$emit('sizeChange',val)
            },
            handleCurrentChange(val){
                this.$emit('pageChange',val)
            }
        },
        props:{
            table:{},
            loading:{},
            firstTime:{}
        }
    }
</script>

