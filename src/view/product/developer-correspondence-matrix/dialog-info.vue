<template>
    <page-dialog
        v-model="show"
        :title = "title"
        width="980px"
        >
        <div class="table-wrap mt-md mb-md" >
            <el-row v-if="flag===3" class=" mb-md">
                <el-button type="primary" @click="add_tabledata">添加</el-button>
                <el-button @click="delete_tabledata" :disabled="!(selectData.length)">删除</el-button>
            </el-row>

            <table width="100%" cellspacing="0">
                <tr>
                    <th v-if="flag===3"><el-checkbox v-model="checkAll" :disabled="tableData.length===1"></el-checkbox></th>
                    <th v-for="item in headList">{{item.label}}</th>
                </tr>
                <tr v-for="(item,index) in tableData" :key="index">
                    <td v-if="flag===3"><el-checkbox v-model="item.isCheck" :disabled="tableData.length===1" ></el-checkbox></td>
                    <td>
                        <el-select v-model="item.developer_id" :disabled="flag===2||flag===1?true:false"  filterable clearable placeholder="请选择">
                            <el-option
                                v-for="item in developerOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled = "item.disabled">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.grapher" :disabled="flag===1?true:false"  filterable clearable placeholder="请选择">
                            <el-option
                                v-for="item in grapherOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                     </td>
                    <td>
                        <el-row v-for="(row,i) in item.translator" :key="i" class="translator-wrap ">
                            <el-col :span="10">
                                <el-row class="inline">
                                    <el-select v-model="row.lang"
                                               :disabled="flag===1?true:false"
                                               filterable
                                               clearable
                                               placeholder="请选择翻译语言"
                                               @change="changeLangOptions(item)">
                                        <el-option
                                            v-for="it in item.langOptions"
                                            :key="it.value"
                                            :label="it.label"
                                            :value="it.value"
                                            :disabled="it.disabled">
                                        </el-option>
                                    </el-select>
                                </el-row>
                            </el-col>
                            <el-col :span="10">
                                <el-row class="inline ml-sm">
                                    <el-select v-model="row.translator" :disabled="flag===1?true:false" filterable clearable placeholder="请选择对应翻译员">
                                        <el-option
                                            v-for="item in translatorOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-row>
                            </el-col>
                            <el-col :span="4">
                                <el-row class="inline ml-sm" >
                                    <el-button v-if="i===0&&flag!==1"
                                               type="primary"
                                               @click="add_translator(item,index)"
                                               :disabled="isDisabled(item)"
                                               size="mini" > 添加 </el-button>
                                    <i v-if="i!==0&&flag!==1"
                                       class="el-icon-delete"
                                       style="color:red;font-size:18px;cursor:pointer"
                                       @click="delete_translator(item,index,i)">
                                    </i>
                                </el-row>
                            </el-col>
                        </el-row>
                    </td>
                    <td>
                        <el-select v-model="item.designer_master" :disabled="flag===1?true:false" filterable clearable placeholder="请选择">
                            <el-option
                                v-for="item in designerMasterOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
        </div>
        <div slot="footer">
            <div>
                <el-button v-if="flag===1" @click="show=false"> 关闭 </el-button>
                <el-button v-if="flag!==1" type="primary" @click="submit"> 确定 </el-button>
                <el-button v-if="flag!==1" @click="show=false"> 取消 </el-button>
            </div>
        </div>
    </page-dialog>
</template>

<script>
    import {api_developer,api_grapher,api_translator,api_lang,api_designer_master,api_developer_btach_add,api_developer_change} from "@/api/developer-correspondence-matrix.js"
    export default {
        name: "dialog-info",
        data(){
            return{
                show:this.value,
                headList:[
                    {label:"开发员"},
                    {label:"摄影师"},
                    {label:"翻译语言/翻译员"},
                    {label:"美工组长"}
                ],
                tableData:[],
                developerOptions:[],
                save_developerOptions:[],
                translatorOptions:[],
                grapherOptions:[],
                langOptions:[],
                save_langOptions:[],
                designerMasterOptions:[]
            }
        },
        computed:{
            checkAll:{
                set(val){
                    if(val){
                        this.tableData.forEach((val)=>{
                            val.isCheck=true
                        })
                    }else{
                        this.tableData.forEach((val)=>{
                            val.isCheck=false
                        })
                    }
                },
                get(){
                    let find  = this.tableData.find((val)=>{
                        return !val.isCheck
                    });
                   if(!find){
                        return true
                   }else{
                        return false
                   }
                }
            },
            selectData(){
                return this.tableData.filter(val=>{
                    return val.isCheck
                })
            },
            selectedLangs(){
                return this.langOptions.filter(val=>{
                    return !val.disabled
                })
            }
        },
        created(){
            this.getTranslatorList();
            this.getGrapherList();
            this.getLangList();
            this.getDesignMasterList();
            this.getDeveloperList();
        },
        methods:{
            isDisabled(item){
                let find = item.langOptions.find(val=>{
                    return !val.disabled
                });
                return !!find?false:true
            },
            changeLangOptions(item){
                let selectedLangs = [];
                item.translator.forEach(val=>{
                    if(val.lang){
                        selectedLangs.push({lang:val.lang})
                    }
                });
                let options_lang = window.clone(this.save_langOptions);
                selectedLangs.forEach(value=>{
                    options_lang.forEach(row => {
                        if (value.lang === row.value) {
                            row.disabled = true;
                        }
                    })
                });
                this.$set(item,"langOptions",options_lang); // 翻译语言选中不可再次勾选
            },
            add_tabledata(){
                this.tableData.push({
                    developer_id:"",
                    grapher:"",
                    designer_master:"",
                    translator:[
                        {
                            lang:"",
                            translator:""
                        }
                    ],
                    langOptions:window.clone(this.save_langOptions),
                    isCheck:false
                });
            },
            delete_tabledata(){
                let arr = this.tableData.filter((val)=>{
                    return !val.isCheck
                });
                this.$set(this,"tableData",arr);
            },
            add_translator(item,index){
                this.tableData[index].translator.push({lang:"",translator:""});
            },
            delete_translator(item,index,i){
                this.tableData[index].translator.splice(i,1);
            },
            submit(){
                switch(this.flag){
                    case 0:
                        //add
                        this.submit_add();
                        break;
                    case 1:
                        break;
                    case 2:
                        //edit
                        this.edit_data();
                        break;
                    case 3:
                        //batch_add
                        this.submit_add();
                        break;
                }
            },
            submit_add(){
                const h = this.$createElement;
                let lists = this.tableData.map(val=>{
                    return {
                        developer_id:val.developer_id,
                        grapher:val.grapher,
                        designer_master:val.designer_master,
                        translator:val.translator
                    }
                });
                this.$http(api_developer_btach_add,{lists}).then(res=>{
                    let find =  res.find(val=>{
                        return val.status===1
                    });
                    if(!!find){
                        this.$msgbox({
                            type:"warning",
                            message:h("div",null,res.map(val=>{return h("p",{style: {width: '300px'}},val.message)}))||res,
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                    }else{
                        this.$msgbox({
                            type:"success",
                            message:h("div",null,res.map(val=>{return h("p",{style: {width: '300px'}},val.message)}))||res,
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                    }
                    this.$emit("refresh");
                    this.show = false;
                }).catch((err)=>{
                    this.$message({type:"error",message:err.message||err});
                })
            },
            edit_data(){
                let id = this.tableData[0].developer_id;
                let data = {
                    grapher:this.tableData[0].grapher,
                    designer_master:this.tableData[0].designer_master,
                    translator:this.tableData[0].translator,
                };
                this.$http(api_developer_change,id,data).then(res=>{
                    this.$emit("refresh");
                    this.show = false;
                    this.$message({type:"success",message:res.message})
                }).catch(err=>{
                    this.$message({type:"error",message:err.message||err})
                })

            },
            getTranslatorList(){
                this.$http(api_translator).then(res=>{
                    this.translatorOptions = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    })
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            getGrapherList(){
                this.$http(api_grapher).then(res=>{
                    this.grapherOptions = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    })
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            getLangList(){
                this.$http(api_lang).then(res=>{
                    let options = res.map(val=>{
                        return {
                            value:val.code,
                            label:val.name,
                            disabled:false
                        }
                    });
                    this.$set(this,"save_langOptions",options);
                    this.$set(this,"langOptions",options);
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            getDesignMasterList(){
                this.$http(api_designer_master).then(res=>{
                    this.designerMasterOptions = res.map(val=>{
                        return {
                            value:val.id,
                            label:val.realname
                        }
                    });
                    this.designerMasterOptions.unshift({value:0,label:"默认值"})
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            getDeveloperList(){
                this.$http(api_developer).then(res=>{
                    let options = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id,
                            disabled:false
                        }
                    });
                    this.developerOptions = options;
                    this.save_developerOptions = options;
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                });
            },
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            },
            edit_info:{
                deep:true,
                handler(val,oldVal){
                    this.tableData = window.clone(val);
                }
            }

        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            edit_info:{
                required:true,
                type:Array
            },
            flag:{
                required:true,
                type:Number
            },
            parent_data:{
                required:true,
                type:Array
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .table-wrap{
        table{
            border-bottom:1px solid #cdcdcd;
            tr{
                td,th{
                    padding:5px 8px;
                    border-top:1px solid #cdcdcd;
                    border-left:1px solid #cdcdcd;
                    &:last-child{
                        border-right:1px solid #cdcdcd;
                    }

                }
            }

        }
        .translator-wrap{
            padding-top:5px;
            &:first-child{
                padding-top:0;
            }

        }
    }

</style>

