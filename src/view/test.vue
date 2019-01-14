<template>
    <div class="c-test">
        <span class="test">
           <i class="el-icon-close icon" @click="test" title="tteste hhsd"></i>
           124584545
        </span>
    </div>
</template>
<style lang="stylus">
    .c-test{
        span.test{
            position :relative;
            border :1px solid gainsboro
            .icon{
                position :absolute;
                right :0;
                top:0;
                font-size :12px;
                color red;
                display :none;
            }
            &:hover{
                .icon{
                    display :inline-block;
                }
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                form:{
                    company:'',
                    info:''
                },
                siteOptions:[
                    {label:'tetest1test1test1st1',value:0},
                    {label:'test1test1test1test1',value:1},
                    {label:'test1test1test1test1test1',value:2},
                    {label:'test1test1test1test1',value:3},
                    {label:'test1test1test1',value:4},
                    {label:'test1test1test1test1test1',value:5},
                    {label:'test1test1test1test1test1test1',value:6}
                ]
            }
        },
        methods:{
            test(){
                console.log(54555);
            }
        }

    }
</script>
