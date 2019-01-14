<template>
    <page class="p-assert-sup">
        <!--<el-row>-->
        <search-card @search="search"  :params="searchData" :clears="clears" @init-params="clearsData">
            <div>
                <label-buttons label="状态：" title="请选择状态" :buttons="statusList" @select="select_status"></label-buttons>
            </div>
            <div class="mb-mini">
                <label class="inline" title="请选择等级">等级：</label>
                <el-select class="inline s-width-default" v-sf.level v-model="searchData.level">
                    <el-option
                        v-for="item in levelList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择分类">分类：</label>
                <el-cascader
                    filterable
                    clearable
                    placeholder="请选择分类..."
                    class="inline s-width-large"
                    change-on-select
                    @change="categorys_change"
                    expand-trigger="hover"
                    v-model="category"
                    :options="categorysList"
                ></el-cascader>
                <label class="inline ml-sm" title="请选择所在地">所在区/省/市：</label>
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    placeholder="请选择城市..."
                    class="inline s-width-large"
                    expand-trigger="hover"
                    v-model="place_type"
                    :options="areaList"
                ></el-cascader>
                <label class="inline ml-sm" title="请选择合作次数">合作次数：</label>
                <ui-limit-number
                    v-sf.count_trade_times
                    v-model="searchData.num_cooperation_b"
                    @keyup.enter.native="search"
                    :limit="0"
                    class="inline enter-result s-width-mini"></ui-limit-number>&nbsp;--
                <ui-limit-number
                    v-sf.count_trade_times
                    v-model="searchData.num_cooperation_e"
                    @keyup.enter.native="search"
                    :limit="0"
                    class="inline enter-result s-width-mini"></ui-limit-number>
            </div>
            <label class="inline" title="请选择交易方式">交易类型：</label>
            <el-select class="inline s-width-default" v-sf.transaction_type v-model="searchData.transaction_type">
                <el-option
                    v-for="item in transactionList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <label class="inline ml-sm" title="请选择支付方式">支付方式：</label>
            <el-select class="inline s-width-default" v-sf.pay_type v-model="searchData.pay_type">
                <el-option
                    v-for="item in paymentList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
            <el-select class="inline s-width-default" v-sf.balance_type v-model="searchData.balance_type">
                <el-option
                    v-for="item in balanceList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <el-select v-sf.staff_type v-model="searchData.staff_type" class="ml-sm s-width-small inline" @change="change_buyer_brand(1)">
                <el-option v-for="item in buyerBrand" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <purchaser v-show="searchData.staff_type==='purchaser'" class="inline s-width-default" v-sf.staff v-model="searchData.staff"></purchaser>
            <param-account
                class="inline s-width-default"
                v-show="searchData.staff_type==='developer'"
                v-model="searchData.developer_id"
                v-sf.developer_id
                :fixResult="development_fix_result"
                type="memberShipSales"
                placeholder="请选择/输入..."
                url="get|user/development/staffs">
            </param-account>
            <el-select v-sf.snType v-model="searchData.snType" class="ml-sm s-width-small inline s-width-snType" @change="change_buyer_brand(2)">
                <el-option v-for="item in snType" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <order-input class="inline width-super" @keydown='key_down'  v-sf.snText
                        placeholder="可批量搜索，Shift+回车换行..."
                        v-model="snText"></order-input>
            <el-select v-sf.search_time_type v-model="searchData.search_time_type" class="ml-sm s-width-small inline s-width-snType"  @change="change_buyer_brand(3)" >
                <el-option v-for="item in searchTimeType" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
                <el-date-picker
                    class="inline date mr-sm"
                    :picker-options="pickerStart"
                    type="date"
                    v-sf.date_b
                    v-model="date_b"
                    placeholder="年/月/日"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>&nbsp;--&nbsp;
                <el-date-picker
                    class="inline date mr-sm"
                    v-sf.date_e
                    :picker-options="pickerEnd"
                    type="date"
                    v-model="date_e"
                    placeholder="年/月/日"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
        </search-card>
        <permission tag="ElButton"
                    :route="apis.url_add_supplier"
                    class="inline mt-sm ml-sm mb-sm"
                    type="primary" size="mini"
                    @click.native="add" title="新增供应商">添加</permission>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-mini"
                    type="primary"
                    :route="apis.url_export_supplier"
                    :selects="partAllOptions"
                    @trigger="export_sku"></permission>
        <trends-select class="inline ml-sm mr-sm btn-margin-top"
                       v-if="curStatus===0"
                       :selects="handleList"
                       type="primary"
                       @trigger="select_handle"></trends-select>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-xs"
                    type="primary"
                    v-if="curStatus===-1||curStatus===1"
                    :route="apis.url_supplier_export_fuiou"
                    :selects="exportFuiou"
                    @trigger="export_handle"></permission>
        <permission tag="ElButton"
                    :route="apis.url_supplier_change_purchaser"
                    class="inline mt-sm ml-mini mb-sm"
                    type="primary" size="mini"
                    v-if="curStatus===-1||curStatus===1"
                    @click.native="modify_purchaser">修改采购员</permission>
        <el-table
            class="scroll-bar"
            :data="table.dataList"
            border
            :highlight-current-row="true"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            style="width: 100%"
            v-resize="{height:41}"
            @selection-change="selection_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="供应商名称" inline-template row-key="company_name" min-width="50">
                <div>
                    <ui-tip :content="row.company_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="SPU数量" inline-template min-width="50">
                <div>
                    <ui-tip :content="row.spu_num|emptyByDefault" :width="78"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="供应商等级" inline-template min-width="50">
                <div>
                    <ui-tip :content="row.level_text|emptyByDefault" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="采购总金额" inline-template min-width="50">
                <div>
                    <ui-tip :content="'CNY '+row.sum_amount|emptyByDefault" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="交易类型" inline-template min-width="50">
                <div>
                    <ui-tip :content="row.transaction_type_text|emptyByDefault" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="支付方式" inline-template min-width="50">
                <div>
                    <ui-tip :content="row.pay_type_text|emptyByDefault" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" inline-template   width="125">
                <div>
                    <ui-tip :content="row.balance_type_text|emptyByDefault" :width="120"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="省/市/区" inline-template align="center"  width="125">
                <div>
                    <ui-tip :content="filterCity(row)" :width="120"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="联系人" inline-template align="center" min-width="50">
                <div>
                    <ui-tip :content="row.contacts|emptyByDefault" :width="80"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="采购员" inline-template align="center" min-width="50">
                <div>
                    <ui-tip :content="row.purchaser_name|emptyByDefault" :width="80"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="开发员" inline-template align="center" min-width="50">
                <div>
                    <ui-tip :content="row.developer_name|emptyByDefault" :width="80"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分类" inline-template align="center" min-width="80">
                <div>
                    <ui-tip :content="row.categorys_text|emptyByDefault" :width="130"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="审核状态" inline-template align="center" min-width="50">
                <div>
                    <ui-tip :content="row.status|filterStatus" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="合作次数最后合作时间" inline-template align="center" min-width="50">
                <div>
                    <ui-tip :content="row.count_trade_times|emptyByDefault" :width="58"></ui-tip>次
                    <times :time="row.update_time|emptyByDefault"></times>
                </div>
            </el-table-column>
            <el-table-column label="创建时间修改时间" inline-template align="center" min-width="50">
                <div>
                    <times :time="row.create_time|emptyByDefault"></times>
                    <times :time="row.update_time|emptyByDefault"></times>
                </div>
            </el-table-column>
            <el-table-column label="操作" min-width="50" inline-template>
                <div>
                    <trends-select
                        class="inline ml-sm btn-trends-select-relative"
                        :selects="filterOptions(row.status)"
                        type="primary"
                        @trigger="handles(row,$event)"></trends-select>
                </div>
            </el-table-column>
        </el-table>
        <edit-lookover
            v-model="dialog"
            :isLook="isLook"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :remove-business-image="removeBusinessImage"
            :remove-supplier-plan="removeSupplierPlan"
            :look-edit-form="lookEditForm"
            @change-dialog="addDiscussRecordDialog"
            @add-edit="add_edit"
            :title="editLookTitle"
            :status="operationStatus"
            @select-province="select_province_"
            @select-city="select_city_"
            @audit-update="search"
            :list="categorysList"
        ></edit-lookover>
        <cheked-suppliers
            v-model="checkedDialog"
            :isLook="isLook"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :look-edit-form="lookEditForm"
            @change-dialog="addDiscussRecordDialog"
            @add-edit="add_edit"
            :title="editLookTitle"
            :status="operationStatus"
            @select-province="select_province_"
            @select-city="select_city_"
        >
        </cheked-suppliers>
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field  v-model="exportVisible"
           :creat-excel="creat_excel"
           :fields="fields"
           title="请选择自定义导出字段"
           :fixparam="fixparam"
           :templates="templates"
           @getTemplate="get_templates"
           :param="export_model_type"
        ></export-field>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="table.page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalSize">
        </el-pagination>
        <modify-dialog v-model="modifyDialog" :form="modifyForm" @submit="modify_submit"></modify-dialog>
        <purchase-record v-model="showRecord" :recordData="recordData"></purchase-record>
        <operation-log v-model="logDialog"  :operation-log="operation_log_data" :title="logDialogTitle"></operation-log>
        <discuss-record v-model="discussRecordDialog"  :record-data="discuss_record" :update-data="updateData" @change-dialog="addDiscussRecordDialog"></discuss-record>
        <add-discuss-record v-model="isShowDialog" @updata-search="updataSearch" :title="dailogTitle" :playcehoder="placeHolder" :execute="execute" @update-change="update_discuss" :add-id="addDiscuss"></add-discuss-record>
    </page>
</template>
<style lang="stylus">
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
    .el-card {
        overflow: visible;
    }

    .btn-margin-top {
        margin-top: 1px;
        margin-left: 5px;
        margin-right: 6px;
    }
    .s-width-snType{
        width :120px
    }
</style>
<script>
    import {downloadFile} from '@/lib/http';
    import {
        api_supplier,
        api_supplier_fields,
        api_supplier_export_fuiou,
        api_add_supplier,
        api_delete_supplier,
        api_look_supplier,
        api_get_balance,
        api_supplier_Level,
        api_supplier_transaction,
        api_edit_supplier,
        api_supplier_payment,
        api_update_supplier,
        api_supplier_area,
        api_supplier_change_purchaser,
        api_get_buyer,
        api_development,
        api_change_states,
        api_get_supplier_id_log,
        api_get_categories,
        api_goods_export_template,
        api_get_supplier_get_supplier_purchase,
        api_export_supplier,
        url_supplier_discuss_record,
        url_get_supplier_id_log,
        url_get_supplier_get_supplier_purchase,
        url_supplier_change_purchaser,
        url_add_supplier,
        url_look_supplier,
        url_edit_supplier,
        url_delete_supplier,
        url_export_supplier,
        url_supplier_export_fuiou
    } from '../../../../api/assert-sup';
    // handleOptions
    const handleOptions = [  //全部
        {label:'查看',value:0,api:url_look_supplier},
        {label:'编辑',value:1,api:url_edit_supplier},
        {label:'删除',value:2,api:url_delete_supplier},
        {label:'采购记录',value:3,api:url_get_supplier_get_supplier_purchase},
        {label:'重新启用',value:4,api:url_edit_supplier},
        {label:'洽谈记录',value:5,api:url_supplier_discuss_record},
        {label:'审核',value:7,api:url_edit_supplier},
        // {label:'申请变更',value:8,api:url_edit_supplier},
        {label:'重新提交',value:9,api:url_edit_supplier},
        {label:'操作日志',value:6,api:url_get_supplier_id_log},
    ];
    export default {
        permission: {
            url_supplier_discuss_record,
            url_add_supplier,
            url_look_supplier,
            url_edit_supplier,
            url_delete_supplier,
            url_export_supplier,
            url_supplier_export_fuiou,
            url_supplier_change_purchaser,
            url_get_supplier_get_supplier_purchase,
            url_get_supplier_id_log
        },
        page: {
            devinfo: {
                frontEnd: '王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-9',
                updateTime: '2017-9-26'
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                visible:false,
                firstLoading: true,
                supplier_id: "",
                url_supplier: config.apiHost + 'supplier-offer/supplier',
                isLoading: true,
                dialog: false,
                curStatus: -1,
                selectId: [],
                selectList:[],
                title: "",
                execute:'',
                placeHolder:'',
                export_type:'',
                statusList: [
                    {name: "全部", status: -1},
                    {name: "待审核", status: 0},
                    {name: "已审核", status: 1},
                    {name: "审核未通过", status: 3},
                    {name: "停用", status: 2}
                ],
                buyerBrand: [
                    {label: "采购员", value: "purchaser"},
                    {label: "开发员", value: "developer"}
                ],
                searchTimeType: [
                    {label: "创建时间", value: "create_time"},
                    {label: "更新时间", value: "update_time"},
                    {label: "最后交易时间", value:"last_trading_time"}
                ],
                snType: [
                    {label: "供应商名称", value: "company_name"},
                    {label: "联系人", value: "contacts"},
                    {label: "联系电话", value: "tel"},
                    {label: "联系地址", value: "address"}
                ],
                templates:[],
                fields:[],
                dailogTitle:'',
                operationStatus:'',
                // 结算列表
                balanceList: [],
                // 等级列表
                levelList:[],
                // 交易列表
                transactionList:[],
                // 支付列表
                paymentList:[],
                // 城市列表
                areaRes:{},
                areaList:[],
                provinceList:[],
                cityList: [],
                area:[],
                // 采购员
                buyerList:[],
                //开发员
                developer:[],
                // 分类列表
                categorysRes:{},
                categorysList:[],
                // 操作日志
                operation_log_data:[],
                // 洽谈列表
                discuss_record:{},
                // 搜索参数
                searchData:{
                    page:0,//页数
                    pageSize:50,//页数大小
                    status:'',//状态
                    balance_type:'',//结算方式
                    snType:'company_name',//供应商名称
                    snText:'',//供应商名称对应文本
                    level:'',//等级
                    categorys:'',//分类
                    place_type:'',//所在省province/市city/区area
                    place_id:'',//所在省/市/区的ID
                    transaction_type:'', //交易类型
                    num_cooperation_b:'',//最小合作次数
                    num_cooperation_e:'',//最大合作次数
                    max_trade_time:'',//最后合作时间
                    pay_type:'',//支付方式
                    staff_type:'purchaser',//采购员purchaser、开发员developer
                    staff:'',//采购员、开发员的ID
                    search_time_type:'create_time',//时间刷选：创建时间create_time，更新时间update_time，最后交易时间last_trading_time
                    date_b:'',//开始时间例：2018-12-22
                    date_e:''//结束时间例：2018-12-22'
                },
                date_b:'',
                date_e:'',
                snText:"",
                clears: {
                    balance_type:'',//结算方式
                    snType:'company_name',//供应商名称
                    snText:'',//供应商名称对应文本
                    level:'',//等级
                    categorys:'',//分类
                    place_type:'',//所在省province/市city/区area
                    place_id:'',//所在省/市/区的ID
                    transaction_type:'', //交易类型
                    num_cooperation_b:'',//最小合作次数
                    num_cooperation_e:'',//最大合作次数
                    max_trade_time:'',//最后合作时间
                    pay_type:'',//支付方式
                    staff_type:'purchaser',//采购员purchaser、开发员developer
                    staff:'',//采购员、开发员的ID
                    search_time_type:'create_time',//时间刷选：创建时间create_time，更新时间update_time，最后交易时间last_trading_time
                    date_b:'',//开始时间例：2018-12-22
                    date_e:'',//结束时间例：2018-12-22'
                },
                table: {
                    page: 0,
                    pageSize: 50,
                    totalSize: 0,
                    dataList: []
                },
                lookEditForm: {},
                isLook: true,
                isShowDialog:false,
                logDialog:false,
                checkedDialog:false,
                statesData:{},
                addDiscuss:'',
                category:[],
                place_type:[],
                discussRecordDialog:false,
                editLookTitle: "",
                logDialogTitle:"",
                fileCode: "",
                export_model_type:{
                    type:12
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.date_e) {
                            return time.getTime() > this.date_e;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.date_b) {
                            // console.log(time.getTime(this.searchData.date_b));
                            return time.getTime() < this.date_b ||time.getTime()>Date.now();
                        }
                    }
                },
                partAllOptions: [
                    {
                        name: "部分导出", value: 2
                    },
                    {
                        name: "全部导出", value: 1
                    }
                ],
                exportFuiou:[
                    {
                        name: "部分导出至富友",
                        value: 2,
                        action: function () {
                            if (this.selectId.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                supplier_ids: this.selectId,
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params);
                            this.fuiou_export(params);
                        }
                    },
                    {
                        name: "全部导出至富友",
                        value: 1,
                        action: function () {
                            let params = this.init_params();
                            this.fuiou_export(params);
                        }
                    },
                ],
                export_visible: false,
                exportVisible:false,
                removeFile:[],
                removeInformation:[],
                removeSupplierPlan:[],
                removeBusinessImage:[],
                modifyDialog:false,
                modifyForm:{
                    old_purchaser_id:'',
                    purchaser_id:'',
                    is_sync:false,
                    type:0
                },
                recordData:{},
                showRecord:false,
                updateData:null
            }
        },
        mounted(){
            this.get_area();
            this.get_balance();
            this.get_payment();
            this.get_level();
            this.get_transaction();
            this.get_buyer();
            this.get_developer();
            this.get_categorys();
            this.get_fields();
        },
        filters: {
            filterTime(val) {
                if (val) return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "待审核";
                    case 1:
                        return "已审核";
                    case 2:
                        return "停用";
                    case 3:
                        return "审核未通过";
                }
            },
            emptyByDefault(val, def = '--'){
                return val?val:def;
            }
        },
        watch: {
            category(val){
                if (val.length<=0){
                    this.searchData.categorys=''
                }else {
                    this.searchData.categorys=val[val.length-1]
                }
            },
            place_type(val){
                if (val.length<=0){
                    this.searchData.place_id='';
                    this.searchData.place_type=''
                }else {
                    switch (val.length) {
                        case 1:
                            this.searchData.place_type='province';
                            this.searchData.place_id=val[val.length-1];
                            break;
                        case 2:
                            this.searchData.place_type='city';
                            this.searchData.place_id=val[val.length-1];
                            break;
                        case 3:
                            this.searchData.place_type='area';
                            this.searchData.place_id=val[val.length-1];
                            break;
                        default:
                            this.searchData.place_type='';
                            this.searchData.place_id=''
                    }
                }
            },
            curStatus(val) {
                switch (val) {
                    case 0:
                        this.handleList = [
                            {label: "批量审核通过", value: 1},
                            {label: "批量审核不通过", value: 3},
                        ];
                        break;
                    case 1:
                        break;
                    case 2:
                        this.handleList = [
                            {label: "停用", value: 2},
                        ];
                        break;
                }
            },
            date_e(val){
                let data=new Date(val).getTime();
                this.searchData.date_e=this.filterTime(data)
            },
            date_b(val){
                let data=new Date(val).getTime();
                this.searchData.date_b=this.filterTime(data)
            },
            snText(val){
                if (val){
                    let data=val.split("\n");
                    this.searchData.snText=data
                } else{
                    this.searchData.snText=''
                }
            }
        },
        computed: {
            changeLabel() {
                let find = this.snType.find(res => {
                    return res.value === this.searchData.snType;
                });
                if (!!find) {
                    return find.label;
                }
            },
            changeBuyerBrand() {
                let find = this.buyerBrand.find(res => {
                    return res.value === this.searchData.staff_type;
                });
                if (!!find) {
                    return find.label;
                }
            },
            changeSearchTimeType() {
                let find = this.searchTimeType.find(res => {
                    return res.value === this.searchData.search_time_type;
                });
                if (!!find) {
                    return find.label;
                }
            },
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        methods: {
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            updataSearch(val){
                this.dialog=!val;
               this.search()
            },
            update_discuss(data) {
                this.updateData = data;
            },
            filterTime(val){
                if (val){
                    let date =new Date(val);
                    let Y = date.getFullYear() + '-';
                    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    let D = date.getDate() + ' ';
                    return Y+M+D
                } else {
                    return ''
                }

            },
            filterOptions(status) {
                switch (status) {
                    case 0:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 7 || row.value === 6) && this.$hasPermission(row.api));
                    case 1:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 1 || row.value === 3 || row.value === 5 || row.value === 6 || row.value === 8) && this.$hasPermission(row.api));
                    case 2:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 4 || row.value === 2 || row.value === 6) && this.$hasPermission(row.api));
                    case 3:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 9 || row.value === 6) && this.$hasPermission(row.api));
                    default:
                        return handleOptions.filter(row => row.value === 0 && this.$hasPermission(row.api));
                }
            },
            clearsData(){
              this.place_type=[];
              this.category=[];
              this.date_e='';
              this.date_b='';
              this.snText=''
            },
            key_down() {
                this.search()
            },
            // 城市id取城市名
            filterCity(val) {
                let a = "--";
                let b = "--";
                let c = "--";
                if (val.province_id) {
                    this.provinceList.forEach(row => {
                        if (row.value === val.province_id) {
                            a = row.label
                        }
                    });
                }
                if (val.city_id) {
                    this.cityList.forEach(row => {
                        if (row.value === val.city_id) {
                            b = row.label
                        }
                    });
                }

                if (val.area_id) {
                    this.area.forEach(row => {
                        if (row.value === val.city_id) {
                            c = row.label
                        }
                    })
                }
                return a + '/' + b + '/' + c
            },
            handles(row, handle) {
                switch (handle.value) {
                    case 0:
                        this.operationStatus = 0;
                        this.look_over(row);  //查看
                        break;
                    case 1:
                        this.operationStatus = 1;
                        this.edit(row);    //编辑
                        break;
                    case 2:
                        this.operationStatus = 2;
                        this.cur_delete(row);   //删除
                        break;
                    case 3:
                        this.operationStatus = 3;
                        this.show_purchase_record(row, 3); //采购记录
                        break;
                    case 4:
                        this.operationStatus = 4;
                        this.enabled(row);  //重启
                        break;
                    case 5:
                        this.operationStatus = 5;
                        this.show_purchase_record(row, 5); //洽谈记录
                        break;
                    case 6:
                        this.operationStatus = 6;
                        this.log(row);  //操作记录
                        break;
                    case 7:
                        this.operationStatus = 7;
                        this.audit(row);  //审核
                        break;
                    case 8:
                        this.operationStatus = 8;
                        //申请变更
                        break;
                    case 9:
                        this.operationStatus = 9;
                        this.revisitingit(row);  //重新提交
                        break;
                }
            },
            show_purchase_record(row, val) {
                this.$http(api_get_supplier_get_supplier_purchase, {supplier_id: row.id}).then(res => {
                    if (val === 3) {
                        this.recordData = res;
                        this.recordData.supplier_id = row.id;
                        this.showRecord = true;
                    } else {
                        this.discuss_record = res;
                        this.discuss_record.update_data = '';
                        this.discuss_record.supplier_id = row.id;
                        this.discussRecordDialog = true;
                    }

                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            fuiou_export(params) {
                return this.$http(api_supplier_export_fuiou, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                    } else {
                        let params = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code

                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_supplier_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 2}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            supplier_ids: JSON.stringify(this.selectId.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        // Object.assign(data, this.init_params());
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
            order_export(params) {
                return this.$http(api_export_supplier, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let data = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code,
                            supplier_ids:params
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_handle(val) {
                val.action.call(this, val);
            },
            export_sku(val) {
                if (val.value === 2 && this.selectId.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisible = true
            },
            modify_purchaser() {
                this.modifyForm.type = this.selectId.length === 0 ? 2 : 1;
                this.modifyForm.old_purchaser_id = '';
                this.modifyForm.purchaser_id = '';
                this.modifyForm.is_sync = false;
                this.modifyDialog = true;
            },
            modify_submit() {
                let data = window.clone(this.modifyForm);
                if (data.type === 1) {
                    data.supplier_ids = this.selectId;
                    delete data.old_purchaser_id;
                }
                this.$http(api_supplier_change_purchaser, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.modifyDialog = false;
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.modifyDialog = false;
                })
            },
            init_params() {
                let paramsData = {};
                paramsData = {
                    supplier_ids: "",
                    export_type: this.export_type,
                    snType: this.searchData.snType,
                    balance_type: this.searchData.balance_type,
//                    status:this.curStatus,  全部导出的时候不需要这个字段
                    snText: this.searchData.snText
                };
                return paramsData
            },
            init_status_btn() {
                let curBtn = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = curBtn;
                });
            },
            init(data) {
                if (data) {
                    this.isLoading = true;
                    this.curStatus > -1 && (data.status = this.curStatus);
                    this.searchData.snText && (data.snText = this.searchData.snText);
                    this.$http(api_supplier, data).then(res => {
                        this.table.dataList = res.data;
                        this.selectId = [];
                        this.table.totalSize = res.count;
                        setTimeout(() => {
                            this.isLoading = false;
                            this.firstLoading = false
                        }, 1000);
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code})
                    });
                } else {
                    this.isLoading = true;
                    let params = {
                        page: this.table.page,
                        pageSize: this.table.pageSize,
                        snType: this.searchData.snType,
                        balance_type: this.searchData.balance_type
                    };
                    this.curStatus > -1 && (params.status = this.curStatus);
                    this.searchData.snText && (params.snText = this.searchData.snText);
                    this.$http(api_supplier, params).then(res => {
                        this.table.dataList = res.data;
                        this.selectId = [];
                        this.table.totalSize = res.count;
                        setTimeout(() => {
                            this.isLoading = false;
                            this.firstLoading = false
                        }, 1000);
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code})
                    });
                }
            },
//            ---------------------------------   table多选
            selection_change(val) {
                this.selectId = val.map(row => {
                    return row.id;
                });
                this.selectList = val.map(row => {
                    return row.id;
                });
            },
            /*结算方式*/
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*支付方式*/
            get_payment() {
                this.$http(api_supplier_payment).then(res => {
                    this.paymentList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取分类*/
            get_categorys() {
                this.$http(api_get_categories).then(res => {
                    this.categorysRes = res;
                    let list = [];
                    Object.keys(res).forEach(key => {
                        if (res[key] && res[key].child_ids && res[key].child_ids.length > 0) {
                            let children = [];
                            res[key].child_ids.forEach(child_key => {
                                children.push(res[child_key]);
                            });
                            this.$set(res[key], 'children', children);
                            list.push(res[key]);
                        }
                    });
                    this.categorysList = list.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                            disabled: row.children.length === 0,
                            children: row.children.map(child => {
                                return {
                                    label: child.name,
                                    value: child.id,
                                    disabled: false
                                }
                            })
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            categorys_change() {

            },
            /*供应商等级*/
            get_level() {
                this.$http(api_supplier_Level).then(res => {
                    this.levelList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*交易类型*/
            get_transaction() {
                this.$http(api_supplier_transaction).then(res => {
                    this.transactionList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*城市列表*/
            get_area() {
                this.$http(api_supplier_area).then(res => {
                    this.areaRes = res;
                    let list = [];
                    let keyList = [];
                    for (let i in this.areaRes) {
                        let person = this.areaRes[i];
                        if (person.level === 1) {
                            list.push({value: person.id, label: person.name, pid: person.pid, children: []});
                            this.provinceList.push({value: person.id, label: person.name, pid: person.pid});
                        }
                        for (let j in person._child) {
                            let person1 = person._child[j];
                            list[i - 1].children.push({
                                value: person1.id,
                                label: person1.name,
                                pid: person1.pid,
                                children: []
                            });
                            this.cityList.push({value: person1.id, label: person1.name, pid: person1.pid});
                            for (let k in person1._child) {
                                let person2 = person1._child[k];
                                keyList.push(person2)
                            }
                        }
                    }
                    for (let a of list) {
                        let d = a.children;
                        for (let b of d) {
                            keyList.forEach(row => {
                                if (b.value === row.pid) {
                                    b.children.push({value: row.id, label: row.name, pid: row.pid});
                                    this.area.push({value: row.id, label: row.name, pid: row.pid})
                                }
                            })
                        }
                    }
                    this.areaList = list
                }).catch(code => {
                    console.log(code);
                })
            },
            change_cascader(val) {
            },
            /*获取采购员*/
            get_buyer() {
                this.$http(api_get_buyer, {}).then(res => {
                    this.buyerList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                });
            },
            //获取开发人员
            get_developer() {
                this.$http(api_development, {}).then(res => {
                    let data = [...res];
                    let list = [];
                    data.forEach(row => {
                        list.push({name: row.realname, label: row.id})
                    });
                    this.developer = list
                }).catch(code => {
                    console.log(code);
                });
            },
            change_buyer_brand(val) {
                switch (val) {
                    case 1:
                        //切换采购员/开发员
                        this.searchData.staff = "";
                        break;
                    case 2:
                        //供应商名称
                        this.snText = '';
                        break;
                    case 3:
                        //切换创建时间/更新时间/最后时间
                        this.date_b = "";
                        this.date_e = "";
                        break;
                }
            },
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword
                };
            },
            select_handle(val) {
                if (val.value === 1) {
                    if (this.selectId.length === 0) {
                        this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                    } else {
                        this.$confirm(`此操作为批量审核通过勾选的数据，确认此操作吗？`, "提示", {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            let params = {
                                id: this.selectId,
                            };
                            val.value > -1 && (params.status = val.value);
                            this.api_change_states(params);
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作`})
                        });
                    }
                } else {//审核不通过进行的操作
                    if (this.selectId.length === 0) {
                        this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                    } else {
                        this.dailogTitle = "批量审批不通过";
                        this.isShowDialog = true;
                        this.addDiscuss = this.selectId; //多个审批
                        this.placeHolder = "请填写批量审批不通过原因";
                        this.execute = 2;
                    }
                }

            },
            delete_supplier(id) {
                this.$http(api_delete_supplier, id).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    let index = this.table.dataList.indexOfFun(id, function (old, id) {
                        return old.id === id;
                    });
                    this.table.dataList.splice(index, 1);
                    this.$set(this.table, 'totalSize', this.table.totalSize - 1)
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            //           ---------------------------------  查看供应商
            look_supplier(id) {
                this.$http(api_look_supplier, id).then(res => {
                    this.checkedDialog = true;
                    this.$set(res, 'payment_effective_time', res.payment_effective_time * 1000);
                    this.lookEditForm = res;
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = res.city_id;
                        this.lookEditForm.area_id = res.area_id;
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//           ---------------------------------  编辑Api
            edit_supplier(id) {
                this.$http(api_edit_supplier, id).then(res => {
                    this.dialog = true;
                    res.file.forEach(row => {
                        row.file === undefined && (row.file = {});
                    });
                    if (res.payment_information) {
                        res.payment_information.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.supplier_plant) {
                        res.supplier_plant.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.business_image) {
                        res.business_image.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }

                    res.payment_effective_time = res.payment_effective_time ? res.payment_effective_time * 1000 : '';
                    this.lookEditForm = res;
                    if (this.operationStatus===1){
                        this.lookEditForm.operation_type="edit"
                    }
                    let Object = {city_id: res.city_id, area_id: res.area_id};
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = Object.city_id;
                        this.$nextTick(() => {
                            this.lookEditForm.area_id = Object.area_id;
                        })
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//            ---------------------------------  审核供应商Api
            audit_supplier(id) {
                this.$http(api_look_supplier, id).then(res => {
                    this.dialog = true;
                    this.$set(res, 'payment_effective_time', res.payment_effective_time * 1000);
                    this.lookEditForm = res;
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = res.city_id;
                        this.lookEditForm.area_id = res.area_id;
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
            api_change_states(data) {
                this.$http(api_change_states, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
//                              ------------成功就更新数据
                    this.search();
                }).catch(code => {
                    console.log(code);
                });
            },
            // 操作记录
            api_get_supplier_id_log(data) {
                this.$http(api_get_supplier_id_log, data).then(res => {
                    this.operation_log_data = res;
                    this.logDialog = true;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            // 新增洽谈记录
            addDiscussRecordDialog(val) {
                if (val.status === 1) {  //新增洽谈
                    this.dailogTitle = "新增洽谈记录";
                    this.placeHolder = "请填写洽谈详情";
                    this.isShowDialog = true;
                    this.addDiscuss = val.id;
                    this.execute = 1
                } else if (val.status === 2) { //单个审批不通过原因
                    this.dailogTitle = "审批不通过";
                    this.isShowDialog = true;
                    this.addDiscuss = [val.id];
                    this.placeHolder = "请填写审批不通过原因";
                    this.execute = 2;
                }
            },
//            ---------------------------------   分页
            size_change(size) {
                console.log(size);
                let updateData = window.clone(this.searchData);
                this.table.pageSize = size;
                updateData.pageSize=size;
                this.init(updateData);
            },
            current_change(page) {
                let updateData = window.clone(this.searchData);
                updateData.page=page;
                this.table.page = page;
                this.init(updateData);
            },
//            ---------------------------------   搜索不同的状态
            select_status(val, item) {
                let updateData = window.clone(this.searchData);
                this.curStatus = item.status;
                this.init(updateData);
            },
//            ---------------------------------   搜索
            search() {
                let updateData = window.clone(this.searchData);
                this.init(updateData);
            },
//            ---------------------------------   清空搜索
            clear_search() {
                this.snType = "company_name";
                this.snText = "";
                this.balance_type = '';
                this.init();
            },
//            ---------------------------------   添加
            add() {
                this.lookEditForm = {
                    id: '',
                    company_name: '',
                    code: '',
                    level: '',
                    type: 0,
                    invoice: '',
                    legal: '',
                    business_license: '',
                    file: [],
                    online_shop_name: '',
                    link: '',
                    purchaser_id: '',
                    categorys: [],
                    new_reason: '',
                    transaction_type: '',
                    pay_type: '',
                    public_bank_address:'',
                    public_swift_address:'',
                    public_cnaps:'',
                    private_bank_address:'',
                    private_swift_address:'',
                    private_cnaps:'',
                    default_payment_method:1,
                    auto_payment_reques:1,
                    return_goods:'',
                    return_goods_data:"",
                    label_deck:"",
                    case_packing:"",
                    supply_chain_finance:"",
                    public_accounts: '',
                    public_accounts_name: '',
                    public_accounts_bank: '',
                    public_bank_city: '',
                    no_pass_reason:"",
                    public_bank_retained_contact_way: '',
                    private_accounts: '',
                    private_accounts_name: '',
                    private_accounts_bank: '',
                    opening_bank_city: '',
                    opening_id_card: '',
                    bank_retained_contact_way: '',
                    payment_information: [],
                    business_image:[],
                    supplier_plant:[],
                    balance_type: '',
                    payment_effective_time: '',
                    payment_communicator: '',
                    payment_communicator_name: '',
                    contacts: "",
                    contacts_job: "",
                    mobile: "",
                    qq: '',
                    contacts2: "",
                    contacts2_job: "",
                    mobile2: "",
                    qq2: "",
                    province_id: "",
                    city_id: "",
                    area_id: '',
                    address: '',
                    remark: ''
                };
                this.editLookTitle = '新增供应商';
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.operationStatus = -1;
                this.isLook = false;
                this.dialog = true;
            },
            select_province_() {
                this.lookEditForm.city_id = "";
                this.lookEditForm.area_id = "";
            },
            select_city_() {
                this.lookEditForm.area_id = "";
            },
//            ---------------------------------   查看
            look_over(row) {
                this.isLook = true;
                this.editLookTitle = `查看供应商：${row.company_name} 信息`;
                this.look_supplier(row.id);
            },
//            ---------------------------------   编辑
            edit(row) {
                this.isLook = true;
                this.editLookTitle = `编辑供应商：${row.company_name} 信息`;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   重提
            revisitingit(row) {
                this.isLook = false;
                this.editLookTitle = `重新提交供应商`;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   重启
            enabled(row) {
                this.isLook = false;
                this.editLookTitle = `重新启用供应商`;
                this.dialog = true;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   审核
            audit(row) {
                this.isLook = true;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.editLookTitle = `审核供应商：${row.company_name} 信息`;
                this.audit_supplier(row.id)
            },
//            ---------------------------------   操作日志
            log(row) {
                this.isLook = false;
                this.logDialogTitle = '操作日志';
                this.api_get_supplier_id_log(row.id)
            },
            add_edit(id, categorys, data) {
                let updateData = window.clone(this.lookEditForm);
                delete updateData.payment_communicator_name;
                updateData.update_time = datef('YYYY-MM-dd HH:mm:ss', new Date() / 1000);
                updateData.payment_effective_time = !!updateData.payment_effective_time ? datef('YYYY-MM-dd', updateData.payment_effective_time / 1000) : 0;//谈帐日期如果不存在传0值
                updateData.categorys = categorys;
                updateData.file = updateData.file.map(row => {
                    return {
                        name: row.file.name,
                        size: row.file.size,
                        is_delete: row.path === '' && !!row.id,
                        id: row.id || '',
                        image: row.file.image
                    }
                });
                if (updateData.pay_type !== 2) {
                    delete updateData.public_accounts;
                    delete updateData.public_accounts_name;
                    delete updateData.public_accounts_bank;
                    delete updateData.public_bank_city;
                    delete updateData.public_bank_retained_contact_way;
                    delete updateData.private_accounts;
                    delete updateData.private_accounts_name;
                    delete updateData.private_accounts_bank;
                    delete updateData.opening_bank_city;
                    delete updateData.opening_id_card;
                    delete updateData.bank_retained_contact_way;
                    delete updateData.payment_information;
                    delete updateData.supplier_plant;
                    delete updateData.business_image;
                }
                if (!!updateData.payment_information||!!updateData.supplier_plant||!!updateData.business_image) {
                         updateData.payment_information = updateData.payment_information.map(row => {
                             return {
                                 name: row.file.name,
                                 size: row.file.size,
                                 is_delete: row.path === '' && !!row.id,
                                 id: row.id || '',
                                 image: row.file.image
                             }
                         });
                         // ----------------------------------------------供应商厂房
                         updateData.supplier_plant = updateData.supplier_plant.map(row => {
                             return {
                                 name: row.file.name,
                                 size: row.file.size,
                                 is_delete: row.path === '' && !!row.id,
                                 id: row.id || '',
                                 image: row.file.image
                             }
                         });
                         // ----------------------------------------------营业图片
                         updateData.business_image = updateData.business_image.map(row => {
                             return {
                                 name: row.file.name,
                                 size: row.file.size,
                                 is_delete: row.path === '' && !!row.id,
                                 id: row.id || '',
                                 image: row.file.image
                             }
                         });
                         let removeInformation = this.removeInformation.filter(row => !!row.id);
                         if (removeInformation.length > 0) {
                            updateData.file.push(...removeInformation.map(row => ({id: row.id, is_delete: true})));
                         }
                         let removeSupplierPlan = this.removeSupplierPlan.filter(row => !!row.id);
                         if (removeSupplierPlan.length > 0) {
                             updateData.file.push(...removeSupplierPlan.map(row => ({id: row.id, is_delete: true})));
                         }
                         let removeBusinessImage = this.removeBusinessImage.filter(row => !!row.id);
                         if (removeBusinessImage.length > 0) {
                             updateData.file.push(...removeBusinessImage.map(row => ({id: row.id, is_delete: true})));
                         }
                }
                let removeFile = this.removeFile.filter(row => !!row.id);
                if (removeFile.length > 0) {
                    updateData.file.push(...removeFile.map(row => ({id: row.id, is_delete: true})));
                }
                if (!!id) {
                    if (!!data) {
                        updateData.operation_type=data;
                        this.edit_update(id, updateData);
                    } else {
                        this.edit_update(id, updateData);
                    }
                } else {
                    this.add_update(updateData);
                }
            },
            add_update(data) {
                this.$http(api_add_supplier, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    });
                    let param = res.data;
                    this.$set(param, 'mobile', data.mobile);
                    this.$set(param, 'source', '采购');
                    this.$set(param, 'status', 0);
                    this.table.dataList.unshift(param);
                    this.table.totalSize += 1;
                    this.dialog = false;
                    this.search();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('update_look_edit_form', false);
                    }, 300);
                });
            },
            edit_update(id, data) {
                this.$http(api_update_supplier, id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.dialog = false;
                    let find = this.table.dataList.find(res => res.id === id);
                    if (!!find) {
                        Object.assign(find, data);
                    }
                    //---------------------重新搜索刷新
                    this.search()
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('update_look_edit_form', false);
                    }, 200);
                });
            },
//          ---------------------------------   删除
            cur_delete(row) {
                this.$confirm(`您将删除 ${row.company_name} 供货商，确认此操作吗？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete_supplier(row.id);
                }).catch(() => {
                    this.$message({type: "info", message: `已取消删除`});
                });
            }
        },
        components: {
            labelButtons:require('@/components/label-buttons').default,
            editLookover:require('./edit-lookover').default,
            trendsSelect: require('@/components/trends-select').default,
            scroll: require('@/components/scroll').default,
            uiTip: require('@/components/ui-tip').default,
            searchCard: require('@/components/search-card').default,
            exportDialog: require('../../../report/export-dialog').default,
            modifyDialog:require('./modify-dialog').default,
            orderInput:require("@/components/order-input.vue").default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
            purchaser:require('../../../../api-components/purchaser.vue').default,
            addDiscussRecord:require('./add-discuss-record').default,
            purchaseRecord:require('./purchase-record').default,
            operationLog:require('./operation-log').default,
            discussRecord:require('./discuss-record').default,
            chekedSuppliers:require('./checked-suppliers').default,
            paramAccount: require('@/api-components/param-account.vue').default,
            exportField: require("@/components/export-field").default,
        }
    }
</script>
