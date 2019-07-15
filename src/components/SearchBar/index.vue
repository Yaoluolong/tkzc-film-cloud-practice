<template>
    <div class="bar-wapper">
        <div class="title">{{title}}</div>
        <div class="flex"></div>
        <div class="oper">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props:['title']
    }
</script>

<style scoped lang="scss">
.bar-wapper{
    display: flex;
    align-items: center;
}
.title{
    font-size: 14px;
    font-weight: bold;
}
.flex{
    flex: 1;
}
.oper{
    text-align: right;
}
</style>