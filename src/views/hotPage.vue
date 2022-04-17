<!-- 针对 /hotpage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Hot.vue这个组件
!-->
<template>
  <div class="com-page">
    <Hot></Hot>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
export default {
  components: {
    Hot
  }
}
</script>

<style>

</style>
