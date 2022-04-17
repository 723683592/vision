<!-- 针对 /mappage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Map.vue这个组件
!-->
<template>
  <div class="com-page">
    <Map></Map>
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
export default {
  components: {
    Map
  }
}
</script>

<style>

</style>
