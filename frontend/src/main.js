// main.js

import Vue from 'vue'
import App from './App.vue'

//import 'bootstrap/dist/css/bootstrap.min.css'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueAxios from 'vue-axios'
import axios from 'axios'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VModal from 'vue-js-modal'

// const options = { name: '_' } // customize the way you want to call it
Vue.use(VueLodash, lodash) // options is optional
Vue.use(VueAxios, axios)
Vue.use(VModal, { dialog: true })

Vue.config.productionTip = false;

import HomeComponent from './components/HomeComponent.vue';
import CreateComponent from './components/CreateComponent.vue';
import IndexComponent from './components/IndexComponent.vue';
import EditComponent from './components/EditComponent.vue';

const routes = [
  {
      name: 'home',
      path: '/',
      component: HomeComponent
  },
  {
      name: 'create',
      path: '/create',
      component: CreateComponent
  },
  {
      name: 'posts',
      path: '/posts',
      component: IndexComponent
  },
  {
      name: 'edit',
      path: '/edit/:id',
      component: EditComponent
  }
];

const router = new VueRouter({ mode: 'history', routes: routes, linkActiveClass: 'is-active'});

new Vue(Vue.util.extend({ router }, App)).$mount('#app');