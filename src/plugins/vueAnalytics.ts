import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import router from './router';

Vue.use(VueAnalytics, {
    id: 'UA-58235044-4',
    router,
    ignoreRoutes: [
        '*', 
        '/blog/write',
        '/en',
        '/datenschutzerklaerung',
        '/impressum',
        '/cms-content-preview/container'
    ],
    autoTracking: {
        skipSamePath: true,
        screenview: true
    }
});
