<template>
    <Tooltip :text="tooltip">
        <div class="grad-action-button" :style="`--color: ${color}`" @click="$emit('click', $event)">
            <i class="material-icons">{{ icon }}</i>
        </div>
    </Tooltip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ActionButtonVue extends Vue {
    @Prop({ required: true }) private icon!: string;
    @Prop({ default: '#d18d1f' }) private color!: string;
    @Prop({ default: '' }) private tooltip!: string;
}
</script>

<style lang="scss" scoped>
.grad-action-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--color);
    color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color .1s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    user-select: none;

    &:hover {
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
    }
}
</style>