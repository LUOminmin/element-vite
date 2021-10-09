<template>
    <div class='flex flex-center'>
        <el-row class='errPage-container'>
            <img :src='ewizardClap' width='313' height='428' alt='Girl has dropped her ice cream.'>
        </el-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import errGif from '/@/assets/img/401.gif'
import { useLayoutStore } from '/@/store/modules/layout'
export default defineComponent({
    name: '401',
    setup() {
        const { color } = useLayoutStore().getSetting
        
        return {
            errGif: `${errGif}?${+new Date()}`,
            ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
            color
        }
    }
})
</script>

<style lang='postcss' scoped>
.errPage-container {
    padding-top: 100px;
    width: 800px;

    .pan-back-btn {
        background: #008489;
        color: #fff;
        border: none !important;
    }

    .pan-gif {
        margin: 0 auto;
        display: block;
    }

    .pan-img {
        display: block;
        margin: 0 auto;
        width: 100%;
    }

    .text-jumbo {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
    }

    .list-unstyled {
        font-size: 14px;

        li {
            padding-bottom: 5px;
        }

        a {
            color: #008489;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .bullshit__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: v-bind(color.primary);
        border-radius: 50px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
    }

    img {
        filter: brightness(95%);
    }
}
</style>