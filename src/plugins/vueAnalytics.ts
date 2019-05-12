import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import router from './router';
import { Route } from 'vue-router';

Vue.use(VueAnalytics, {
    id: 'UA-58235044-4',
    router,
    autoTracking: {
        skipSamePath: true,
        screenview: true
    }
});
