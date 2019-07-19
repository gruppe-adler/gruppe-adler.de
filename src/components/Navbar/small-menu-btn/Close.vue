<template>
    <div class="grad-nav__small-menu-btn" v-bind="$attrs" v-on="$listeners">
        <svg width="28" height="28" viewBox="0 0 28 28">
            <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(45,14,14)"></rect>
            <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(-45,14,14)"></rect>
        </svg>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GradSmallMenuBtnCloseVue extends Vue {}
</script>

<style scoped src="./small-menu-btn.scss" lang="scss"></style>
