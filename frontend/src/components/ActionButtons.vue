<template functional>
    <div class="grad-action-buttons">
        <slot />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ActionButtonsVue extends Vue {}
</script>

<style lang="scss">
.grad-action-buttons {
    position: absolute;
    top: -3.75rem;
    left: 0;
    display: flex;
    width: 100%;

    > *:not(:last-child) {
        margin-right: .5rem;
    }
}
</style>
