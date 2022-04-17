<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span >{{showTitle}}</span>
      <span class="iconfont icon-arrow-down" @click="showChoice=!showChoice" :style="comStyle"></span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click='handleSelect(item.key)'>
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'vueTrend',
  data () {
    return {
      echartsInstance: null,
      allData: null,
      showChoice: false,
      choiceType: 'map',
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
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.echartsInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: '3%',
          top: '30%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        }
      }
      this.echartsInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('trend')
      this.allData = res
      this.updatedChart()
    },
    // 更新图表
    updatedChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(22, 242, 217, 0.5)',
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(22, 242, 217, 0)',
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 类目轴数据
      const timerArr = this.allData.common.month
      // 数值轴数据 series下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          // stack堆叠图，里面的值任意取，相同的值之间不交叉，相互堆叠
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map(item => item.name)
      const dataoption = {
        xAxis: {
          data: timerArr
        },
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.echartsInstance.setOption(dataoption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    handleSelect (curType) {
      this.choiceType = curType
      // 图表并不是响应式的，需要手动更新
      this.showChoice = false
      this.updatedChart()
    }
  },
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  }
}
</script>

<style lang='less' scoped>
   .title{
     position: absolute;
     left:20px;
     top:20px;
     z-index:10;
     color:white;
     .iconfont{
       margin-left:10px ;
       cursor: pointer;
     }
     .select-item:hover{
         background-color: rgb(171, 195, 220);
         color:black
     }
   }
</style>
