<template>
  <button
    class="nice-button"
    :disabled="disabled"
    :class="['n-' + tier]"
    @click="$emit('click')"
  >
    <slot>BTN_NAME</slot>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
export default Vue.extend({
  props: {
    disabled: Boolean,
    tier: {
      type: String as PropType<'primary' | 'secondary'>,
      validator(val) {
        return ['primary', 'secondary'].includes(val);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.nice-button {
  font-style: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  min-width: 230px;
  height: 56px;
  border-radius: 4px;
  transition-duration: 20ms;
  &[block] {
    width: 100%;
  }
  &.n-primary {
    color: #ffffff;
    background: #1033c9;
    &:hover {
      background: #1033c9;
    }
    &:active {
      background: #00c3ff;
    }
    &:disabled {
      background: #ffffff;
      opacity: 0.5;
    }
  }
  &.n-secondary {
    color: #343840;
    font-weight: normal;
    background: #ffffff;
    border: 1px solid #dfebf5;
    &:hover {
      color: #1033c9;
      border-color: #000000;
    }
    &:active {
      color: #ffe600;
      border-color: #e2ad06;
    }
    &:disabled {
      color: #9699a0;
      background: #eff3f8;
    }
  }
}
</style>
