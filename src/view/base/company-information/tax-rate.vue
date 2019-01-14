<template>
    <el-form ref="vatInfo"
             :model="form"
             label-width="135px"
             class="c-vat-info">
        <el-form-item label="Vat："
                      prop="vat">
            <el-input v-model.number="form.vat"
                      type="number"
                      :controls="false"
                      :max="100"
                      :min="0"
                      @focus="focus_(form.vat)"
                      @blur="focus_(form.vat)"
                      :validate-event="true"
                      v-if="(!flag||flag===2)&&edit">
                <template slot="append">%</template>
            </el-input>
            <span v-else>{{form.vat}}%</span>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="(flag===2||!flag)&&!edit"
                       @click.native="edit=true"
                       type="primary">编 辑
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "tax-rate",
        data(){
            return {
                disabled:false,
                edit:true
            }
        },
        methods: {
            focus_(vat){
                let type =Number(vat);
                if(vat<0){
                    this.$set(this.form,'vat',0);
                }else if(vat>100){
                    this.$set(this.form,'vat',100);
                }else if(vat>=0&&vat<=100){
                    let pow=Math.pow(10, 2);
                    this.$set(this.form,'vat',Math.round(vat*pow)/pow);
                }
            },
            submit(){
                this.disabled=true;
                this.$emit('vat');
                this.disabled=false;
            },
            restore(){
                if(!this.flag){
                    this.$set(this.form,'vat',0)
                }else {
                    this.$set(this.form,'vat',this.originalForm.vat);
                }
            }
        },
        props: {
            form:{},
            flag:{},
            originalForm:{}
        },
    }
</script>

