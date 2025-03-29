<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

defineOptions({
  name: "CopyButton",
});
interface PropsType {
  text: string;
}

const props = defineProps<PropsType>();

const copied = ref(false);

function copy() {
  navigator.clipboard.writeText(props.text);
  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <button class="text-xl align-middle cursor-pointer" aria-label="Copy to clipboard" title="复制" @click="copy">
    <Icon :icon="copied ? 'iconoir:check-square' : 'iconoir:copy'" />
  </button>
</template>
