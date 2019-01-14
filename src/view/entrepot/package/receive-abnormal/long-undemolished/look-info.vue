<template>
 <!-- @open="open"  数据初始化 以及初始化请求参数-->
  <!-- @change="change_dialog" -->
    <page-dialog size="full" v-model="show" :title="title" class="p-form-look"
    :close-on-click-modal="false" width="30%" left="10%">
        <div class="look-info-cell">
        <el-col :span="24"><label for="" class="label">运输方式&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.type}}</span></el-col>
        <el-col :span="24"><label for="" class="label">运单号&thinsp;:</label>&emsp;&emsp;&emsp;<span class="span">{{lookData.num}}</span></el-col><el-col :span="24"><label for="" class="label">采购单号:</label>&emsp;<span class="span">{{lookData.cnum}}</span></el-col>
        <el-col :span="24"><label for="" class="label">采购单号&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.cnum}}</span></el-col>
        <el-col :span="24"><label for="" class="label">采购员&thinsp;:</label>&emsp;&emsp;&emsp;<span class="span">{{lookData.cpeople}}</span></el-col>
        <el-col :span="24"><label for="" class="label">包裹数量&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.bnum}}</span></el-col>
        <el-col :span="24"><label for="" class="label">预接收员&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.ypeople}}</span></el-col>
        <el-col :span="24"><label for="" class="label">预接收时间&thinsp;:</label>&emsp;<span class="span">{{lookData.ytime}}</span></el-col>
        <el-col :span="24"><label for="" class="label">接收员&thinsp;:</label>&emsp;&emsp;&emsp;<span class="span">{{lookData.jpeople}}</span></el-col>
        <el-col :span="24"><label for="" class="label">接收时间&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.jtime}}</span></el-col>
        <el-col :span="24"><label for="" class="label">包裹状态&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.bzt}}</span></el-col>
        <el-col :span="24"><label for="" class="label">异常原因&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.yuanyin}}</span></el-col>
        <el-col :span="24"><label for="" class="label">创建人&thinsp;:</label>&emsp;&emsp;&emsp;<span class="span">{{lookData.crpeople}}</span></el-col>
        <el-col :span="24"><label for="" class="label">异常原因&thinsp;:</label>&emsp;&emsp;<span class="span">{{lookData.yuanyin}}</span></el-col>
        <el-col :span="24"><label for="" class="label">备注&thinsp;:</label>&emsp;&emsp;&emsp;&emsp;<span class="span">{{lookData.beizhu}}</span></el-col>
        </div>
    </page-dialog>
</template>
<script>
import pageDialog from '@/components/page-dialog.vue';
    export default {
        components: {
            pageDialog
        },
        data() {
            return {
                //这里父传子 不能写死
                title:' 查看',
                show:false
            }
        },
        props: {
            value: {},
            lookData:{
                type: Object
            }
        },
        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.$emit('input',val)
            }
        },
    }
</script>
<style lang="stylus">
    .page-dialog .dialog__body {
        color: #333 !important;
    }
</style>
<style lang="stylus">
.p-form-look {
    .look-info-cell {
        padding: 20px;
        font-weight: 700;
        .el-col {
            line-height: 24px !important;
        }
        .label {
            font-size: 16px !important;
            color: #333333 !important;
            font-weight: bold;

        }
        .span {
            font-size: 16px !important;
            font-weight: normal !important;
        }
    }
}
</style>
