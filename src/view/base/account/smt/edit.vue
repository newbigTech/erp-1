<template>
    <el-row class="p-add">
        <page-dialog :title="editLabel" size="small" width="550px" left="30%"  v-model="editDialog" :close-on-click-modal=false>
            <div>
                <el-form label-width="160px" :model="form" ref="form" :rules="rules">
                    <el-card>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item
                                        label="速卖通用户名："
                                        prop="account_name">
                                    <el-input v-model="form.account_name" :disabled=true></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="简称：" prop="code">
                                    <el-input v-model="form.code"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="抓取速卖通Listing功能：">
                                    <el-select v-model="form.download_listing">
                                        <el-option
                                                :key="item.value"
                                                v-for="item in downloadLists"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="抓取速卖通订单功能：">
                                    <el-select v-model="form.download_order">
                                        <el-option
                                                :key="item.value"
                                                v-for="item in catchOrder"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <span class="add-color">（0表示未启用）</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="抓取速卖通站内信功能：">
                                    <el-select v-model="form.download_message">
                                        <el-option
                                                :key="item.value"
                                                v-for="item in catchOrder"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!--<el-input v-model="form.download_message"></el-input>-->
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <span class="add-color">（0表示未启用）</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="同步发货状态到速卖通功能：">
                                    <el-select v-model="form.sync_delivery">
                                        <el-option
                                                :key="item.value"
                                                v-for="item in catchOrder"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <span class="add-color">（0表示未启用）</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="同步健康数据：">
                                    <el-select v-model="form.download_health">
                                        <el-option v-for="item in downloadLists"
                                                   :key="item.value"
                                                   :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <span class="add-color">（0表示未启用）</span>
                            </el-col>
                        </el-row>
                    </el-card>
                    <!-- <弃用> -->
                    <!-- <el-card class="add-mt">
                        <div slot="header" class="add-p" style="font-weight:bold">请选择希望该账户支持的订单获取方式</div>
                        <div class="add-p">
                            <el-row>
                                <el-col :span="24">
                                    <el-checkbox v-model="checked1" :disabled=true>API获取 (向导将引导您登录速卖通网站进行授权)</el-checkbox>
                                </el-col>
                                <el-col :span="24">
                                    <el-checkbox v-model="checked2" :disabled=true>文件导入</el-checkbox>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card> -->
                    <!-- </弃用> -->
                    <div class="card">
                        <el-row>
                            <!--<el-form label-width="100px" :model="form" ref="form" :rules="rules">-->
                                <el-col :span="15">
                                    <el-form-item
                                            label="交易费比例："
                                            prop="trad_percent"
                                    >
                                        <el-input v-model="form.trad_percent" type="trad_percent"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9">
                                    <label style="line-height:32px;">&nbsp;%&nbsp;&nbsp;<span class="add-color">注意输入框后已有百分号</span></label>
                                </el-col>
                            <!--</el-form>-->
                        </el-row>
                        <label>用于计算订单利润以及统计公司阶段利润，有可能因为品类不同导致交易费率并非固定值，请自行估算，填入统
                            计意义上准确的值即可。</label>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <request-button @click="updateAli" req-key="updateAli">确定</request-button>
                <el-button  size="mini" @click.native="cancel">取消</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .add-mt{
        margin-top:10px;
    }
    .add-p{
        padding:10px;
    }
    .add-color{
        color:#e4393c;
    }
</style>
<script>
    import {aliexpress_update} from '../../../../api/aliexpress';
    import pageDialog from '../../../../components/page-dialog.vue';
    import {integer} from '../../../../define/validator_reg';
    export default{
        data(){
            let isNumber = (rule,value,callback)=>{
                return !integer.test(value)? callback(new Error('请输入非负整数 ！')):callback();
            };
            return {
                downloadLists:[
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
                catchOrder:[{label:"未启用",value:0},{label:'10分钟',value:10},{label:'20分钟',value:20},{label:'30分钟',value:30}],
                editDialog:false,
                checked1:"",
                checked2:"",
                dealScale:"",
                rules:{
                    code:[
                        {required:true,message:'简称项不允许为空',trigger:'blur'}
                    ],
                    account_name:[
                        {required:true,message:'用户名不允许为空',trigger:'blur'}
                    ],
                    trad_percent:[
                        {required:true,message:'交易费比例不允许为空',trigger:'blur'},
                        {validator:isNumber,trigger:'blur'}
                    ]
                }
            }
        },
        created(){},
        mounted(){
            this.editDialog=this.value;
        },
        watch:{
            editDialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.editDialog=val;
            }
        },
        methods:{
            updateAli(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        Object.keys(this.form).forEach(key=>{
                           if(typeof this.form[key] === 'string'){
                               this.form[key] = this.form[key].trim();
                           }
                        });
                        this.$http(aliexpress_update,this.form.id, this.form).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.$emit('edit-result', this.form.id, this.form);
                            this.editDialog=false;
                        }).catch(code=>{
                            this.editDialog = true;
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('updateAli', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('updateAli',false);
                    }
                })
            },
            cancel(){
                this.editDialog=false;
            }
        },
        props:{
            editLabel:{
                required:true,
                type:String
            },
            value:{},
            form:{
                requires:true,
                type:Object
            },
        },
        components: {
            pageDialog
        }
    }
</script>