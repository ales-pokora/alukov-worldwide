<template>
  <div class="md:hidden">
    <!-- Mobile sidebar  -->
    <Transition name="slide-down">
      <div v-if="isOpen" side="top" class="h-screen flex bg-sidebar-bg">
        <div class="py-6 w-full bg-blue h-full flex flex-col">
          <div class="my-4 flex justify-center">
            <visitWebsiteCta class="md:hidden" />
          </div>
          <SidebarMenuItem
            @click="close"
            v-for="item in items"
            :key="item.to"
            v-bind="item"
          />
        </div>
      </div>
    </Transition>
  </div>
  <!-- Desktop sidebar -->
  <aside
    class="hidden md:flex flex-col w-74 mt-22 bg-sidebar-bg border-r h-screen fixed overflow-scroll top-0 left-0 z-10"
  >
    <SidebarMenuItem v-for="item in items" :key="item.url" v-bind="item" />
  </aside>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const items = ref<any[]>([]);
const { isOpen } = useSidebar();

function close() {
  isOpen.value = false;
}

onBeforeMount(async () => {
  const { $db } = useNuxtApp();

  const q = query(collection($db, "pages"));
  const snap = await getDocs(q);
  items.value = snap.docs.map((d) => d.data());
});
</script>

<style>
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
