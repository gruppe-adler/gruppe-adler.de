import Vue from 'vue';
import VueGtag from 'vue-gtag';
import router from './router';

Vue.use(VueGtag, {
    config: { id: 'UA-58235044-4' }
}, router);
