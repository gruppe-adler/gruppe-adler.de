import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: () => import('./views/404.vue')
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/ueber-uns',
      name: 'ueber-uns',
      redirect: '/ueber-uns/miteinander'
    },
    {
      path: '/ueber-uns/miteinander',
      name: 'ueber-uns-miteinander',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/ueber-uns/struktur',
      name: 'ueber-uns-struktur',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/ueber-uns/eindruecke',
      name: 'ueber-uns-eindruecke',
      component: () => import('./views/ueber-uns/Eindruecke.vue')
    },
    {
      path: '/technik',
      name: 'technik',
      redirect: '/technik/server'
    },
    {
      path: '/technik/server',
      name: 'technik-server',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/technik/missionsbau',
      name: 'technik-missionsbau',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/technik/modding',
      name: 'technik-modding',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/spielweise',
      name: 'spielweise',
      redirect: '/spielweise/uebersicht'
    },
    {
      path: '/spielweise/uebersicht',
      name: 'spielweise-uebersicht',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/spielweise/addons',
      name: 'spielweise-addons',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/spielweise/missionen',
      name: 'spielweise-missionen',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/mitspielen',
      name: 'mitspielen',
      redirect: '/mitspielen/allgemeines'
    },
    {
      path: '/mitspielen/allgemeines',
      name: 'mitspielen-allgemeines',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/mitspielen/checkliste',
      name: 'mitspielen-checkliste',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/mitspielen/kontakt',
      name: 'mitspielen-kontakt',
      component: () => import('./views/CMSPage.vue')
    },
    {
      path: '/forum',
      name: 'forum',
      beforeEnter(to, from, next) {
        window.location.href = 'https://forum.gruppe-adler.de';
      }
    },
    {
      path: '/wiki',
      name: 'wiki',
      beforeEnter(to, from, next) {
        window.location.href = 'https://wiki.gruppe-adler.de';
      }
    }
  ]
});
