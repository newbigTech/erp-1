<template>
    <div>
         <el-form-item label="地址账单：">
            <el-col :span="col11">
                <el-input
                    type="text"                  
                    v-model="editData.address_billing"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="收款证明：">
            <el-col :span="col11">
                <el-input type="text"  v-model="editData.grant_receipt"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label=""  class="mt-lg">
            <el-col :span="col11">
                <request-button req-key="sureKey" @click="sure" >审核通过</request-button>
                <el-button @click.native="close" size="mini" class="mb-sm" >审核未通过</el-button>

                <el-card
                    class="el_card_remark"
                    v-show="showRemark">
                    <div class="remark-sale-look" style="position: inherit;">
                        <label class="remark-sale-header">审核不通过的原因: </label>
                        <el-form class="remark-sale-body">
                            <el-form-item>
                                <el-input type="textarea" :maxlength="225" placeholder="请输入原因"
                                            :autosize="{ minRows: 4, maxRows: 6}"  v-model="editData.reason">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="remark-sale-footer">
                            <div class="fr mb-xs">
                                <el-button @click="submit_cancel" type="primary" size="mini">提交</el-button>
                                <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                            </div>
                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-form-item>
    </div>
</template>

<script>
export default {
    data() {
        return {
            col11: 11,
            showRemark: false
        }
    },
    methods: {
        sure() {
            if(!this.verification_data()){
                this.$reqKey('sureKey',false);
                return
            }
            this.$emit('exmine', {
                status: 3,
                name: 'result'
            });
        },        
        close() {
            this.editData.address_billing = '';
            this.editData.grant_receipt = '';
            this.showRemark = true;
        },
        /** 审核未通过. */ 
        submit_cancel() {
            this.$emit('exmine', {
                status: 4,
                name: 'baseInfo'
            });
        },
        verification_data() {
            if(this.editData.address_billing==='') {
                this.$reqKey('sureKey',false);
                this.$message({type:"warning", message:"请填写地址账单！"});
                return false
            }
            if(this.editData.grant_receipt==='') {
                this.$reqKey('sureKey',false);
                this.$message({type:"warning", message:"请填写收款证明！"});
                return false
            }
            return true
        }
    },
    props: {
        editData: {
            type: Object,
            require: true
        },
        notRegister: {
            require: true
        },
        action: {
            type: Object
        }
    }
}
</script>

<style lang="stylus">

</style>