<template>
    <div>
        <el-table class="scroll-bar"
                  :data="table.list"
                  v-loading="loading"
                  v-resize="{height:41}"
                  element-loading-text="玩命加载中..."
                  @selection-change="selectionChange"
                  highlight-current-row >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="日期范围" width="160" >
                <template slot-scope="scope">
                    <template v-if="scope.row.hasDate">
                        <span class="operate" @click="detail(scope.row)">
                        {{scope.row.settlement_start_time}}--{{scope.row.settlement_end_time}}</span>
                    </template>
                    <template v-else>
                       <span class="bold-font">汇 总</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="账号简称" prop="account_name"></el-table-column>
            <el-table-column label="站点" prop="site" width="70"></el-table-column>
            <el-table-column label="销售员" prop="seller_name" width="80"> </el-table-column>
            <el-table-column label="订单金额" >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.payment_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="亚马逊所收税费"width="140">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.fee_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="促销返点总计">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.promotion_return_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>


            <el-table-column label="退款合计" prop="refund_amount" >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.refund_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="退款比例CNY" width="90">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.refund_rate}}</div>
                </template>
            </el-table-column>



            <el-table-column label="其他服务费用总计" prop="other_fee_amount" width="120">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.other_fee_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="首期预留金额" prop="previous_reserve_amount" >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.previous_reserve_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="末期预留金额" prop="current_reserve_amount" >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.current_reserve_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="预留金额结算" prop="reserve_amount" >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.reserve_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>

            <el-table-column label="转账金额B"  >
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.total_amount"
                         :key="index" :class="scope.row.hasDate?'':'bold-font'">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column label="转账比例CNY" width="90">
                <template slot-scope="scope">
                    <div :class="scope.row.hasDate?'':'bold-font'">{{scope.row.total_amount_rate}}</div>
                </template>
            </el-table-column>


        </el-table>
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
        filters:{
            // fdatetime(val) {
            //     return datef("YYYY-MM-dd ", val)
            // }
        },
        methods: {
            selectionChange(val) {
                this.$emit('selection-change',val)
            },
            detail(val){
                this.$emit('detail',val)
            }
        },
        props:{
            loading:{},
            firstTime:{},
            table:{}
        }
    }
</script>

