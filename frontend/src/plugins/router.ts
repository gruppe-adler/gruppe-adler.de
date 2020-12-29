import Vue, { AsyncComponent } from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import ErrorVue from '@/components/Error.vue';
import LoaderVue from '@/components/Loader.vue';

const AsyncCMSPage: AsyncComponent = () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component: import(
        /* webpackChunkName: "cms-page", webpackMode: "eager" */
        '@/views/CMSPage.vue'
    ),
    loading: LoaderVue,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncEditPage: AsyncComponent = () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component: import(
        /* webpackChunkName: "admin", webpackMode: "lazy" */
        '@/views/EditPage.vue'
    ),
    loading: LoaderVue,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const AsyncHomePage: AsyncComponent = () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component: import(
        /* webpackChunkName: "home", webpackMode: "eager" */
        '@/views/Home.vue'
    ),
    loading: LoaderVue,
    error: ErrorVue,
    delay: 200,
    timeout: 10000
});

const redirects: { [from: string]: string } = {
    '/': '/home',
    '/ueber-uns': '/ueber-uns/miteinander',
    '/technik': '/technik/server',
    '/spielweise': '/spielweise/uebersicht',
    '/mitspielen': '/mitspielen/allgemeines'
};

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '*',
        component: AsyncCMSPage
    },
    {
        path: '/edit/*',
        component: AsyncEditPage
    },
    {
        path: '/home',
        component: AsyncHomePage
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

for (const [from, to] of Object.entries(redirects)) {
    routes.push({ path: from, redirect: to });
}

const router = new VueRouter({
    mode: 'history',
    scrollBehavior (to: Route, from: Route) {
        if (to.path === from.path) return;
        return { x: 0, y: 0 };
    },
    base: process.env.BASE_URL,
    routes
});

export default router;
