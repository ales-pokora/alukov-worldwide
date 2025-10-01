<template>
  <UButton
    color="gray"
    variant="ghost"
    class="relative w-10 h-10"
    @click="toggle"
    aria-label="Toggle sidebar"
  >
    <!-- Burger -->
    <Transition name="fade" mode="out-in">
      <UIcon
        v-if="!isOpen"
        name="i-heroicons-bars-3"
        class="absolute inset-0 m-auto h-6 w-6 transition-transform duration-200"
      />
      <UIcon
        v-else
        name="i-heroicons-x-mark"
        class="absolute inset-0 m-auto h-6 w-6 transition-transform duration-200"
      />
    </Transition>
  </UButton>
</template>
<script setup lang="ts">
const { isOpen, toggle } = useSidebar();
</script>
