<template functional>
    <div class="grad-action-buttons">
        <div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ActionButtonsVue extends Vue {}
</script>

<style lang="scss">
.grad-action-buttons {
    position: relative;
    width: 100%;

    > div {
        position: absolute;
        top: -3.25rem;
        left: 0;
        display: flex;
        width: 100%;

        > *:not(:last-child) {
            margin-right: .5rem;
        }
    }
}
</style>
