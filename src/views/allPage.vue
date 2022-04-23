<!-- 针对 /allpage 这条路径而显示出来的
显示六个组件的效果
!-->
<template>
 <div class="allPage">
    <div class="title">
      <img src="@/assets/img/header_border_dark.png" alt="">
      <div class="titleLeft">
        <span>Lee's market</span>
      </div>
      <div class="titleCenter">
        <h2>可视化展示 Market</h2>
      </div>
      <div class="titleRight">
        <span class="datetime">{{time}}</span>
      </div>
    </div>
      <div class="boxs">
     <div class="left">
       <div class="leftTop">
         <Trend></Trend>
       </div>
       <div class="leftBottom">
         <Seller></Seller>
       </div>
     </div>
     <div class="center">
        <div class="centerTop">
           <Map></Map>
        </div>
       <div class="centerBottom">
         <Rank></Rank>
       </div>
     </div>
     <div class="right">
       <div class="rightTop">
            <Hot></Hot>
       </div>
       <div class="rightBottom">
               <Stock></Stock>
       </div>
     </div>

  </div>
  </div>
</template>

<script>
import Trend from '@/components/Trend.vue'
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
export default {
  data: function () {
    return {
      time: new Date().toString().slice(0, 25),
      timer: null
    }
  },
  components: {
    Trend,
    Hot,
    Map,
    Rank,
    Seller,
    Stock
  },
  created () {
    this.startTimer()
  },
  destroyed () {
    clearInterval('this.timer')
  },
  methods: {
    startTimer () {
      this.timer = setInterval(() => {
        this.time = new Date().toString().slice(0, 25)
      }, 1000)
    }
  }
}
</script>

<style>

</style>
