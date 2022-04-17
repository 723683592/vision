<!-- 针对 /rankpage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Seller.vue这个组件
!-->
<template>
  <div class="com-page">
    <Rank></Rank>
  </div>
</template>

<script>
import Rank from '@/components/Rank.vue'
export default {
  components: {
    Rank
  }
}
</script>

<style>

</style>
