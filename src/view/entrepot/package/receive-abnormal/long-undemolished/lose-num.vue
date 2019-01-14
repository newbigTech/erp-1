<template>
 <!-- @open="open"  数据初始化 以及初始化请求参数-->
  <!-- @change="change_dialog" -->
    <page-dialog size="full" v-model="show" :title="loseData.title" class="p-form-lose"
    :close-on-click-modal="false" width="80%" left="10%">
        <div class="lose-info-cell">
          <p class="purchase-info">
              <span class="address c-red">{{loseData.address}}</span>
              <label for="" class="purchase-detail">采购单号&thinsp;:&emsp;<span>{{loseData.cnum}}</span></label>
              <label for="" class="purchase-detail">运单号&thinsp;:&emsp;<span>{{loseData.ynum}}</span></label>
              <label for="" class="purchase-detail">采购员&thinsp;:&emsp;<span>{{loseData.cpeople}}</span></label>
          </p>
          <el-table ref="multipleTable" :data="tableData3" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="图片" inline-template width="120">
                <el-popover
                            placement="right"
                            trigger="hover">
                        <img v-lazy="" width="200px" height="200px">
                        
                    </el-popover>
            </el-table-column>
            <el-table-column prop="sku" label="货号（SKU）/别名" width="120"> </el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="cnum" label="采购数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rnum" label="入库数" show-overflow-tooltip></el-table-column>
            <el-table-column   label="丢失数量" show-overflow-tooltip inline-template>
                <!--<el-input-number v-model="dnum"  size="small" ></el-input-number>-->
                <input type="number" v-model="dnum" />
            </el-table-column>
            <el-table-column prop="znum" label="找回数量" show-overflow-tooltip></el-table-column>
            <el-table-column  label="操作" inline-template >
                <!-- <request-button req-key="save_purchaser_edit" :mintime="200" :request="save" v-if="edit||dispose">保存
                </request-button> -->
               <el-button type="primary">确认</el-button>
            </el-table-column>
        </el-table>
        <div class="remarks">
           <span>备注:</span>
            <textarea name="" id="" cols="190" rows="5"></textarea>
        </div>
        <div class="button">
            <el-button type="primary">等待审批</el-button>
            <el-button type="primary">返回修改</el-button>
        </div>
        </div>
    </page-dialog>
</template>
<script>
import pageDialog from '@/components/page-dialog.vue';
import uiTable from '@/components/ui-table.vue'
import uiTip from '@/components/ui-tip.vue'
    export default {
        components: {
            pageDialog,
            uiTable,
            uiTip
        },
        data() {
            return {
                //这里父传子 不能写死
                title:' 转移仓库查看',
                show:false,
                isLoad:false,
                clickData: [],
                tableData3: [
                 {
                    pic: '无',
                    sku: 'TA0005304',
                    name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                    cnum: 10,
                    rnum: 5,
                    dnum: 5,
                    znum: 0
                 },
                    {
                        pic: '无',
                        sku: 'TA0005304',
                        name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                        cnum: 10,
                        rnum: 5,
                        dnum: 5,
                        znum: 0
                    },{
                        pic: '无',
                        sku: 'TA0005304',
                        name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                        cnum: 10,
                        rnum: 5,
                        dnum: 5,
                        znum: 0
                    },{
                        pic: '无',
                        sku: 'TA0005304',
                        name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                        cnum: 10,
                        rnum: 5,
                        dnum: 5,
                        znum: 0
                    },{
                        pic: '无',
                        sku: 'TA0005304',
                        name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                        cnum: 10,
                        rnum: 5,
                        dnum: 5,
                        znum: 0
                    },{
                        pic: '无',
                        sku: 'TA0005304',
                        name: '黑色|Black] （中山仓）手电筒报警器，个人报警器，女子防狼防盗器（白盒装，ebay不上架）',
                        cnum: 10,
                        rnum: 5,
                        dnum: 5,
                        znum: 0
                    },
                 ],
        multipleSelection: []
            }
        },
        props: {
            value: {},
            loseData:{
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
        mounted() {
             for (let i = 0; i < this.loseData.tables.length; i++) {
                this.clickData.push(false);
            }
        },
        methods: {
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
             handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
    }
</script>
<style lang="stylus">
    .lose-info-cell {
        .address {
            display: inline-block;
            font-size: 18px;
            /*color: red;*/
            padding:0 10px;
            font-weight: bold;
        }
        .purchase-detail {
            font-size: 13px;
            font-weight: bold;
            display: inline-block;
            margin-left: 20px;
            span {
                color: #080 !important;
                font-weight: normal !important;
            }
        }
        .button {
            text-align: center !important;
        }
        .remarks {
            span {
                display: inline-block;
            }
        }
    }


</style>
