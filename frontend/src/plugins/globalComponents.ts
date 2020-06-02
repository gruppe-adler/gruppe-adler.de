import Vue from 'vue';

import ErrorVue from '@/components/Error.vue';
import LoaderVue from '@/components/Loader.vue';
import ContentVue from '@/components/Content.vue';
import ContainerVue from '@/components/Container.vue';
import MarkdownVue from '@/components/Markdown.vue';

Vue.component('Error', ErrorVue);
Vue.component('Loader', LoaderVue);
Vue.component('Content', ContentVue);
Vue.component('Container', ContainerVue);
Vue.component('Markdown', MarkdownVue);
