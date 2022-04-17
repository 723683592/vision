<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
     <span class="iconfont icon-expand-alt" @click="$router.push('/stockpage')"></span>
  </div>
</template>

<script>
export default {
  name: 'vueStock',
  data () {
    return {
      echartsInstance: null,
      allData: null,
      currentIndex: 0,
      timer: null
    }
  },
  created () {
    // 在组件创建完成后进行组件的注册
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
    this.$socket.unRegisterCallBack('stockData')
  },
  methods: {
    initChart () {
      this.echartsInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      const initoption = {
        title: {
          text: '库存和销量分析',
          top: 20,
          left: 20
        }
      }
      this.echartsInstance.setOption(initoption)
      this.echartsInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.echartsInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData (res) {
      // const { data: res } = await this.$http.get('stock')
      this.allData = res
      if (!res) {
        const { data: ret } = await this.$http.get('stock')
        this.allData = ret
      }
      // console.log(res)
      this.startInterval()
      this.updateChart()
    },
    updateChart () {
      // 准备圆环的中心
      // 处理图表需要的数据
      // 5个圆环对应的圆心点
      const centerPointers =
          [['18%', '40%'],
            ['50%', '40%'],
            ['82%', '40%'],
            ['34%', '75%'],
            ['66%', '75%']]
      const colorArrs =
      [['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']]
      // 处理图表需要的数据
      const start = this.currentIndex * 5
      const end = this.currentIndex * 5 + 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerPointers[index],
          hoverAnimation: false, // 关闭鼠标移入到饼图时的动画效果
          labelLine: {
            show: false // 隐藏指示线
          },
          label: {
            position: 'center',
            color: colorArrs[index][0]
          },
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArrs[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: 'grey'
              }
            }
          ]
        }
      })
      const updateOption = {
        series: seriesArr
      }
      this.echartsInstance.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [titleFontSize * 2, titleFontSize * 2.3],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [titleFontSize * 2, titleFontSize * 2.3],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [titleFontSize * 2, titleFontSize * 2.3],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [titleFontSize * 2, titleFontSize * 2.3],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [titleFontSize * 2, titleFontSize * 2.3],
            label: {
              fontSize: titleFontSize / 1.5
            }
          }
        ]
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    startInterval () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 5000)
    }
  },
  watch: {
    $route: {
      immediate: true, // 一旦监听到路由的变化立即执行
      handler (to, from) {
        this.getData()
        // this.updateChart()
      }
    }
  }

}
</script>

<style>

</style>
