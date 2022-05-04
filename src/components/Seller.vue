// 商家的横向柱状图
<template>
 <div class="com-container">
     <div class="com-chart" ref="seller_ref"></div>
      <span :class=expandClass @click="expand"></span>
 </div>
</template>

<script>
export default {
  name: 'vueSeller',
  data () {
    return {
      echartsInstance: null,
      allData: [],
      currentPage: 1,
      totalPage: 0,
      timerId: null,
      expandClass: 'iconfont icon-expand-alt'
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
  },
  mounted () {
    this.initChart()
    this.updatedChart()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval()
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    // 初始化echart实例对象
    initChart () {
      this.echartsInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      const initOption = {
        title: {
          text: '| 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '5%',
          bottom: '6%',
          // 距离包含坐标轴上的文字
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443',
              width: 60
            }
          }
        },
        series: [
          {
            name: '商家',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比下的颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.echartsInstance.setOption(initOption)
      // 对图表对象进行鼠标事件的监听
      this.echartsInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.echartsInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData (res) {
      // const { data: res } = await this.$http.get('seller')
      this.allData = res
      if (!res) {
        const { data: ret } = await this.$http.get('seller')
        this.allData = ret
      }
      // 对数据进行排序 小-大
      this.allData.sort((a, b) => a.value - b.value)
      // console.log(this.allData)
      // 计算总页码
      this.totalPage = Math.ceil(this.allData.length / 5)
      // 更新数据
      this.updatedChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图表
    updatedChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      if (this.allData) {
        const showData = this.allData.slice(start, end)
        const names = showData.map((item) => item.name)
        const values = showData.map((item) => item.value)
        const dataoption = {
          yAxis: {
            data: names
          },
          series: [
            {
              data: values
            }
          ]
        }
        this.echartsInstance.setOption(dataoption)
      }
    },
    // 动态刷新功能
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updatedChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    expand () {
      // 切换回来
      if (this.expandClass === 'iconfont icon-compress-alt') {
        this.expandClass = 'iconfont icon-expand-alt'
        this.$emit('fullpage', ['leftBottom', 'leftBottom'])
      } else {
        // 局部页面变成全屏
        this.$emit('fullpage', ['leftBottom', 'fullpage'])
        this.expandClass = 'iconfont icon-compress-alt'
      }
      setTimeout(this.screenAdapter, 50)
    }
  }
}
</script>

<style>

</style>
