<template>
    <div class="p-picking-sku">
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
        <el-row>
            <label-item label="请选择仓库：" class="mb-mini">
                <el-select v-model="searchData.warehouse_id"
                           class="width-sm inline">
                    <el-option v-for="warehouse in warehouseList"
                                :key="warehouse.value"
                                :label="warehouse.label"
                                :value="warehouse.value">

                    </el-option>
                </el-select>
            </label-item>
            <!--处理状态-->
                <label-buttons label="异常类型："
                               :buttons="statusList"
                               class="inline ml-sm mb-mini"
                               @select="select_status"></label-buttons>
                <label-buttons label='审批状态：'
                               class="inline ml-mini  mb-mini"
                               :buttons="auditStatus"
                               @select="select_audit">
                </label-buttons>
            </el-row>
            <!--采购员 处理人 审批人-->
                <el-select class="inline s-width-default"
                           v-model="searchData.person_type">
                    <el-option v-for="item in personTypeList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            <!--全部 采购A 采购B 采购C-->
                <scroll-select v-model="staffs" style="width:158px" class="inline"
                               textAlign="left"
                               ref="creater"
                               remote="get|user"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            <!--采购，运单号-->
                <el-select class="inline ml-sm s-width-default"
                           v-model="searchData.bill_type">
                    <el-option v-for="item in typeList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="searchData.bill_number"
                             class="inline width-super"
                             v-sf.s_bill_number
                             @keydown="search"></order-input>
                <!--时间搜索-->
                <el-select class="inline ml-sm s-width-default"
                           v-model="searchData.time_type">
                    <el-option v-for="item in timeTypeList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
                <el-date-picker v-model="searchData.date_b"
                                type="date"
                                placeholder="开始时间"
                                v-sf.date_b
                                :picker-options="pickerStart"
                                class="inline date"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="searchData.date_e"
                                type="date"
                                placeholder="结束时间"
                                v-sf.date_e
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </search-card>
    </div>
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
    export default {
        name: "search-module",
        data(){
            return{
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() < this.searchData.date_e.getTime()
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime()
                        } else {
                            return false
                        }
                    }
                },
                typeList: [
                    {
                        label: '采购单号',
                        value: 1,
                    },
                    {
                        label: '运单号',
                        value: 0,
                    },
                ],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '退回供应商', value: 0},
                    {label: '包裹转移仓库', value: 1},
                ],
                personTypeList: [
                    {label: '采购员', value: 0},
                    {label: '处理人', value: 1},
                    {label: '审批人', value: 2},
                ],
                timeTypeList: [
                    // {label: '流程发起时间', value: 0},
                    {label: '创建时间', value: 1},
                    {label: '提交时间', value: 2},
                    // {label: '跟进时间', value: 3},
                ],
                auditStatus:[
                    {label:'全部',value:''},
                    {label:'采购待确认',value:0},
                    {label:'采购已确认',value:1},
                    {label:'仓库待确认',value:2},
                    {label:'仓库已确认',value:3},
                    {label:'待上传凭证',value:4},
                    {label:'已上传凭证',value:5},
                ]
            }
        },
        methods:{
            select_status(index, data) {
                this.searchData.processing_status = data.value;
                this.search();
            },
            select_audit(index,data){
                this.searchData.processing_person = data.value;
                this.search();
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },//账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            search() {
                this.$emit('search');
            }
        },
        computed: {
            staffs: {
                get() {
                    return {
                        value: this.searchData.person_id,
                        label: this.searchData.person_name,
                    };
                },
                set(val) {
                    this.searchData.person_id = val.value;
                    this.searchData.person_name = val.label;
                }
            },
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clears:{
                type:Object,
                required:true
            },
            warehouseList:{
                type:Array,
                required:true
            }
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            labelItem:require('@/components/label-item.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            orderInput: require('@/components/order-input.vue').default,
        }
    }
</script>
