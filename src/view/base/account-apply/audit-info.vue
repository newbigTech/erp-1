<template>
        <el-form :model="form" ref="auditForm"
                 label-width="100px">
            <el-form-item label="地址账单："
                          prop="address_billing">
                <el-col :span="15">
                    <span v-if="flag===1&&!isEdit">{{form.address_billing}}</span>
                    <el-input v-else
                              v-model.trim="form.address_billing"
                              :disabled="form.status===4||form.status>5"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="收款证明："
                          prop="grant_receipt">
                <el-col :span="15">
                    <span v-if="flag===1&&!isEdit">{{form.grant_receipt}}</span>
                    <el-input v-else
                              v-model.trim="form.grant_receipt"
                              :disabled="form.status===4||form.status>5"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="">
                <div v-if="flag===1&&!isEdit">
                    <el-button type="primary" size="mini"
                               :disabled="form.status===4||form.status>5"
                               @click.native="$emit('edit')">编辑</el-button>
                </div>
                <div v-else>
                    <el-button type="primary" size="mini"
                               :disabled="form.status===4||form.status>5"
                               @click="$emit('audit-submit',3)">审核通过</el-button>
                    <el-button type="primary" size="mini"
                               :disabled="form.status===4||form.status>5"
                               @click="$emit('audit-submit',4)">审核未通过</el-button>
                    <el-button size="mini" @click="$emit('cancel')"
                               :disabled="form.status===4||form.status>5"
                               v-if="flag===1&&isEdit">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "audit-info",
        props: {
            form:{},
            flag:{},
            isEdit:{
                type:Boolean,
                default(){
                    return false;
                }
            }
        },
    }
</script>

