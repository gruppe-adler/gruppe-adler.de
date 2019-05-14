import Vue from 'vue';
import Router, { Route } from 'vue-router';
import ErrorVue from '@/components/Error.vue';
import Loader from '@/components/Loader.vue';

Vue.use(Router);

const AsyncCMSPage = () => ({
    component: import(
        /* webpackChunkName: "cms-page" */
        /* webpackMode: "lazy" */
        '@/views/CMSPage.vue'
    ),
    loading: Loader,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncHome = () => ({
    component: import(
        /* webpackChunkName: "home" */
        /* webpackMode: "lazy" */
        '@/views/Home.vue'
    ),
    loading: Loader,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncEindruecke = () => ({
    component: import(
        /* webpackChunkName: "Eindruecke" */
        /* webpackMode: "lazy" */
        '@/views/ueber-uns/Eindruecke.vue'
    ),
    loading: Loader,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncWriteBlogPost = () => ({
    component: import(
        /* webpackChunkName: "Eindruecke" */
        /* webpackMode: "lazy" */
        '@/views/WriteBlogpost.vue'
    ),
    loading: Loader,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const Async404 = () => ({
    component: import(
        /* webpackChunkName: "404" */
        /* webpackMode: "lazy" */
        '@/views/404.vue'
    ),
    loading: Loader,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

// @ts-ignore
export default new Router({
    mode: 'history',
    linkActiveClass: 'grad-nav--active',
    linkExactActiveClass: '',
    base: process.env.BASE_URL,
    scrollBehavior(to: Route, from: Route, savedPosition) {
        if (to.path === from.path) return;
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: '*',
            component: Async404
        },
        {
            path: '/',
            redirect: '/home/alles'
        },
        {
            path: '/home',
            redirect: '/home/alles'
        },
        {
            path: '/blog/write',
            component: AsyncWriteBlogPost
        },
        {
            path: '/home/alles',
            component: AsyncHome,
            name: 'Blog - Alles'
        },
        {
            path: '/home/tweets',
            component: AsyncHome,
            name: 'Blog - Tweets'
        },
        {
            path: '/home/allgemeines',
            component: AsyncHome,
            name: 'Blog - Allgemeines'
        },
        {
            path: '/home/events',
            component: AsyncHome,
            name: 'Blog - Events'
        },
        {
            path: '/home/modset',
            component: AsyncHome,
            name: 'Blog - Modset'
        },
        {
            path: '/ueber-uns',
            redirect: '/ueber-uns/miteinander'
        },
        {
            path: '/ueber-uns/miteinander',
            component: AsyncCMSPage,
            name: 'Über uns - Miteinander'
        },
        {
            path: '/ueber-uns/struktur',
            component: AsyncCMSPage,
            name: 'Über uns - Struktur'
        },
        {
            path: '/ueber-uns/historie',
            component: AsyncCMSPage,
            name: 'Über uns - Historie'
        },
        {
            path: '/ueber-uns/eindruecke',
            component: AsyncEindruecke,
            name: 'Über uns - Eindrücke'
        },
        {
            path: '/technik',
            redirect: '/technik/server'
        },
        {
            path: '/technik/server',
            component: AsyncCMSPage,
            name: 'Technik - Server'
        },
        {
            path: '/technik/missionsbau',
            component: AsyncCMSPage,
            name: 'Technik - Missionsbau'
        },
        {
            path: '/technik/modding',
            component: AsyncCMSPage,
            name: 'Technik - Modding'
        },
        {
            path: '/spielweise',
            redirect: '/spielweise/uebersicht'
        },
        {
            path: '/spielweise/uebersicht',
            component: AsyncCMSPage,
            name: 'Spielweise - Übersicht'
        },
        {
            path: '/spielweise/addons',
            component: AsyncCMSPage,
            name: 'Spielweise - Addons'
        },
        {
            path: '/spielweise/missionen',
            component: AsyncCMSPage,
            name: 'Spielweise - Missionen'
        },
        {
            path: '/mitspielen',
            redirect: '/mitspielen/allgemeines'
        },
        {
            path: '/mitspielen/allgemeines',
            component: AsyncCMSPage,
            name: 'Mitspielen - Allgemeines'
        },
        {
            path: '/mitspielen/checkliste',
            component: AsyncCMSPage,
            name: 'Mitspielen - Checkliste'
        },
        {
            path: '/mitspielen/kontakt',
            component: AsyncCMSPage,
            name: 'Mitspielen - Kontakt'
        },
        {
            path: '/en',
            component: AsyncCMSPage,
            name: 'English - Contact'
        },
        {
            path: '/datenschutzerklaerung',
            component: AsyncCMSPage
        },
        {
            path: '/impressum',
            component: AsyncCMSPage
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
        },
        {
            path: '/forum',
            beforeEnter(to, from, next) {
                window.location.href = 'https://forum.gruppe-adler.de';
            }
        },
        {
            path: '/wiki',
            beforeEnter(to, from, next) {
                window.location.href = 'https://wiki.gruppe-adler.de';
            }
        },
        {
            path: '/cms-content-preview/container',
            component: () => import(
                /* webpackChunkName: "content-preview" */
                '@/views/cms-content-preview/Container.vue'
            )
        }
    ]
});
