<template>
  <UApp>
    <div class="flex flex-col min-h-screen">
      <!-- Top Navbar -->
      <nav class="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            @click="sidebarOpen = true"
            class="md:hidden"
            aria-label="Open sidebar"
          />
          <span class="text-2xl font-bold">Worldwide</span>
        </div>
        <div class="flex items-center gap-4">
          <UAvatar src="https://i.pravatar.cc/40" alt="User" />
        </div>
      </nav>

      <!-- Sidebar (Slideover) for mobile -->
      

      <!-- Main Content -->
      <main class="flex-1 p-8 md:ml-64">
        <slot />
      </main>
    </div>
  </UApp>
</template>

<script setup>
import { ref } from 'vue'
const sidebarOpen = ref(false)
</script>