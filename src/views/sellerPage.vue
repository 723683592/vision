<!-- 针对 /sellerpage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Seller.vue这个组件
!-->
<template>
  <div class="com-page">
    <Seller></Seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller.vue'
export default {
  components: {
    Seller
  }
}
</script>

<style>

</style>
