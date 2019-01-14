<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="requestButton"
                        req-key="api_process_status"
                        @click="make_handle"
                        :disabled="handleSelect.length === 0"
                        type="primary"
                        size="mini"
                        :route="apis.url_process_status">
                标记为已处理
            </permission>
        </div>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
           <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="处理状态" min-width="55" inline-template>
            <div>
                {{row.ctype}}
            </div>
        </el-table-column>
            <el-table-column label="运输方式" min-width="55" inline-template>
                <div>
                    {{row.ytype}}
                </div>
            </el-table-column>
            <el-table-column label="运单号" min-width="100" inline-template>
                <div>
                    {{row.yorder}}
                    <!--<span v-for="(item,index) in row.purchase_order_ids"-->
                          <!--class="operate"-->
                          <!--@click="init_list(item)"-->
                          <!--:key="item">{{`PO${item}${index === row.purchase_order_ids.length -1 ? '' : ','}`}}</span>-->
                </div>
            </el-table-column>
            <el-table-column label="采购单号" min-width="50" inline-template>
                <div>{{row.corder}}</div>
            </el-table-column>
            <el-table-column label="预接收时间" min-width="50" inline-template>
                <div>{{row.ytime}}</div>
            </el-table-column>
            <el-table-column label="接收时间" min-width="50" inline-template>
                <div>{{row.jtime}}</div>
            </el-table-column>
            <el-table-column label="包裹状态" min-width="50" inline-template>
                <div>{{row.btype}}</div>
            </el-table-column>
            <el-table-column label="异常类型" min-width="50" inline-template>
                <div>{{row.abnormaltype}}</div>
            </el-table-column>
            <el-table-column label="创建人" min-width="50" inline-template>
                <div>{{row.crpeople}}</div>
            </el-table-column>
            <el-table-column label="仓库处理人" min-width="50" inline-template>
                <div>{{row.warehouse}}</div>
            </el-table-column>
            <el-table-column label="采购确认人" min-width="50" inline-template>
                <div>{{row.cpeople}}</div>
            </el-table-column>
            <el-table-column label="审批人1" min-width="50" inline-template>
                <div>{{row.approvalone}}</div>
            </el-table-column>
            <el-table-column label="审批人2" min-width="50" inline-template>
                <div>{{row.approvaltwo}}</div>
            </el-table-column>
            <el-table-column label="创建时间" min-width="50" inline-template>
                <div>{{row.createTime}}</div>
            </el-table-column>
            <el-table-column label="处理时间" min-width="50" inline-template>
                <div>{{row.createTime}}</div>
            </el-table-column>
            <el-table-column label="确认时间" min-width="50" inline-template>
                <div>{{row.createTime}}</div>
            </el-table-column>
            <el-table-column label="审批时间1" min-width="50" inline-template>
                <div>{{row.createTime}}</div>
            </el-table-column>
            <el-table-column label="审批时间2" min-width="50" inline-template>
                <div>{{row.createTime}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="60" inline-template>
                 <div>
                    <el-button @click.native = "showLook">查看</el-button>
                    <el-button @click.native = "showLose()">确认数量</el-button>
                    <el-button @click.native = "showLose">审批</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <!-- <abnormal-handle v-model="markHandleVisible"
                         @search="$listeners['search']"
                         :abnormal-info="abnormalInfo"></abnormal-handle> -->
        <img-upload v-model="imgVisible"
                    :limit="2" sure-text="上传"
                    :image-info="imageInfo"
                    @upload="upload_img_sure"
                    :need-add="needAdd">
        </img-upload>
        <look-info v-model="lookDialog" :lookData='lookData'></look-info>
        <lose-num v-model="loseDialog" :loseData="loseData"></lose-num>            
    </div>
</template>

<style lang="stylus">
</style>

<script>
import lookInfo from '@/view/entrepot/package/receive-abnormal/long-undemolished/look-info.vue'
    import loseNum from '@/view/entrepot/package/receive-abnormal/long-undemolished/lose-num.vue'
    import {
        url_reply_letter,
        api_process_status,
        // api_abnormal_certificate,
        url_process_status} from "@/api/ready-receive";

    export default {
        permission: {
            url_reply_letter,
            url_process_status
        },
        data() {
            return {
                selectedData: [],
                markHandleVisible: false,
                abnormalInfo: {},
                image: {},
                imgVisible: false,
                needAdd: true,//是否为提交凭证
                imageInfo: {
                    title: '',
                    images: [],
                },
                curParams: {},
                lookDialog: false,
                 loseDialog:false,
                 isEdit:false,
                 lookData: {
                    type: '01020304',
                    num: '01020304',
                    cnum: '01020304',
                     cpeople:'李摸摸',
                     bnum: '01020304',
                     ypeople: 'viurs',
                     ytime:'2018-11-10 08:10',
                     jpeople:'xxx',
                     jtime:'2018-11-10 08:10',
                     bzt:'异常',
                    yuanyin: '未知',
                     crpeople:'555',
                    beizhu: '中山仓转移到金华仓'
                 },
                 loseData:{
                    title:'确认丢失数量',
                    address:'中山仓',
                    cnum:'1245456',
                    ynum:'454545',
                    cpeople:'viurs',
                    tables:[{
                        pic:'',
                        sku:'t78787',
                        name:'黑色macbookpro',
                        cnum:10,
                        rnum: 5,
                        losenum: 5,
                        differencenum:5,
                        show:false
                    }]
                 }
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
             showLook() {
                this.lookDialog = true;
            },
            showLose(){
                this.loseDialog = true;
            },
            batch_select(val) {
                this.selectedData = val;
            },
            reply(row) {
                let {tracking_number, is_use_text, abnormal_type, abnormal_content, id, propose_user_id} = row;
                this.abnormalInfo = {
                    tracking_number,
                    is_use_text,
                    abnormal_content,
                    abnormal_id: id,
                    abnormal_type: abnormal_type,
                    recipient: propose_user_id
                };
                abnormal_type === 0 && (this.$set(this.abnormalInfo,'purchase_order_ids', [{id: ''}]));
                this.markHandleVisible = true;
            },
            //上传凭证
            upload_img(row) {
                this.imageInfo = {
                    title: `提交运单号：${row.tracking_number}的凭证`,
                    images: row.certificate_files,
                };
                this.curParams = {
                    abnormal_id: row.id,
                };
                this.needAdd = true;
                this.imgVisible = true;
            },
            upload_img_sure(certificate_files) {
                let data = {
                    certificate_files: certificate_files.map(row => row.path),
                };
                Object.assign(data, this.curParams);
                this.$http(api_abnormal_certificate, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.imgVisible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            //查看凭证
            look_img(row) {
                this.imageInfo = {
                    title: `查看运单号：${row.tracking_number}的凭证`,
                    images: row.certificate_files,
                };
                this.needAdd = false;
                this.imgVisible = true;
            },
            make_handle() {
                let ids = this.handleSelect.map(row => row.id);
                this.$http(api_process_status, {ids}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_process_status', false);
                    }, 200);
                })
            }
        },
        computed: {
            handleSelect() {
                return this.selectedData.filter(row => {
                    if (row.processing_status === 0) {
                        if (row.is_use < 2) {
                            return true;
                        } else {
                            return row.processing_method !== '';
                        }
                    } else {
                        return false;
                    }
                })
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            lookInfo,
            loseNum,
            uiTip: require('@/components/ui-tip').default,
            // abnormalHandle: require('./abnormal-handle.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            imgUpload: require('@/components/img-upload.vue').default,
        }
    }
</script>
