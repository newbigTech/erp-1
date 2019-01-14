<template>
    <div>
        <div class="center-table">
            <el-table
                :data="tableList"
                border
                style="width: 86%">
                <el-table-column
                prop="operator"
                label="操作人"
                width="180">
                </el-table-column>
                <el-table-column                
                    label="操作时间"
                    inline-template
                    width="180">
                    <span>{{row.create_time | filterss}}</span>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    inline-template
                    label="操作内容">
                    <p v-for="(item, index) in row.remark" :key="index">{{item}}</p>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableList: []
        }
    },
    watch: {
        "editData.tableData": {
            handler(val) {
                if (val && val.length > 0) {
                    this.tableList = val;
                }                
            },
           immediate: true
        }
    },
    filters: {
        filterss(val) {
            return datef('YYYY-MM-dd HH:mm:ss', val);
        }
    },
    props: {
        editData: {
            type: Object,
            required: true
        }
    }
}
</script>