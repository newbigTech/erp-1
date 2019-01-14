<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="po缺失" name="1" >
                <!-- <place-tab ref="po-defect" v-if="activeName === '1'"></place-tab> -->
                <po-defect v-if="activeName === '1'"></po-defect>
            </el-tab-pane>
            <el-tab-pane label="未拆异常" name="2">
                <!-- <package-tab ref="package-abnormal" v-if="activeName === '2'"></package-tab> -->
                <long-undemolished v-if="activeName === '2'"></long-undemolished>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<script>
import poDefect from '@/view/entrepot/package/receive-abnormal/po-defect/index.vue';
import longUndemolished from '@/view/entrepot/package/receive-abnormal/long-undemolished/index.vue';
export default {
    data () {
        return {
            activeName: '1',
        }
    },
    methods: {
        handleClick() {
            switch (this.activeName) {
                case '1':
                    break;
            }
        },
    },
    components: {
        poDefect,
        longUndemolished
    }
}
</script>

<style lang="stylus"></style>
