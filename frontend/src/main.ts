import Vue from 'vue';
import App from './App.vue';
import './plugins/globalComponents';
import './plugins/globalDirectives';
import './plugins/gtag';
import './plugins/meta';
import router from './plugins/router';
import { AuthUser } from './services/sso';

Vue.config.productionTip = false;

const ieHint = document.getElementById('IEHint');
if (ieHint) ieHint.remove();

Vue.config.ignoredElements = ['grad-navbar'];

new Vue({
    router,
    render: h => h(App),
    data: (): { user: AuthUser|null } => ({
        user: null
    }),
    methods: {
        isLoggedIn (): boolean {
            return (this.user !== null);
        },
        setUser (user: AuthUser|null = null): void {
            this.user = user;
        }
    }
}).$mount('#app');
