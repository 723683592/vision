<template>
  <div class="com-container" @dblclick="revertMap" ref="map" >
    <div class="com-chart" ref="map_ref"></div>
    <span :class=expandClass @click="expand" ></span>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils.js'
export default {
  name: 'vueMap',
  data () {
    return {
      echartsInstance: null,
      allData: null,
      mapdata: {},
      expandClass: 'iconfont icon-expand-alt'
    }
  },
  created () {
    // 在组件创建完成后进行组件的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.echartsInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const res = await axios.get('http://localhost:8081/static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          itemStyle: {
            areaColor: '#2E72BF'
          }
        },
        legend: {
          left: 50,
          bottom: 30
        }
      }
      this.echartsInstance.setOption(initOption)
      this.echartsInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取这个省份的json数据
        if (!this.mapdata[provinceInfo.key]) {
          const ret = await axios.get('http://localhost:8081' + provinceInfo.path)
          this.mapdata[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.echartsInstance.setOption(changeOption)
      })
    },
    // 获取服务器数据
    async getData (res) {
      // const { data: res } = await this.$http.get('map')
      this.allData = res
      // console.log(this.allData)
      if (!res) {
        const { data: ret } = await this.$http.get('map')
        this.allData = ret
      }
      this.updatedChart()
    },
    // 更新图表
    updatedChart () {
      // 处理图表需要的数据
      // 图例数据
      const legendArr = this.allData.map(item => item.name)
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            // 空心涟漪动画
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          //  散点将会使用地图坐标系统
          coordinateSystem: 'geo'
        }
      })
      const dataoption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.echartsInstance.setOption(dataoption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },
    // 回到中国地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.echartsInstance.setOption(revertOption)
    },
    // 全屏缩放处理
    expand () {
      // 切换回来
      if (this.expandClass === 'iconfont icon-compress-alt') {
        this.expandClass = 'iconfont icon-expand-alt'
        this.$emit('fullpage', ['centerTop', 'centerTop'])
      } else {
        // 局部页面变成全屏
        this.$emit('fullpage', ['centerTop', 'fullpage'])
        this.expandClass = 'iconfont icon-compress-alt'
      }
      setTimeout(this.screenAdapter, 50)
    }
  }
}
</script>

<style>

</style>
