<template>
    <div class="c-table-data">
        <el-table
            @selection-change="handleSelectionChange"
            :highlight-current-row="false"
            class="scroll-bar"
            v-resize="{height:41}"
            :data="tableData.lists"
            v-loading="loading"
            :element-loading-text="$t('ymx-list.playLoad')"
            >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label='ID' prop="id" width="100"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.platformSku')" prop="publish_sku" width="180"></el-table-column>
            <el-table-column label='ASIN' prop="asin"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.accountName')">
                <template slot-scope="scope">
                    <span>{{scope.row.account.account_name}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.sellingPrice')" prop="price"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.qty')" prop="quantity"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.lowestPrice')" prop="lowest_price"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.autoPrice')" prop="modify_price"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.timingRule')" prop="rule_name"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.uploadStatus')">
                <template slot-scope="scope">
                    <span>{{states(scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.desc')">
                <template slot-scope="scope">
                    <el-popover
                            ref="popover1"
                            placement="left"
                            width="400"
                            trigger="hover">
                        <p style="width: 400px;word-wrap: break-word; word-break: break-all; overflow: hidden">{{scope.row.error_desc}}</p>
                    </el-popover>
                    <span v-popover:popover1 v-if="scope.row.error_desc" style="color: red">{{$t('ymx-heel-sale-list.desc')}}</span>
                    <span v-else>{{$t('ymx-heel-sale-list.status3')}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.creator')" prop="realname"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.creationTime')" prop="created_time" width="140"></el-table-column>
            <el-table-column :label="$t('ymx-heel-sale-list.updateTime')" prop="last_request_time" width="140"></el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=tableData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                multipleSelection:[]
            }
        },
        methods:{
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
            states(value){
                switch (+value){
                    case 0:
                        return this.$t('ymx-list.toBeUp');
                        break;
                    case 1:
                        return this.$t('ymx-list.uploaded');
                        break;
                    case 2:
                        return this.$t('ymx-list.upFailed')
                        break;
                    case 3:
                        return this.$t('ymx-list.uploading');
                        break;
                    case 4:
                        return this.$t('ymx-heel-sale-list.cancelBtn');
                        break;
                    default:
                        return "...";
                        break;
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit('select-msg',this.multipleSelection);
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?this.$t('ymx-heel-sale-list.waitForData'):this.$t('ymx-heel-sale-list.emptyData')
            }
        },
        props:{
            tableData:{
                type:Object,
                required:true,
            },
            loading:{
                type:Boolean,
                required:true,
            },
            firstLoading:{
                type:Boolean,
                required:true,
            }
        },
        components: {}
    }
</script>
