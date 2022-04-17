<!-- 针对 /stockpage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Stock.vue这个组件
!-->
<template>
  <div class="com-page">
    <Stock></Stock>
  </div>
</template>

<script>
import Stock from '@/components/Stock.vue'
export default {
  components: {
    Stock
  }
}
</script>

<style>

</style>
