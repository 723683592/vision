<template>
  <div class="com-container">
    <div class="cat_name">{{catTitle}}</div>
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont icon-arrow-down"  @click='toLeft' :style="comStyle"></span>
    <span class="iconfont icon-arrow-up"  @click='toRight' :style="comStyle"></span>
  </div>
</template>

<script>
export default {
  name: 'vueHot',
  data () {
    return {
      echartsInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完主动进行屏幕的适配
    this.screenAdapter()
  },
  computed: {
    catTitle () {
      if (!this.allData) { return '' }
      return this.allData[this.currentIndex].name
    },
    comStyle () { return { fontSize: this.titleFontSize + 'px' } }
  },
  destroyed () {
  },
  methods: {
    initChart () {
      // 初始化实例对象
      this.echartsInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      // 设置配置项
      const initOption = {
        title: { text: '▎ 热销商品销售金额占比统计', left: 20, top: 20 },
        legend: {
          top: '8%'
        },
        series: [
          {
            type: 'pie'
          }]
      }
      // 向实例安装配置
      this.echartsInstance.setOption(initOption)
    },
    // 获取数据
    async getData () {
      // 从后台拿数据，解构赋值
      const { data: res } = await this.$http.get('hot')
      this.allData = res
      this.updateChart()
    },
    // 更新表格
    updateChart () {
    // 数据
      const seriseArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      // 图例数据
      const legendArr = this.allData[this.currentIndex].children.map(item => item.name)
      console.log(seriseArr)
      const updateOption = {
        legend: {
          data: legendArr
        },
        series: {
          data: seriseArr
        }
      }
      this.echartsInstance.setOption(updateOption)
    },
    // 文字大小缩放适配
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        series: {
          radius: this.titleFontSize * 4.5,
          center: ['50%', '60%'],
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: { fontSize: this.titleFontSize / 2 }
        }
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    // 通过改变currentIndex的值来改变当前的饼图
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }

  }
}
</script>

<style lang="less" scoped>

  .cat_name{ position: absolute;
               left: 80%;
               color:white;
               bottom: 20px;
               font-weight: bold;
               z-index: 10;
    }

   .icon-arrow-down{
     position:absolute;
     color:white;
     top:50%;
     transform: translate(0,-50%) rotate(90deg);
     left:10%;
     cursor: pointer;
   }
     .icon-arrow-up{
     position:absolute;
     top:50%;
     color:white;
     transform: translate(0,-50%) rotate(90deg);
     right:10%;
     cursor: pointer;
   }
</style>
