<template>
    <div class="c-card-search">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData" :clears="clears" @search="init" style="overflow: initial;">
            <label-item label="平台：">
                <el-select v-model="searchData.channel_id"
                           class="inline width-sm"
                           v-sf.channel_id
                           filterable clearable>
                    <el-option
                            v-for="res in channelList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="站点：" class="ml-sm">
                <el-select v-model="searchData.site_code"
                           class="width-lg"
                           v-sf.site_code
                           :placeholder="comHolderSite"
                           :disabled="siteList.length<=1"
                           filterable clearable>
                    <el-option
                            v-for="res in siteList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select v-model="searchData.channel_account_id"
                           class="width-sm"
                           v-sf.channel_account_id
                           :disabled="accountList.length<=1"
                           :placeholder="comHolderAccount"
                           filterable clearable>
                    <el-option
                            v-for="res in accountList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.snType"
                           class="width-xs"
                           v-sf.snType>
                    <el-option
                            v-for="res in snTypeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="">
                <order-input class="width-super mr-sm"
                             v-model="searchData.snText"
                             placeholder="可批量搜索，Shift+回车换行..."
                             @keydown="key_down"
                             v-sf.snText></order-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search {
        .first-line {
            margin-left: 24px;
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list} from '../../../api/common.js';
    import {entrepot_picking} from '../../../api/package-not-collection'

    export default {
        page() {

        },
        data() {
            return {
                warehouses: [],
                warehouse_id: 2,
                searchData: {
                    channel_id: '',
                    site_code: '',
                    channel_account_id: '',
                    snType: 'number',
                    snText: '',
                    module: 1,
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    snType: 'number',
                    module: 1,
                    page: 1,
                    pageSize: 20
                },
                channelList: [],
                accountList: [],
                siteList: [],
//                搜索类型（order_number -订单号，tracking -物流跟踪号，number-包裹号，process_code - 处理号）
                snTypeList: [
                    {label: "订单号", value: "order_number"},
                    {label: "物流跟踪号", value: "tracking"},
                    {label: "包裹号", value: "number"},
                    {label: "处理号", value: "process_code"},
                    {label: "SKU", value: "sku"}
                ],
            }
        },
        created() {
            this.get_channel();
            this.init_warehouse();
            this.init();
        },
        methods: {
            key_down() {
                this.init();
            },
            init() {
                let searchData = window.clone(this.searchData);
                if (this.searchData.snText) {
                    let list = this.searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                    searchData.snText = list.length <= 1 ? this.searchData.snText.trim() : list;
                }
                Object.assign(searchData,{warehouse_id: this.warehouse_id});
                this.$emit("init", searchData);
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_channel() {
                this.$http(api_get_channel).then(res => {
                    this.channelList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_site(val) {
                if (!val) return this.siteList = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: val}).then(res => {
                    let site = res.site;
                    if (site.length <= 0) {
                        let account = res.account;
                        this.siteList = [{label: "", value: ""}];
                        if (account) {
                            this.accountList = [{label: "全部", value: ""}, ...account];
                        } else {
                            this.accountList = [{label: "", value: ""}];
                        }
                    } else {
                        this.siteList = [{label: "全部", value: ""}, ...site];
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_account(channel_id, site_code) {
                if (!channel_id || !site_code) return this.accountList = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: channel_id, site_code: site_code}).then(res => {
                    let account = res.account;
                    if (account.length > 0) return this.accountList = [{label: "全部", value: ""}, ...account];
                    this.accountList = [{label: "", value: ""}];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_depot() {
                this.init();
            },
        },
        watch: {
            'searchData.channel_id'(val) {
                this.searchData.site_code = "";
                this.searchData.channel_account_id = "";
                this.accountList = [{label: "", value: ""}];
                this.get_site(val);
            },
            'searchData.site_code'(val) {
                this.searchData.channel_account_id = "";
                this.get_account(this.searchData.channel_id, val);
            },
        },
        computed: {
            comHolderSite() {
                if (!this.searchData.channel_id) {
                    return "请先选择平台";
                } else if (!!this.searchData.channel_id && this.siteList.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点";
                }
            },
            comHolderAccount() {
                if (!this.searchData.site_code) {
                    return "请先选择站点";
                } else if (!!this.searchData.site_code && this.accountList.length <= 1) {
                    return "该站点下暂无账号";
                } else {
                    return "请选择账号";
                }
            },
            changeLabel() {
                let find = this.snTypeList.find(res => {
                    return res.value === this.searchData.snType;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        props: {},
        components: {
            searchCard: require('../../../components/search-card.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            orderInput: require("../../../components/order-input.vue").default,
        }
    }
</script>
