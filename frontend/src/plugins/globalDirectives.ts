import Vue from 'vue';
import lozad from 'lozad';

Vue.directive('lazy-img', {
    inserted (el) {
        const observer = lozad(el);
        window.requestAnimationFrame(() => {
            observer.observe();
        });
    }
});
