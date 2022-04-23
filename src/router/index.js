import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/sellerPage.vue'
import TrendPage from '../views/trendPage.vue'
import MapPage from '../views/mapPage.vue'
import RankPage from '../views/rankPage.vue'
import HotPage from '../views/hotPage.vue'
import StockPage from '../views/stockPage.vue'
import allPage from '../views/allPage.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/sellerpage',
  component: SellerPage
},
{
  path: '/trendpage',
  component: TrendPage
},
{
  path: '/mappage',
  component: MapPage
},
{
  path: '/rankpage',
  component: RankPage
},
{
  path: '/hotpage',
  component: HotPage
},
{
  path: '/stockpage',
  component: StockPage
},
{
  path: '/',
  redirect: '/allpage'
},
{
  path: '/allpage',
  component: allPage
}

]

const router = new VueRouter({
  routes
})

export default router
