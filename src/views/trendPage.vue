<!-- 针对 /trendpage 这条路径而显示出来的
在这个组件里面，通过组件注册的方式，要显示出Trend.vue这个组件
!-->
<template>
  <div class="com-page">
    <Trend></Trend>
  </div>
</template>

<script>
import Trend from '@/components/Trend.vue'
export default {
  components: {
    Trend
  }
}
</script>

<style>

</style>
