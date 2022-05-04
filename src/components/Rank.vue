<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
    <span :class=expandClass @click="expand"></span>
  </div>
</template>

<script>
export default {
  name: 'vueRank',
  data () {
    return {
      echartsInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timer: null,
      expandClass: 'iconfont icon-expand-alt'
    }
  },
  created () {
    // 在组件创建完成后进行组件的注册
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })

    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    initChart () {
      // 创建实例对象
      this.echartsInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      // 初始化配置
      const initOption = {
        title: {
          text: '| 地区销售排行',
          top: '2%',
          left: '4%'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'bar'
        },
        grid: { top: '30%', left: '5%', bottom: '5%', right: '5%', containLabel: true },
        tooltip: { show: true }
      }
      // 设置配置
      this.echartsInstance.setOption(initOption)
      this.echartsInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.echartsInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData (res) {
      // const { data: res } = await this.$http.get('rank')
      this.allData = res
      // 拿到数据之后降序排列
      if (!res) {
        const { data: ret } = await this.$http.get('rank')
        this.allData = ret
      }
      this.allData.sort((a, b) => b.value - a.value)
      this.startInterval()
      this.updateChart()
    },
    updateChart () {
      const colorArr = [['#0BA82C', '#4FF778'], ['#2E72BF', '#23E5E5'], ['#5052EE', '#AB6EE5']]
      const nameArr = this.allData.map(item => item.name)
      const valueArr = this.allData.map(item => item.value)
      const updateOption = {
        xAxis: {
          data: nameArr
        },
        dataZoom: { show: false, startValue: this.startValue, endValue: this.endValue },
        series: {
          data: valueArr,
          color: arg => {
            let targetcolorArr = colorArr[0]
            if (arg.value >= 300) {
              targetcolorArr = colorArr[0]
            } else if (arg.value <= 100) {
              targetcolorArr = colorArr[1]
            } else {
              targetcolorArr = colorArr[2]
            }
            return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: targetcolorArr[0]
            },
            {
              offset: 1,
              color: targetcolorArr[1]
            }
            ])
          }
        }
      }
      this.echartsInstance.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: { fontSize: titleFontSize }
        },
        series: {
          barWidth: titleFontSize / 3 * 2,
          itemStyle: {
            barBorderRadius: [titleFontSize, titleFontSize, 0, 0]
          }
        }
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    startInterval () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue === this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 3000)
    },
    expand () {
      // 切换回来
      if (this.expandClass === 'iconfont icon-compress-alt') {
        this.expandClass = 'iconfont icon-expand-alt'
        this.$emit('fullpage', ['centerBottom', 'centerBottom'])
      } else {
        // 局部页面变成全屏
        this.$emit('fullpage', ['centerBottom', 'fullpage'])
        this.expandClass = 'iconfont icon-compress-alt'
      }
      setTimeout(this.screenAdapter, 50)
    }
  }
}

</script>

<style>

</style>
