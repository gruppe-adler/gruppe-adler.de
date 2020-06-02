import Vue, { AsyncComponent } from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import ErrorVue from '@/components/Error.vue';
import LoaderVue from '@/components/Loader.vue';

const AsyncPage: AsyncComponent = () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    component: import(
        /* webpackChunkName: "page" */
        /* webpackMode: "lazy" */
        '@/views/Page.vue'
    ),
    loading: LoaderVue,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncEditPage: AsyncComponent = () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    component: import(
        /* webpackChunkName: "admin" */
        /* webpackMode: "lazy" */
        '@/views/EditPage.vue'
    ),
    loading: LoaderVue,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '*',
        component: AsyncPage
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/edit/*',
        component: AsyncEditPage
    },
    {
        path: '/forum',
        beforeEnter () {
            window.location.href = 'https://forum.gruppe-adler.de';
        }
    },
    {
        path: '/wiki',
        beforeEnter () {
            window.location.href = 'https://gruppe-adler.github.io/wiki.gruppe-adler.de/de/';
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'grad-nav--active',
    scrollBehavior (to: Route, from: Route) {
        if (to.path === from.path) return;
        return { x: 0, y: 0 };
    },
    base: process.env.BASE_URL,
    routes
});

export default router;
