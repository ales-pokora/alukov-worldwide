<template>
  <UApp>
    <div class="min-h-screen w-full">
      <!-- NAVBAR nahoře -->
      <header class="col-span-12">
        <Navbar />
      </header>

      <!-- SIDEBAR vlevo -->
      <div class="h-full w-full">
        <Sidebar />

        <!-- HLAVNÍ OBSAH vpravo -->
        <main
          v-if="!isOpen"
          class="flex flex-col lg:ml-74 pt-22 w-auto bg-gray-100 min-h-screen"
        >
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>

<!-- <template>
  <UApp>
    <div class="flex flex-col min-h-screen font-display">
      <Navbar />
      <Sidebar />
      <main class="bg-gray-100 flex-1 md:ml-74">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template> -->
<script setup>
import Navbar from "./components/navbar.vue";
import Sidebar from "./components/sidebar.vue";

const { isOpen } = useSidebar();
</script>
