<template>
  <div class="allPage">
    <div class="title">
      <div class="titleLeft"></div>
      <div class="titleCenter">
        <h2>商家后台可视化数据</h2>
      </div>
      <div class="titleRight"></div>
    </div>
      <div class="boxs">
     <div class="left">
       <div class="leftTop"></div>
       <div class="leftBottom"></div>
     </div>
     <div class="center">
        <div class="centerTop"></div>
       <div class="centerBottom"></div>
     </div>
     <div class="right">
       <div class="rightTop"></div>
       <div class="rightBottom"></div>
     </div>

  </div>
  </div>
</template>

<script>
export default {
  name: 'vueTest'
}
</script>

<style lang='less' scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.allPage{
  height:100%;
  .title{
    height:7%;
    color:white;
    background-color: rgb(36, 4, 4);
    .titleCenter{
      height:100%;
      text-align: center;
      font-size: 20px;
    }
  }
  .boxs{
    height:93%;
    background-color:#ccc;
    .right,.left,.center{
      display: flex;
      flex-direction:column;
      float:left;
      width: 29%;
      height: 100%;
      padding:10px;
      background-color: pink;
        .leftTop,.centerTop,.rightTop{
          padding-bottom: 10px;
          background-color: #ccc;
        }
        .leftTop{
          height:60%;
        }
          .centerTop{
          height:70%;
        }
         .rightTop{
          height:54%;
        }
          .leftBottom,.centerBottom,.rightBottom{
          flex:1;
          background-color: green;
        }
    }
    .center{
      width:42%;
      background-color: skyblue;
    }
  }
}
</style>
