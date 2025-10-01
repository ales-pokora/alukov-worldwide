<template>
  <NuxtLink :to="url" class="block">
    <div
      class="flex items-center bg-sidebar-item-bg hover:bg-sidebar-item-hover-bg transition-colors"
    >
      <img :src="image" alt="Menu Icon" class="w-16 h-16 mr-4" />
      <div class="text-white">
        <h3 class="text-md font-semibold">{{ title }}</h3>
        <p class="text-sm">{{ content }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string;
  image: string;
  title: string;
  content: string;
}>();
</script>
