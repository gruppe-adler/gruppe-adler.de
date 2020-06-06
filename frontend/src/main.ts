import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './plugins/globalComponents';
import './plugins/globalDirectives';
import './plugins/smoothScroll';
import router from './plugins/router';
import { SSOUser } from '@/services/sso';

Vue.config.productionTip = false;

function detectIE () {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older
        return true;
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11
        return true;
    }

    // other browser
    return false;
}

if (detectIE()) {
    const ieHint = document.getElementById('IEHint');
    if (ieHint) ieHint.style.display = '';
} else {
    const ieHint = document.getElementById('IEHint');
    if (ieHint) ieHint.remove();

    new Vue({
        router,
        render: h => h(App),
        data: (): { user: SSOUser|null } => ({
            user: null
        }),
        methods: {
            isLoggedIn (): boolean {
                return (this.user !== null);
            },
            setUser (user: SSOUser|null = null): void {
                this.user = user;
            }
        }
    }).$mount('#app');
}
