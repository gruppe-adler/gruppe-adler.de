import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './plugins/globalComponents';
import './plugins/globalDirectives';
import './plugins/smoothScroll';
import './plugins/gtag';
import router from './plugins/router';
import { SSOUser } from '@/services/sso';

Vue.config.productionTip = false;

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
