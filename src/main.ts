import Vue from 'vue';
import App from './App.vue';
import router from './plugins/router';
import './plugins/registerServiceWorker';
import './plugins/globalComponents';
import './plugins/smoothScroll';
import './plugins/vueAnalytics';

Vue.config.productionTip = false;

/* tslint:disable */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older
        return true;;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11
        return true;
    }

    // other browser
    return false;
}
/* tslint:enable */

if (detectIE()) {
    const ieHint = document.getElementById('IEHint');
    if (ieHint) ieHint.style.display = '';
} else {
    const ieHint = document.getElementById('IEHint');
    if (ieHint) ieHint.remove();

    new Vue({
        router,
        render: h => h(App),
        data: () => ({
            bearerToken: ''
        }),
        methods: {
            isLoggedIn(): boolean {
                return (this.bearerToken === '');
            },
            setToken(token: string = ''): void {
                this.bearerToken = token;
            }
        }
        }).$mount('#app');
}

