import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Quiz from './components/Quiz.vue'
import Index from './components/Index.vue'

Vue.use(VueRouter);
Vue.config.productionTip = false

const routes = [
  {path: '/quiz', component: Quiz},
  {path: '/', component: Index}
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
