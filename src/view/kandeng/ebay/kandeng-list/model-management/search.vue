<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
                <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline mb-mini s-width-small">
                    <el-option v-for="item in goods"
                               :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="searchData.snText" placeholder="模糊搜索..."
                          @keyup.enter.native="search"
                          v-if="searchData.searchChooese==='title'"
                          class="inline width-super mb-mini mr-sm"></el-input>
                <order-input v-model="searchData.snText"
                             @keydown="search"
                             class="inline width-super mb-mini mr-sm"
                             v-else v-sf.snText
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label-item label="账号简称：">
                    <el-select v-model="searchData.searchType"
                               @change="change_type"
                               class="inline s-width-mini mb-mini" v-sf.searchType
                               default-first-option filterable clearable>
                        <el-option
                            v-for="res in typeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <param-account v-if="searchData.searchType==='select'"
                                   v-sf.account_id  v-model="searchData.account_id"
                                   url="get|Publish/Ebay/getAccounts"
                                   class="inline mb-mini mr-sm" type="ebay"></param-account>
                    <order-input v-model="searchData.account_code" v-sf.account_code
                                 v-else @keydown="search"
                                 class="inline s-width-large mr-sm" placeholder="可批量搜索，Shift+回车换行..."></order-input>
                </label-item>
                <label-item label="站点：">
                    <el-select v-sf.site v-model="searchData.site" class="inline mb-mini mr-sm s-width-default">
                        <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </label-item>
                <label-item label="出售方式：">
                    <el-select v-sf.listing_type v-model="searchData.listing_type" class="inline mb-mini mr-sm s-width-small">
                        <el-option v-for="item in saleWay"
                                   :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="刊登分类：">
                    <el-input placeholder="请输入搜索内容..." v-sf.category v-model="searchData.category_id"
                              :disabled="disabled" class="inline mb-mini mr-mini width-lg"></el-input>
                    <a class="inline mb-mini mr-sm blue-color" @click="choose_product">(选择产品分类)</a>
                </label-item>
            <!--</el-row>-->
                <el-select v-sf.pub_time v-model="searchData.pub_time" class="inline s-width-small">
                    <el-option v-for="item in choosesTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-date-picker class="inline date" v-sf.pub_start v-model="searchData.pub_start" type="date"
                                :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
                --
                <el-date-picker class="inline date mr-sm" v-sf.pub_end v-model="searchData.pub_end" type="date"
                                :picker-options="pickerend" placeholder="结束时间"></el-date-picker>

            <label-item label="SKU属性：">
                <el-select v-sf.model_cate v-model="searchData.variation"
                           filterable clearable class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in propertyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="刊登工具：">
                <el-select v-sf.application v-model="searchData.application" placeholder="全部" clearable class="inline mr-sm s-width-middle">
                    <el-option
                        v-for="item in appliList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="上架时间：">
                <el-select v-sf.listing_duration v-model="searchData.listing_duration"
                           :disabled="noSaleWay" placeholder="全部" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in addTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>

            <label-item label="定时规则：">
                <el-select v-sf.rule_id v-model="searchData.rule_id" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in ruleList" :key="item.id" :label="item.timing_rule_name" :value="item.id"></el-option>
                </el-select>
            </label-item>

            <label-item label="创建人：">
                <el-input placeholder="请输入搜索内容..." v-sf.realname v-model="searchData.realname" class="inline mb-mini mr-sm width-default"></el-input>
            </label-item>
            <label-item label="商品所在地：">
                <el-input placeholder="请输入..." v-sf.location v-model="searchData.location" class="inline mb-mini mr-sm"></el-input>
            </label-item>
            <label-item label="刊登状态：" class="">
                <el-select v-model="searchData.listing_status" multiple clearable
                           size="mini"
                           placeholder="请选择"
                           class="multiple_width mb-mini" >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
        <category-dialog v-model="categoryDialog" :site="searchData.site" @submit="submit"></category-dialog>
    </div>
</template>
<style lang="stylus" scoped>

    .p-search{
        .multiple_width{
            width 1034px;
        }
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {
        api_get_timing_rule_list,
    	api_get_account,
        api_get_ebay_site,
        api_listing_management,
        api_common_modeList,
        api_get_draft_list,
        api_get_cateList
    } from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.pub_end){
                            return  time.getTime() > this.searchData.pub_end;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.pub_start){
                            return  time.getTime() < this.searchData.pub_start;
                        }else {
                            return false;
                        }
                    }
                },
                ruleList:[],
                appliList:[
                    {label:"全部",value:""},
                    {label:"erp刊登",value:1},
                    {label:"非erp刊登",value:0},
                ],
                options:[{
                    value: 0,
                    label: '未刊登'
                },{
                    value: 1,
                    label: '刊登队列中'
                },{
                    value: 2,
                    label: '刊登中'
                },{
                    value: 3,
                    label: '刊登成功'
                },{
                    value: 4,
                    label: '刊登失败'
                },{
                    value: 5,
                    label: '更新队列中'
                },{
                    value: 6,
                    label: '更新中'
                },{
                    value: 7,
                    label: '更新失败'
                },{
                    value: 8,
                    label: '下架队列中'
                },{
                    value: 9,
                    label: '下架中'
                },{
                    value: 10,
                    label: '下架失败'
                },{
                    value: 11,
                    label: '已下架/已结束'
                },],
                choosesTime: [
                    {label: "站点时间", value: "site"},
                    {label: "本地时间", value: "local"},
                    {label: "创建时间", value: "create"},
                    {label: "更新时间", value: "update"},
                ],
                goods: [
                    {
                        value: 'ids',
                        label: '范本ID'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
                    },
                    {
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'title',
                        label: '刊登标题'
                    },
                    {
                        value: 'draft_name',
                        label: '范本名称'
                    },
                ],
                noChoiceSite:true,
                categoryDialog:false,
                typeList:[
                    {label:'选择',value:'select'},
                    {label:'文本',value:'text'},
                ],
                saleWay: [
                    {label:"全部",value:""},
                    {label: "一口价", value: "1"},
                    {label: "拍卖", value: "2"}
                ], //销售方式
                addTimes: [], //上架时间
                pickerStart:{},
                pickerEnd:{},
                promotionList:[],
                choiceList:[],
                cateList:[],
                shareList:[
                    {label:'全部',value:''},
                    {label:'未共享',value:1},
                    {label:'已共享',value:2},
                    {label:'他人共享',value:4},
                ],
                propertyList:[
                    {label:'全部',value:''},
                    {label:'单属性',value:0},
                    {label:'多属性',value:1},
                ],
                publishList:[
                    {label:'全部',value:''},
                    {label:'已刊登',value:0},
                    {label:'未刊登',value:1},
                ],
                noSaleWay:true,
                ruleTime:"",
                ruleTimes:[],
                disabled:true,
            }
        },
        created(){
            this.init();
            this.get_model()
        },
        mounted(){
        	this.getCate()
        },
        methods:{
            get_model(){
                this.$http(api_get_timing_rule_list,{data:{}}).then(res=>{
                    this.ruleList = res.data.rows;
                    this.ruleList.unshift({timing_rule_name:"全部",id:""});
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            change_type(){
                this.searchData.account_id = '';
                this.searchData.account_code = '';
            },
            init(){
                this.loading = true;
                this.get_listing_management();
                this.init_all_select()
            },
            get_listing_management(){
                this.$http(api_listing_management).then(res => {
                    this.loading = false;
                    this.listings = res.data;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                })
            },
            getCate(){
                let data={
                    ebay_account:"",
                    model_name:"",
                    site:"",
                    type:2,
                    status:"",
//                    page:this.page,
//                    size:this.pageSize
                };
                this.$http(api_get_cateList,data).then(res=>{
                    this.cateList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            choose_product(){
                if(this.searchData.site||this.searchData.site===0){
                    this.categoryDialog = true;
                }else {
                    this.$message({
                        type:"warning",
                        message: "请先选择站点"
                    });
                }
            },
            init_all_select(){
                let data = ["promotion","choice"];
                data.forEach((row)=>{
                    let cur= [];
                    this.$http(api_common_modeList,{model_type:row}).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'promotion':
                                this.promotionList = cur;
                                break;
                            case 'choice':
                                this.choiceList = cur;
                                break;
                        }
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message: code.message || code
                        });
                    });
                })
            },
            search(){
                this.$emit("search",this.searchData);
            },
            submit(val){
            	if(val instanceof Array){
                    val.forEach(row =>{
                        this.searchData.category_id = row.category_id;
                    });
                }else{
            		let index = val.indexOf("-");
                    this.searchData.category_id = val.slice(0,index);
                }
                this.categoryDialog = false;
            },
        },
        computed:{
        },
        watch:{
            'searchData.listing_type'(val){
                this.searchData.listing_duration="";
                if(!val){
                    this.noSaleWay = true;
                    return
                }
                this.noSaleWay = false;
                if(val===2){
                    this.addTimes=[
                        {label:"全部",value:""},
                        {label:"GTC",value:1},
                        {label:"3天",value:3},
                        {label:"5天",value:4},
                        {label:"7天",value:5},
                        {label:"10天",value:6},
                        {label:"30天",value:7},

                    ]
                }else{
                    this.addTimes=[
                        {label:"全部",value:""},
                        {label:"1天",value:2},
                        {label:"3天",value:3},
                        {label:"5天",value:4},
                        {label:"7天",value:5},
                        {label:"10天",value:6},
                    ]
                }
            },
            'searchData.site'(val) {
                if(!val&&val!==0){
                    this.noChoiceSite = true;
                    return
                }
                this.noChoiceSite = false;
            },
        },
        props:{
            searchData: {
                required:true,
                type:Object,
            },
            siteList:{
                required:true,
                type:Array,
            },
            clears:{
                required:true,
                type:Object,
            }
        },
        components:{
            labelItem:require("../../../../../components/label-item.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            paramAccount:require("../../../../../api-components/param-account.vue").default,
            categoryDialog:require("../../category-dialog.vue").default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            orderInput:require("../../../../../components/order-input.vue").default,
        }
    }
</script>
