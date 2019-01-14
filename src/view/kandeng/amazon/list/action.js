const has=1;
const stay=2;
const abnormal=3;
const fail=4;
import {
    api_edit_listing,
    api_publish_edit,
    api_publish_del,
    api_amazon_defeat,
    url_amazon_defeat,
    url_edit_listing,
    url_publish_del,
    url_publish_edit,
    url_amazon_logs
} from '../../../../api/amazon-publish-list';
export const operateList = function(){
    return [
        {label:this.$t('ymx-list.Inactive'),value:"1",api:url_edit_listing,action:function(row){
            if(row.fulfillment_type === 2){
                this.$message({
                    type: 'info',
                    message: this.$t('ymx-detail.FBA')
                });
                return
            }
            let parameter = {
                type:'quantity',
                data:[{
                    amazon_listing_id:row.amazon_listing_id,
                    account_id:row.account_id,
                    new_value:0,
                    old_value:row.quantity
                }]
            };
            this.$http(api_edit_listing, parameter).then(res=>{
                this.$message({
                    type: 'success',
                    message: res.message || res
                })
            }).catch(code=>{
                this.$message({
                    type:"error",
                    message:code.message || code
                })
            });

        },status:[has]},
        {label:this.$t('ymx-list.del'),value:"2",api:url_publish_del,action:function(row){
            let parameter = {
                type:'seller_status',
                data:[{
                    amazon_listing_id:row.amazon_listing_id,
                    account_id:row.account_id,
                    new_value:3,
                    old_value:row.seller_status
                }]
            };

            this.$confirm(this.$t('common.delTips'), this.$t('ymx-list.tips'), {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http(api_edit_listing, parameter).then(res=>{
                    this.$message({
                        type: 'success',
                        message: this.$t('ymx-list.isDeleted')
                    })
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('common.cancelOperate')
                });
            });

        },status:[has]},
        {label:this.$t('ymx-list.operate'),value:"3",api:url_amazon_logs,action:function(row){
            this.logVisible = true;
            this.amazon_listing_id = row.amazon_listing_id;
        },status:[has]},
        {label:this.$t('ymx-list.editDesc'),value:"4",api:url_edit_listing,action:function(row){
            this.id = row.id;
            this.account_id = row.account_id;
            this.amazon_listing_id = row.amazon_listing_id;
            this.contentVisible = true;
        },status:[has]},
        {label:this.$t('ymx-list.editImg'),value:'5',api:'',action:function(row) {
            this.changeImageDialog = true;
            if(!row.goods_id)return this.$message({type:'warning',message:'该Listing尚未关联，请先关联本地SKU！'});
            let obj = {
                baseUrl:row.base_url,
                account_id:row.account_id,
                amazon_listing_id:row.amazon_listing_id,
                goods_id:row.goods_id,
                images:[],
            };
            this.rowData = obj;
        },status:[has]}
    ];
}
export const publish_queue_action = function () {
    return [
        {label:this.$t('common.edit'),value:"1",api:url_publish_edit,action:function(row){
            let params = {
                id:row.id,
                spu: row.spu,
                goods_id: row.goods_id,
                account_id: row.account_id,
                site: row.site,
                add: false,
                curPage:'queue',//刊登记录
            };
            this.$open(`/kandeng/amazon/info`, params);
        },status:[has]},
        {label:this.$t('ymx-list.copy'),value:"2",api:url_publish_edit,action:function(row){
            let params = {
                id:row.id,
                spu: row.spu,
                goods_id: row.goods_id,
                account_id: row.account_id,
                site: row.site,
                add: false,
                curPage:'copy',//刊登记录
            };
            this.$open(`/kandeng/amazon/info`, params)
        },status:[has]},
        {label:this.$t('common.del'),value:"3",api:url_publish_del,action:function(row){
            if(row.publish_status===2||row.publish_status===1)return this.$message({type:"warning",message:this.$t('ymx-list.delTip2')});
            this.$http(api_publish_del, {id: row.id}).then(res=>{
                this.$message({
                    type: 'success',
                    message: res.message || res
                });
                let findIndex = this.tableData.findIndex(item=>{
                    return item === row;
                });
                if(findIndex !== -1){
                    this.tableData.splice(findIndex, 1);
                }
            }).catch(code=>{
                this.$message({
                    type:"error",
                    message:code.message || code
                })
            })
        },status:[has]},
        {label:this.$t('ymx-list.forcedFail'),value:"4",api:url_amazon_defeat,action:function(row){
            this.$http(api_amazon_defeat,row.id).then(res => {
                this.$message({type:'success',message:res.message});
                this.init();
            }).catch(code => {
                this.$message({type:'error',message:code.message});
            })
        },status:[has]},
    ]
};
