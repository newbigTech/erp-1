<template>
    <page-dialog v-model="show" size="full" :title="title"
                 @open="open"
                 @close="close"
                 :close-on-click-modal="false">
        <el-card class="rule-dialog-header" v-if="isDefaultShow">
            <el-form label-width="125px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单自动处理动作：" label-width="150px" required>
                            <el-col :span="20">
                                <select-remote @load="auto_action" v-model="autoAction"
                                               :remote="auto_remote"></select-remote>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="showAutoContent" :label="autoTitle" required>
                            <el-col :span="12">
                                <select-remote
                                        v-if="autoAction === 1"
                                        v-model="autoContent"
                                        :remote="warehouse_remote">
                                </select-remote>     

                                <el-select v-model="autoContent" placeholder="请选择" v-if="autoAction === 2" filterable>
                                    <el-option
                                            v-for="item in shipping"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>

                                <uimui-select v-if="autoAction === 6" request="sku-map/query"
                                              v-model="autoContent">
                                </uimui-select>
                                <el-input v-if="autoAction === 4" v-model="autoContent"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规则名称：" required>
                            <el-col :span="24">
                                <el-input v-model="name" style="width:300px"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="12">
                            <el-form-item label="平台：">
                                <select-remote @load="platforms=$event" :remote="channel_remote" v-model="platform">
                                </select-remote>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <label-items label="有效期：" class="inline">
                        <el-date-picker
                                class="inline"
                                v-model="btime"
                                type="datetime"
                                :picker-options="pickerBtime"
                                placeholder="选择开始日期时间">
                        </el-date-picker>&nbsp;--&nbsp;
                        <el-date-picker
                                class="inline"
                                v-model="etime"
                                type="datetime"
                                :picker-options="pickerEtime"
                                placeholder="选择过期日期时间">
                        </el-date-picker>
                    </label-items>
                    <label-items label="是否启用：" class="inline ml-lg" required>
                        <div>
                            <el-switch class="fl" v-model="isSetup"
                                       on-text="启用"
                                       off-text="停用"
                                       on-color="#20a0ff"
                                       off-color="#C0CCDA">
                            </el-switch>
                        </div>
                    </label-items>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-xs">
            <el-row>
                <el-col class="rule-dialog-body" v-if="leftSpan" :span="leftSpan">
                    <el-card style="height: 99%;overflow: hidden;" :body-style="{height:'90%',overflowY:'auto'}">
                        <div slot="header">
                            <el-checkbox v-model="showSelect" label="仅显示勾选项"></el-checkbox>
                            <el-checkbox v-model="showContext" :label="showContext ? '显示选项内容' :'隐藏选项内容' "></el-checkbox>
                        </div>
                        <div>
                            <div class="rules" v-for="item in showRules">
                                <label>{{item.label}}</label>
                                <ul>
                                    <li v-for="subItem in item.child" :class="current(subItem)">
                                        <el-checkbox :value="subItemStatus(subItem)"
                                                     @change="change(subItem)"
                                                     :disabled="disable(subItem)">
                                        </el-checkbox>
                                        <span @click="click_item(subItem)">
                                        {{subItem.name}}
                                        <span class="context"
                                              v-if="showContext || showSelect">{{item_context(subItem)}}</span>
                                    </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col class="rule-dialog-body" v-if="rightSpan" :span="rightSpan">
                    <el-card>
                        <rule-cond :config="ruleConfig"
                                   :data="ruleData"
                                   :code="ruleCode"
                                   :title="ruleTitle"
                                   :channel="platform"
                                   :searchFlag='searchFlag'
                        >
                        </rule-cond>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="orderRuleDialog" @click="submit">提交/保存</request-button>
            <el-button @click.native="show=false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .rule-dialog-header {
        height: 20%;
    }

    .rule-dialog-body {
        height: 400px;
        max-height: 400px;
        overflow-y: auto;
        .el-card__header{
            border:1px solid transparent!important;
            background :none!important;
        }
    }

    .rule-box {
        border:1px solid #d1d1d1;
        border-radius :2px;
        padding:5px;
    }

    .rules {
        border: 1px solid #d6d6d6;
        margin-top: 5px;
        padding: 5px;

        >
        label {
            margin: 5px;
            display: block;
        }

        li {
            cursor: pointer;
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .current {
            background-color: rgba(22, 22, 22, 0.1);
        }
        .context {
            display: flex;
            flex: 1;
            color: #4e92ce;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover {
                color: #bb7829;
            }
        }
        .content-select {

        }

    }
</style>
<script>
    import {
        api_add,
        api_update,
        api_lookup,
        api_rule_items,
        api_getaction,
        api_getchannel,
        api_getwarehouse,
        api_getshipping,
        api_get_resource,
        api_shiping
    } from '../../../api/order-rules';
    import http from '../../../lib/http';
    import {calc_item_context} from './help';
    import {validators} from './validators'

    export default {
        data() {
            return {
                urlObject: {},
                showSelect: false,
                showContext: false,
                show: this.value,
                autoAction: 1,
                autoActions: [],
                name: '',
                autoContent: '',
                isSetup: false,
                platform: 0,
                platforms:[],
                configs: {},
                rules: [],
                selected: [],
                panelWith: 0,
                panelStatus: 1,
                isChange: false,
                btime: '',
                etime: '',
                shipping: [],
                warehouse: [],
                pickerBtime:{
                    disabledDate:(time)=>{
                        if(this.etime){
                            return time.getTime()>this.etime;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEtime:{
                    disabledDate:(time)=>{
                        if(this.btime){
                            return time.getTime()<this.btime;
                        }else{
                            return false;
                        }
                    }
                },
                searchFlag: true,
                accountFlag: false,   // 用来标记选择账号是否停用。
            }
        },
        created() {
            this.init();
        },
        methods: {
            calc_item_context,
            validators,
            shipping_remote(data) {
                this.shipping = [];
                if (data.warehouse_id.length === 0) {
                    return;
                }
                this.$http(api_getshipping, data).then(res => {
                    res = res.map(row => {
                        return {
                            label: row.carrier_name + '>>' + row.shortname,
                            value: row.shipping_method_id
                        }
                    });
                    this.$set(this, 'shipping', res);
                }).catch(code => {
                    console.log(code)
                })
            },
            disable(item) {
                return item.rule_type === 1 && this.autoAction === 1;
            },
            init() {
                this.$http(api_rule_items).then(res => {
                    this.rules = res;
                });
                /** 增加一个分配发货仓库初始时就调用数据,等到v-if时才渲染出来. */
                this.shipping_remote({warehouse_id: [2]});
            },
            clear() {
                this.selected = [];
                this.name = '';
                this.platform = 0;
                this.autoAction = 1;
                this.autoContent = '';
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
                this.btime =  '';
                this.etime =  '';
            },
            init_config(code) {
                if (!this.configs[code]) {
                    this.$http(api_get_resource, {code: code}).then(res => {
                        // configs为当前弹框点击过的取回的对应数据。                  
                        this.$set(this.configs, code, res);
                    })
                }
            },
            auto_action(actions) {
                this.autoActions = actions;
            },
            click_item(item) {
                if (this.disable(item)) {
                    return
                }
                /**做一个标记，如果是订单来源为，或是code为source时不显示搜索框。 */
                if (item.code === 'source') {
                    this.searchFlag = false;                    
                } else {
                    this.searchFlag = true;
                }
                this.showContext = true;
                this.panelWith = item;
                let result = this.get_item(item.code);                
                if (!result) {
                    // selected 代表已选择
                    this.selected.push({
                        name: item.name,
                        id: item.id,
                        election: item.election,
                        code: item.code,
                        status: false,
                        data: {child: {}}
                    });
                }
            },
            item_context(item) {
                let node = this.selected.find(row => row.code === item.code);
                if (!node) {
                    return '';
                }
                //  为仓库时 请求接口
                if (node && node.code === "warehouse") {
                    let warehouse = [];
                    for (let attr in node.data.child) {
                        if (node.data.child.hasOwnProperty(attr)) {
                            node.data.child[attr].value && warehouse.push(attr);
                        }
                    }
                    if (warehouse.length !== this.warehouse.length) {
                        this.warehouse = warehouse;
                        this.shipping_remote({warehouse_id: warehouse})
                    } else {
                        if (warehouse.length !== 0) {
                            const houseFlag = !warehouse.find((row, index) => {
                                return row !== this.warehouse[index]
                            });
                            if (!houseFlag) {
                                this.warehouse = warehouse;
                                this.shipping_remote({warehouse_id: warehouse});
                            }
                        }
                    }
                }
                let strs = [];
                if (this.configs[node.code]) {
                    strs = this.calc_item_context(this.configs[node.code].type, this.configs[node.code].data, node.data.child);
                }
                node.status = !!strs.length;
                return strs.join(', ');
            },
            subItemStatus(item) {
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            get_item(value) {
                return this.selected.find(row => row.code === value);
            },
            get_rule_item(id) {
                for (let i = 0; i < this.rules.length; i++) {
                    let childs = this.rules[i].child;
                    for (let j = 0; j < childs.length; j++) {
                        if (childs[j].id === id) {
                            return childs[j];
                        }
                    }
                }
            },
            change(item) {
                let result = this.get_item(item.code);
                if (result) {
                    let index = this.selected.indexOfFun(row => row.code === item.code);
//                    result.status = !result.status;
                    this.selected.splice(index, 1, result);
                } else {
                    this.selected.push({
                        name: item.name,
                        id: item.id,
                        election: item.election,
                        code: item.code,
                        status: true,
                        data: {child: {}}
                    });
                }
            },
            get_channel_name(channelId){
                const find = this.platforms.find(row =>row.value === channelId);
                if(find){
                    return find.label;
                }else{
                    return '';
                }
            },
            submit() {
                let selected = this.selected.filter(row => row.status);
                let valid = this.validators(selected);
                if (valid.length) {
                    let str = valid.map(row => row.name).join(',');
                    this.$reqKey('orderRuleDialog', false);
                    return this.$message({type: "info", message: `${str}不符合实际业务条件，请检查！`});
                }
                selected = selected.map(row => {
                    let rowgetdata = (data) => {
                        let ret = [];
                        for (let item in data) {
                            if (data.hasOwnProperty(item) && data[item].value) {
                                ret.push({
                                    operator: data[item].operator.sel || data[item].operator || "",
                                    key: item,
                                    value: data[item].value,
                                    other: '',
                                    group: data[item].group,
                                    child: rowgetdata(data[item].child),
                                    election:data[item].election ? 1 : 0
                                });
                            }
                        }
                        return ret;
                    };
                    let value = rowgetdata(row.data.child);
                    return {
                        item_id: row.id,
                        item_source: row.code,
                        item_value: value
                    }
                });
                let params = {
                    action_type: this.autoAction,
                    name: this.name,
                    action_value: this.autoContent,
                    channel_id: this.platform,
                    status: this.isSetup ? 0 : 1,
                    rules: selected,
                    reconfirm: this.accountFlag ? 1 : 0
                };
                this.accountFlag = false;
                if (this.btime) {
                    params.start_time = parseInt(new Date(this.btime).getTime() / 1000);
                }
                if (this.etime) {
                    params.end_time = parseInt(new Date(this.etime).getTime() / 1000);
                }
                if(!this.isDefaultShow){
                    this.$set(params,'is_default',1);
                    delete params.action_type;
                    delete params.name;
                    delete params.action_value;

                }
                if (this.mdfid > 0) {
                    this.$http(api_update, this.mdfid, params).then(res => {
                        params.channel = this.get_channel_name(this.channel_id);
                        this.$message({type: "success", message: res.message || res});
                        this.show = false;
                        this.$emit('modify', res.data, params);
                        this.clear();
                    }).catch(code => {                        
                        if (code.code === 'confirm') {
                            let message = code.message || code;
                            this.$confirm(message, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.accountFlag = true;  
                                this.submit();                             
                            }).catch(() => {
                                 this.$message({
                                    type: 'info',
                                    message: '已取消保存'
                                 }); 
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });            
                        }
                    }).finally(() => {
                        setTimeout(() => {
                            // this.$emit('update:mdfid', 0);
                            this.$reqKey('orderRuleDialog', false);
                        }, 300)
                    });
                }else{
                    this.$http(api_add, params).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.show = false;
                        this.$emit('create', res.data,params);
                        this.clear();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('orderRuleDialog', false);
                        }, 300)
                    });
                }
            },
            current(item) {
                return item == this.panelWith ? 'current' : '';
            },
            auto_remote(callback) {
                return this.$http(api_getaction).then(res => {
                    let ret = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    callback(ret, []);
                });
            },
            channel_remote(callback) {
                return this.$http(api_getchannel).then(res => {
                    res = res.map(cate => {
                        return {label: cate.name, value: cate.id};
                    });
                    callback(res, [{label: '通用', value: 0}]);
                });
            },
            makesure_rule_item() {
                return new Promise((succ, fail) => {
                    let make = () => {
                        if (this.rules.length > 0) {
                            succ();
                        } else {
                            setTimeout(make, 500);
                        }
                    };
                    setTimeout(make, 0);
                })
            },
            open(){
                console.log(this.rules[0].child[0]);
                this.click_item(this.rules[0].child[0]);
                this.init();
                this.look_up();
            },
            close() {
                this.showSelect = false;
                this.showContext = false;
                this.panelStatus = 1
            },
            warehouse_remote(callback) {
                this.autoContent = '';
                this.$http(api_getwarehouse).then(res => {                    
                    res = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    callback(res);
                })
            },
            look_up(){
                if (this.mdfid) {
                    this.$http(api_lookup, this.mdfid).then(res => {
                        console.log(res,'查看');
                        while (this.selected.shift()) {}
                        this.name = res.name;
                        this.platform = res.channel_id;
                        this.autoAction = res.action_type;
                        this.autoContent = res.action_value;
                        this.isSetup = res.status === 0 ? true : false;//--0启用1停用
                        if (res.start_time) {
                            this.btime = new Date(res.start_time * 1000);
                        }
                        if (res.end_time) {
                            this.etime = new Date(res.end_time * 1000);
                        }
                        this.makesure_rule_item().then(() => {
                            res.rules.forEach(row => {
                                let item = this.get_rule_item(row.item_id);
                                this.init_config(item.code);
                                let chooses = (rows) => {
                                    let obj = {};
                                    rows.forEach(row => {
                                        row.sel = row.operator;
                                        obj[row.key] = choose(row);
                                    });
                                    return obj;
                                };
                                let choose = (row) => {
                                    row.child = chooses(row.child);
                                    return row;
                                };
                                let select = {
                                    status: true,
                                    id: row.item_id,
                                    name: item.name,
                                    code: item.code,
                                    election: item.election,
                                    data: {
                                        value: true,
                                        child: chooses(row.choose)
                                    }
                                };
                                this.selected.push(select);
                            });
                        });
                        console.log(this.selected,'hhhhhhhhdsgd');
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    })
                } else {
                    this.clear();
                }
            },
        },
        computed: {
            showRules() {
                let classifys = [];
                this.rules.forEach(classify => {
                    let classifyChild = classify.child.filter(row => {
                        // showSelect 仅显示勾选项 else or all
                        if (this.showSelect) {
                            let node = this.selected.find(old => old.code === row.code);
                            if (!node || !node.status) {
                                return false;
                            }
                            return true;
                        } else {
                            return true;
                        }
                    });                  
                    classifys.push({label: classify.label, child: classifyChild});
                });               
                return classifys;
            },
            showAutoContent() {
                return [1, 2, 4, 6].includes(this.autoAction);
            },
            autoTitle() {
                let action = this.autoActions.find(row => row.value === this.autoAction);
                if (action) {
                    return action.label + "：";
                }
                return '';
            },

            leftSpan() {
                /** 这里panelStatus 默认为 1  */
                switch (this.panelStatus) {
                    case 1:
                        return 24;
                    case 2:
                        return 12;
                    case 3:
                        return 0;
                }
            },
            rightSpan() {
                return 24 - this.leftSpan;
            },
            ruleData: {
                // 得到当前选中rule title的规则。 点击初始进行是 {child: {}}
                get() {
                    try {
                        let item = this.get_item(this.ruleCode);
                        if (item) {                                                                                                                               
                            return item.data || {};
                        } else {
                            return {};
                        }
                    } catch ($exp) {
                        return {};
                    }
                }
            },
            // 当前点击的规则code.
            ruleCode() {               
                if (this.panelWith) {
                    let code = this.panelWith.code;
                    this.init_config(code);
                    return code;
                } else {
                    return "";
                }
            },
            // 取得对应规则的数据。
            ruleConfig:{
                get(){
                    return this.configs[this.ruleCode] || {};
                },
                set(val){
                    console.log(this.ruleCode,'this.ruleCode');
                    console.log(val,'val');
                }
            },
            ruleTitle() {
                if (this.panelWith) {
                    return this.panelWith.statement;
                } else {
                    return "";
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
            autoAction(val) {
                switch (val) {
                    case 11:
                        let index = this.selected.indexOfFun(sel => {
                            return sel.id === 11
                        });
                        this.selected.splice(index, 1);
                        break;
                }
            },
            showContext(val) {
                if (val) {
                    this.panelStatus = 2
                } else {
                    this.panelStatus = 1
                }
            }
        },
        props: {
            value: {},
            mdfid: {},
            title: {},
            isDefaultShow:{
                type:Boolean,
                default:true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelItems: require('@/components/label-items.vue').default,
            uimuiSelect: require('@/components/uimui-select.vue').default,
            tree: require('./tree.vue').default,
            ruleCond: require('./rule-cond.vue').default,
            requestButton: require('@/global-components/request-button').default
        }
    }

</script>
