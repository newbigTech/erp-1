<template>
    <div class="c-batch-remark">
        <page-dialog :title="title" :show-required="showRequired" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <el-input v-model="notes"
                      type="textarea"
                      :autosize="{ minRows: 6, maxRows: 10}"
                      placeholder="请填写备注信息..."
                      ></el-input>
            <div slot="footer">
                <el-button type="primary"
                           size="mini"
                           @click.native="submit"
                           class="inline">确定</el-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value,
                notes:""
            }
        },
        methods:{
            open(){
                this.notes = '';
            },
            submit(){
                if(!this.notes.trim()&&this.required){
                    this.$reqKey('url_batch_remark',false);
                    return this.$message({type:"warning",message:'请先添加备注后再提交'});
                }
                this.$emit('submit',this.notes.trim(), this.api, this.action);
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('url_batch_remark',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            api:{},
            action:{},
            title:{},
            required:{
                type:Boolean,
                default(){
                    return true
                }
            },
            showRequired:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>
