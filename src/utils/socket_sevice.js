export default class SocketService {
  // 不管是谁调用了get Instance 这个方法都会返回同一个实例对象
  // 单例模式
  static instance = null
  // getter 下面的这个函数会自动调用 给instance赋值
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  //  实例属性
  ws = null
  callBackMapping = {}
  connected = false
  sendRetryCount = 0
  connectRetryCount=0
  // 初始化连接websocket
  connect () {
    if (!window.WebSocket) {
      return console.log('啧啧啧,您的浏览器不支持 WebSocket!')
    }
    this.ws = new WebSocket('ws://localhost:9998')
    this.ws.onopen = () => {
      console.log('WebSocket 连接成功')
      this.connected = true
    }
    this.ws.onclose = e => {
      console.log('服务器关闭了连接')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        // 断开重连机制
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    // 得到服务端发送过来的数据
    this.ws.onmessage = (msg) => {
      console.log('WebSocket 接收到数据')
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          // 分开来看this.callBackMapping[socketType] 是一个函数   call改变this指向
          this.callBackMapping[socketType].call(this, realData)
        }
      }
    }
  }

  // 业务类型和回调函数的对关系
  registerCallBack (socketType, callBack) {
    // 往 callBackMap中存放回调函数
    this.callBackMapping[socketType] = callBack
  }

  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    // console.log('发送数据给服务器:')
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        this.sendRetryCount++
        this.send(data)
      }, 200 * this.sendRetryCount) // 发送数据尝试的次数越大, 则下一次连接的 延迟也就越长 } }
    }
  }
}
