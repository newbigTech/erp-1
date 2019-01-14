<template>
    <el-table border
              highlight-current-row
              :data="form.log"
              style="width: 100%;">
        <el-table-column
                width="90"
                label="操作人"
                inline-template>
            <div>
                <el-popover v-if="row.operator_id>1"
                            placement="right"
                            width="240"
                            trigger="hover"
                            :open-delay="500"
                            @show="show_change(row.operator_id)">
                    <span v-text="department"></span>
                    <span slot="reference">{{row.operator}}</span>
                </el-popover>
                <div v-else>{{row.operator}}</div>
            </div>
        </el-table-column>
        <el-table-column
                label="操作时间"
                width="150"
                inline-template>
            <div>{{row.create_time|fmsdatetime}}</div>
        </el-table-column>
        <el-table-column
                label="操作内容"
                prop="remark"
                inline-template>
            <div v-for="(content,index) in remarks(row.remark)" :key="index">
                {{content}}
            </div>
        </el-table-column>
    </el-table>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_operation_log_department} from '@/api/account-information'
    export default {
        name: "log-info",
        data(){
            return {
                department:''
            }
        },
        methods:{
            remarks(remark){
                return remark.map(row=>{
                    if(row.indexOf('【发起日期】')>-1||row.indexOf('【完成日期】')>-1){
                        row=row.replace('00:00:00','')
                    }
                    return row;
                })
            },
            show_change(id){
                this.$http(api_get_operation_log_department,id).then(res=>{
                    this.department=res.map(row=>row.name).join('');
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            }
        },
        props: {
            form:{}
        },
    }
</script>

