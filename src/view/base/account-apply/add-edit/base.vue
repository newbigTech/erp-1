<template>
    <div>
        <el-form-item label="发起日期："  >
            <el-col :span="6">
                <el-date-picker
                    v-model="editData.initiate_time"
                    type="date"
                    placeholder="日期"
                    :disabled="disabled"
                    class="width-all date">
                </el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="负责人：" ref="editForm">
            <el-col :span="6">      
                 <!-- :disabled="notRegister" -->
                <scroll-select v-model="accounts"  class="width-all"
                    textAlign="left"                   
                    ref="creater"
                    :remote="urlCreater"
                    :fix-params="fix_params_account"
                    :fixResult="fix_result_account">
                </scroll-select>
            </el-col>
        </el-form-item>
        
        <el-form-item label="平台：" ref="editForm">
            <el-col :span="6">
                <!-- :disabled="notRegister" -->
                <select-remote v-model="editData.channel_id"
                    class="width-all"
                    :all="false"                            
                    @load="load"
                    :remote="channel_remote">
                </select-remote>
            </el-col>
        </el-form-item>

        <el-form-item label="站点：" ref="editForm">
            <el-col :span="6">
                <!-- :disabled="siteOptions.length===0||notRegister" -->
                <el-select 
                        :disabled="editData.siteOptions.length===0" 
                        filterable clearable
                        multiple
                        class="width-all"
                        :placeholder="sitePlaceholder"
                        v-model="editData.site_code">
                    <el-option v-for="item in editData.siteOptions"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>

        <el-form-item label="品类：">
            <el-col :span="col11">
                <el-input type="text" 
                        class="width-all"  
                        v-model="editData.breed"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="公司名称：">
            <el-col :span="col11">
                <el-select filterable clearable
                            @clear='clear_companyName'
                            placeholder="请选择公司名称"
                            v-model="editData.company">
                    <el-option v-for="item in companyInfo"
                        :label="item.company"
                        :value="item.id"
                        :key="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <div class="inline img_lazy" v-if="editData.charter_url" @click="search_img(editData.charter_url)">
                <span class="el-upload-list__item-name"><i class="el-icon-document"></i>{{editData.charterSrcName}}</span>        
            </div>
        </el-form-item>

        <el-form-item label="公司类型：">
            <el-col :span="col11">
                <el-input type="text"
                    disabled
                  v-model="editData.company_type"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="法人姓名：">
            <el-col :span="col11">
                <el-input type="text"
                        disabled
                        v-model="editData.corporation"></el-input>
            </el-col>
            <div class="inline img_lazy" v-if="editData.corporation_id_front" @click="search_img(editData.corporation_id_front)">
                <span class="el-upload-list__item-name"><i class="el-icon-document"></i>{{editData.fontName}}</span>        
            </div>
            <span>&nbsp;&nbsp;</span>
            <div class="inline img_lazy" v-if="editData.corporation_id_contrary" @click="search_img(editData.corporation_id_contrary)">
                <span class="el-upload-list__item-name"><i class="el-icon-document"></i>{{editData.sideName}}</span>        
            </div>
        </el-form-item>

        <el-form-item label="信用卡：">
            <el-col :span="col11">
                <el-input
                    type="text"
                    disabled
                    v-model="editData.credit_card"></el-input>
            </el-col>
        </el-form-item> 
        <el-form-item label="VAT：">
            <el-col :span="col11">
                <el-input
                    type="text"
                    disabled
                    v-model="editData.vat"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="" class="mt-lg">
            <el-col :span="col11">
                <request-button req-key="sureKey" @click="sure">确定</request-button>
                <el-button @click.native="close" size="mini" >取消</el-button>
            </el-col>
        </el-form-item>
        
        <!-- 公用查看图片 -->
        <blowup-image v-model="imgDialog" :img-path="imgSrcShow" :title="`查看大图`"></blowup-image>
    </div>
</template>

<script>

import {api_get_channel, api_account_list} from  '../../../../api/report-channel';
import {api_get_server} from '../../../../api/server-management';
import {api_add_account, api_updata_account, api_get, api_get_already} from '../../../../api/account-apply'
import {email,chinese,phone} from '../../../../define/validator_reg'
import {mapActions,mapGetters} from 'vuex';
import ElTabPane from "element-ui/packages/tabs/src/tab-pane";
import { api_get_company_name, api_get_company_detail_info }  from '@/api/company-info';

export default {
    data() {
        return {
            col11: 11,         
            urlCreater:'get|user',
            disabled:true,
            companyInfo: [],  // 公司名称
            imgDialog: false,  // 设置img的显示与否.
            imgSrcShow: '',  // 图片显示路径.
        }
    },
    methods: {
        init() {
            // 获取公司名称
            this.company_remote();
        },
        /** 跳转确定 */
        sure() {
            if(!this.verification_data()){
                this.$reqKey('sureKey',false);
                return
            }
            this.$emit('jump', 'register');
        },
        /** 基本信息验证. */ 
        verification_data() {
            if(this.editData.initiate_man===''||this.editData.initiate_man_name==='') {            
                this.$message({type:"warning", message:"请选择负责人！"});
                return false
            }
            if(this.editData.channel_id===0) {             
                this.$message({type:"warning", message:"请选择平台！"});
                return false
            }//site_code
            if(this.editData.channel_id===1||this.editData.channel_id===2) {
                if(this.editData.site_code.length===0){            
                    this.$message({type:"warning", message:"请选择站点！"});
                    return false
                }
            }
            if(this.editData.breed.trim()==='') {
                this.$reqKey('sureKey',false);
                this.$message({type:"warning", message:"品类不能为空！"});
                return false
            }
            if(!this.editData.company) {  // 这里直接是公司的id
                this.$reqKey('sureKey',false);
                this.$message({type:"warning", message:"公司名称不能为空！"});
                return false
            }
            return true;
        },
        /** 取消清空对应的value值 */
        close() {
            this.accounts = {
                lable: '',
                value: ''
            };
            this.editData.breed = '';
            this.editData.company = '';
            this.editData.channel_id = '';
            this.clear_companyName();
        },                
        // 取平台参数.
        channel_remote(callback) {
            return this.$http(api_get_channel,{}).then(res=>{
                callback(res);
            }).catch(code=>{
                console.log(code);
            });
        },
        // 所有的平台参数
        load(options) {
            // options为对应下拉框的值.

        },
        /** 负责人参数 */ 
        //账号结果
        fix_result_account(res){
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
        //账号参数
        fix_params_account({page,pageSize,keyword}){
            return {
                page:page,
                pageSize:pageSize,
                snType:"department_id",
                snText:333,
                status:1
            };
        },

        /**获取所有的公司名称 */
        company_remote(callback) {
            this.$http(api_get_company_name,{}).then(res=>{
                /** 传入的参数为迭代的list,不能是obj */ 
                this.companyInfo = res.data;
            }).catch(code=>{
                console.log(code);
            });
        },
        /** 切换公司名, 获取对应的图片. */
        
        /** 清空对应公司名称值的时候,要清空对应的值. */
        clear_companyName() {
            this.editData.charter_url = '';   // 营业执照
            this.charterSrcName = ''; 
            this.editData.company_type = '';
            this.editData.corporation = '';
            this.editData.corporation_id_front = "";
            this.fontName = "";
            this.editData.corporation_id_contrary = "";
            this.sideName = '';
            this.editData.credit_card = "";
            this.editData.vat = "";
        },
        //查看大图
        search_img(src){
            this.imgDialog = true;
            this.imgSrcShow = src;            
        },
        
    },
    watch: {
        // 监听切换平台获取对应的站点
        "editData.channel_id"(val) {
            if(val===1||val===2){
               this.$emit('get_site', val);
            } else {
                this.editData.siteOptions = [];
                this.editData.site_code = [];
            }
            // this.get_alreadyBind();
         },
        /** 更新公司名 切换对对图片. */
         "editData.company"(val) {
            //  this.get_company_pic(val);
            this.$emit('get_company_pic', val);
         }
    },
    computed: {
         accounts:{    /** 确定负责人 */
            get(){
                return {label:this.editData.initiate_man_name,
                    value:this.editData.initiate_man}
            },
            set(val){
                console.log(val);
                this.editData.initiate_man_name = val.label;
                this.editData.initiate_man = val.value;
            }
         },
        //  设定站点提示.
         sitePlaceholder() {
            if(this.editData.site_code.length>0){
                return "";
            }else if(this.editData.siteOptions.length===0){
                return "该平台下暂无站点";
            }else {
                return "请选择站点"
            }
         },
         isAdd() {
            return this.action.value === 'add';
         },
    },
    props: {
        editData: {
            type: Object,
            require: true
        },
        action: {
            type: Object
        },
    },
    components: {
        scrollSelect:require('../../../../components/scroll-select.vue').default,
        selectRemote:require('../../../../components/select-remote.vue').default,
        blowupImage:require("@/components/blowup-image.vue").default,
    },
    mounted() {
        this.init();
    },
}
</script>
