<template>
    <div>
        <el-table
                ref="multipleTable"
                :data="tableData.list"
                element-loading-text="玩命加载中..."
                v-resize="{height:41}"
                v-loading="loading">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    label="平台"
                    prop="channel"
            ></el-table-column>
            <el-table-column label="账号简称" prop="account"></el-table-column>
            <el-table-column label="下架日期" prop="time"></el-table-column>
            <el-table-column label="销售人员" prop="shelf_name"></el-table-column>
            <el-table-column label="分类" prop="catetory"></el-table-column>
            <el-table-column label="SPU总数"   inline-template>
                <span class='operate' @click="showSPU(row)"> {{row.goodsC}}</span>
            </el-table-column>
            <el-table-column label="部门" prop="department"></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=tableData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=tableData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=count>
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible:false,
                dialogShow:this.value,
            }
        },
        methods: {
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            showSPU(row){
                this.$emit('get-spu',row);
                this.$emit('update:resSpu',row)
            }
        },
        watch:{
            value(val){
                this. dialogShow=val
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
            }
        },
        props:{
            resSpu:{},
            count:{},
            firstLoading:{
                type:Boolean,
                require:true
            },
            tableData:{
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            },
            value:{}
        },
        components:{

        }
    }
</script>

<style scoped>

</style>