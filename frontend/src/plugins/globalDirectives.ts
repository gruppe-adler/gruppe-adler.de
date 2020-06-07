import Vue from 'vue';
import lozad from 'lozad';

Vue.directive('lazy-img', {
    inserted (el, binding) {
        const delay = binding.value === undefined ? 50 : binding.value;

        const observer = lozad(el);
        window.setTimeout(() => observer.observe(), delay);
    }
});
