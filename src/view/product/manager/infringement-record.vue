<template>
    <div class="c-Infringement-record">
        <p>
            <el-button  v-if="editAble" type="primary" @click="show_dialog(1,null)">新增侵权记录</el-button>
            <el-button  v-else   type="primary" @click.native="edit" >编辑</el-button>
        </p>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="channel_name"
                label="平台"
                >
            </el-table-column>
            <el-table-column
                prop="site_code"
                label="站点"
                >
            </el-table-column>
            <el-table-column
                prop="account_name"
                label="账号">
            </el-table-column>
            <el-table-column
                label="时间">
                <template slot-scope="scope">
                    {{new Date(scope.row.tort_time*1000).toLocaleDateString()}}
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                label="侵权描述">
            </el-table-column>
            <el-table-column
                v-if="editAble"
                label="操作">
                <template slot-scope="scope">
                    <span style="color:dodgerblue;cursor: pointer;" @click="show_dialog(2,scope.row)">编辑</span>
                    <span>|</span>
                    <span style="color:dodgerblue;cursor: pointer;" @click="delete_Infringement(scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <!--新增侵权记录弹窗-->
        <page-dialog
            :title="InfringementTitle"
            v-model="InfringementDialog"
            size="small"
            :height="'40%'"
            :width="'500px'"
        >
            <div style="box-sizing: border-box;padding:15px 30px;">
                <div style="text-align:center">
                <el-form  status-icon  ref="ruleForm2" label-width="75px" class="demo-ruleForm">
                        <el-form-item  class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>平台：</span>
                            </div>
                            <div style="flex:1;">
                                <select-remote class="s-width-default"
                                               @change="change_channel"
                                               :all="false"
                                               v-model="channelName"
                                               :remote="channel_remote">
                                </select-remote>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>站点：</span>
                            </div>
                            <div style="flex:1;" >
                                <el-select :disabled="siteCodeOptions.length<=1"
                                           class="s-width-middle"
                                           filterable clearable
                                           :placeholder="sitePlaceholder"
                                           v-model="siteCode">
                                    <el-option v-for="item in siteCodeOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right;box-sizing: border-box;padding-right:5px;">
                                <span style="color:red;">*</span><span>账号简称:</span>
                            </div>
                            <div style="flex:1;">
                                <el-select :disabled="accountFlag"
                                           filterable
                                           clearable
                                           remote
                                           :remote-method="remoteMethod"
                                           :placeholder="accountPlaceholder"
                                           class="s-width-small"
                                           v-model="accountName">
                                    <el-option v-for="item in accountNameOptions2"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>时间：</span>
                            </div>
                            <div style="flex:1;">
                                <el-date-picker
                                    v-model="tortTime"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item  class="form-item">
                            <div style="width:70px;text-align:right;box-sizing: border-box;padding-right:5px;">
                                <span style="color:red;">*</span><span>侵权描述:</span>
                            </div>
                            <div style="flex:1;">
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="remark">
                                </el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="text-align:right">
                    <el-button type="primary" @click="keep">确 定</el-button>
                    <el-button @click="InfringementDialog = false">取 消</el-button>
                </div>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .c-Infringement-record{
        .el-form-item__content{
            width:100% !important;
            display:flex;
            margin-left:0px !important;
        }
        .el-select{
            width:100% !important;
            .el-input{
                width:100% !important;
                input{
                    width:100% !important;
                }
            }
        }
    }
</style>

<script>
    import {
        api_account_list,
        api_get_channel,
    } from '../../../api/order-local';
    import {api_get_channel_categories,api_put_Infringement,api_get_goods_description,api_delete_Infringement,api_edit_Infringement} from  "../../../api/product-library";
    import {url_put_Infringement,url_edit_Infringement,url_delete_Infringement} from  "../../../api/product-library";
    export default {
        data(){
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableData:[],
                InfringementDialog:false,
                channelName:"",
                siteCode:"",
                siteCodeOptions:[],
                siteCodeMsg:"请选择平台",
                accountMsg:"请选择平台",
                accountName:"",
                accountNameOptions:[],
                accountNameOptions2:[],
                tortTime:"",
                remark:"",
                platformList:[],
                editMsgId:'',
                changeChannelNumber:0,
                InfringementTitle:"",
                accountID:""
            }
        },
        computed:{
            sitePlaceholder(){
                if(this.channelName<=0){
                    return "请先选择平台";
                }else if(this.siteCodeOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if(this.channelName==="" && this.siteCode===""){
                    return "请先选择平台";
                }else if(this.accountNameOptions.length<=1){
                    return "该平台下暂无账号";
                }else if(this.channelName!=="" && this.siteCode===""&&this.sitePlaceholder!=="该平台下暂无站点" ){
                    return "请先选择站点"
                }else{
                    return "请选择账号"
                }
            },
            accountFlag(){
                if(this.siteCode==="" && this.sitePlaceholder!=="该平台下暂无站点"){
                    return true;
                }else if(this.sitePlaceholder==="该平台下暂无站点"){
                    return false;
                }else if(this.accountNameOptions.length<=1){
                    return true;
                }
            },
        },
        methods: {
            /*显示弹窗*/
            show_dialog(type,obj){   //type用于判断新增还是编辑
                if(type===1){
                    this.InfringementTitle="新增侵权记录";
                    this.add_Infringement_message();
                }else{
                    this.InfringementTitle="编辑侵权记录";
                    this.edit_Infringement(obj);
                }
            },
            /*确定按钮*/
            keep(){
                if(this.InfringementTitle==="新增侵权记录"){
                    this.add_Infringement();
                }else{
                    this.keep_edit_Infringement();
                }
            },
            add_Infringement_message() {
                if(this.$hasPermission(url_put_Infringement)){
                    this.InfringementDialog = true;
                    this.$http(api_get_channel_categories)
                        .then(res => {
                            this.platformList = [...res];
                        })
                        .catch(err => {
                            console.log('出错了' + err);
                        })
                }else{
                    this.$message({
                        type:"error",
                        message:"没有添加侵权记录的权限"
                    })
                }
            },
            add_Infringement() {
                let data = {
                    channel_id: this.channelName,
                    account_id: this.accountName,
                    site_code: this.siteCode,
                    remark: this.remark,
                    tort_time: new Date(this.tortTime).toLocaleDateString()
                }
                if (this.channelName && (this.siteCode||this.sitePlaceholder==="该平台下暂无站点") && this.accountName && this.tortTime && this.remark) {
                    this.$http(api_put_Infringement, this.goodsId, data)
                        .then(res => {
                            this.InfringementDialog = false;
                            this.get_description_message();
                            this.channelName = "";
                            this.siteCode = "";
                            this.remark = "";
                            this.tortTime = "";
                            this.accountName = "";
                            this.$message({
                                type:"success",
                                message:"添加成功"
                            })
                        })
                        .catch(err => {
                            console.log('出错了' + err);
                        })
                }else {
                    if (!this.channelName) {
                        this.$message({type: "error", message: "平台不能为空"});
                    } else if (!this.siteCode &&this.sitePlaceholder!=="该平台下暂无站点") {
                        this.$message({type: "error", message: "站点不能为空"});
                    } else if (!this.accountName) {
                        this.$message({type: "error", message: "账号简称不能为空"});
                    } else if (!this.tortTime) {
                        this.$message({type: "error", message: "创建时间不能为空"});
                    } else if (!this.remark) {
                        this.$message({type: "error", message: "侵权记录不能为空"});
                    }
                }
            },
            //获取侵权信息
            get_description_message(){
                this.$http(api_get_goods_description, this.goodsId, {page: this.currentPage, page_size: this.pageSize})
                    .then(res => {
                        this.tableData = [...res.list];
                    })
                    .catch(err => {
                        console.log(err + '出错了');
                    })
            },
            //编辑侵权记录
            edit_Infringement(obj) {
                if(this.$hasPermission(url_edit_Infringement)){
                    this.InfringementDialog=true;
                    this.$http(api_get_channel_categories)
                        .then(res => {
                            this.platformList = [...res];
                        })
                        .catch(err => {
                            console.log('出错了' + err);
                        })
                    let {id}=obj;
                    this.editMsgId=id;
                    this.remoteMethod(obj.account_name);
                    this.$http(api_edit_Infringement,this.editMsgId)
                        .then(res=>{
                            this.channelName=res.channel_id;
                            this.siteCode=res.site_code;
                            this.accountName=res.account_id;
                            this.tortTime=res.tort_time*1000;
                            this.remark=res.remark;
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                }else{
                    this.$message({
                        type:"error",
                        message:"没有编辑侵权记录的权限"
                    })
                }
            },
            //保存编辑内容
            keep_edit_Infringement(){
                let data = {
                    id:this.editMsgId,
                    channel_id: this.channelName,
                    account_id: this.accountName,
                    site_code: this.siteCode,
                    remark: this.remark,
                    tort_time: new Date(this.tortTime).toLocaleDateString()
                }
                if (this.channelName && (this.siteCode||this.sitePlaceholder==="该平台下暂无站点") && this.accountName && this.tortTime && this.remark) {
                    this.$http(api_put_Infringement, this.goodsId, data)
                        .then(res => {
                            this.InfringementDialog=false;
                            console.log(res);
                            this.get_description_message();
                            this.channelName = "";
                            this.siteCode = "";
                            this.remark = "";
                            this.tortTime = "";
                            this.accountName = "";
                        })
                        .catch(err => {
                            console.log('出错了' + err);
                        })
                } else {
                    if (!this.channelName) {
                        this.$message({type: "error", message: "平台不能为空"});
                    } else if (!this.siteCode) {
                        this.$message({type: "error", message: "站点不能为空"});
                    } else if (!this.accountName) {
                        this.$message({type: "error", message: "账号简称不能为空"});
                    } else if (!this.tortTime) {
                        this.$message({type: "error", message: "创建时间不能为空"});
                    } else if (!this.remark) {
                        this.$message({type: "error", message: "侵权记录不能为空"});
                    }
                }
            },
        //删除侵权记录
            delete_Infringement(obj){
                if(this.$hasPermission(url_delete_Infringement)){
                    let {id}=obj;
                    this.$confirm('是否删除该侵权记录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delete_Infringement,id)
                            .then(res=>{
                                console.log(res);
                                this.get_description_message();
                            })
                            .catch(err=>{
                                this.$message({
                                    type: 'error',
                                    message: '未知错误!'
                                });
                            })
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    this.$message({
                        type:"error",
                        message:"没有删除侵权记录的权限",
                    })
                }
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                    console.log(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_account_site(channel_id){
                if(!channel_id){
                    this.accountNameOptions = [{label:"",value:""}];
                    this.siteCodeOptions = [{label:"",value:""}];
                    return
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length===0){
                        this.siteCodeOptions = [{label:"",value:""}]
                    }else{
                        this.siteCodeOptions = [...res.site];
                    }
                    if(res.account.length===0){
                        this.accountNameOptions = [{label:"",value:""}]
                    }else{
                        this.accountNameOptions = [...res.account];
                        this.accountNameOptions2=this.accountNameOptions.slice(0,50);
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            edit(){
                this.$emit("edit");
            },
            change_channel(){
                this.changeChannelNumber++;
                console.log("平台改变了:"+this.changeChannelNumber);
                if(this.changeChannelNumber>1){
                    this.siteCode="";
                    this.accountName="";
                }
            },
            //进行匹配搜索，节流下拉框数据
            remoteMethod(query) {
                if (query !== '' && (typeof query)==="string") {
                    setTimeout(() => {
                        this.accountNameOptions2 = this.accountNameOptions.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.accountNameOptions2=this.accountNameOptions.slice(0,50);
                }
            }
        },
        mounted(){
            this.get_description_message();
        },
        watch:{
            channelName(val) {
                this.get_account_site(val);
            },
            InfringementDialog(){
                this.channelName = "";
                this.siteCode = "";
                this.remark = "";
                this.tortTime = "";
                this.accountName = "";
                this.changeChannelNumber=0;
            },
        },
        props:{
            pageSize:{
                type:Number,
            },
            currentPage:{
                type:Number,
            },
            goodsId:{
                required:true,
                type:Number
            },
            editAble:{},
        },
        components:{
            "page-dialog":require("../../../components/page-dialog").default,
            selectRemote:require('../../../components/select-remote.vue').default,
        }
    }
</script>

