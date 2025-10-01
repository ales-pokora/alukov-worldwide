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
    class="hidden lg:flex flex-col w-74 mt-22 bg-sidebar-bg border-r h-screen fixed overflow-scroll top-0 left-0 z-10"
  >
    <SidebarMenuItem v-for="item in items" :key="item.url" v-bind="item" />
  </aside>

  <!-- <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 grid place-items-center bg-black/50 p-6 z-50"
      @click="onBackdrop"
      aria-hidden="false"
    >
      <div
        class="w-full max-w-88 rounded-2xl bg-navbar-bg shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.stop
      >
        <ul class="max-h-[60vh] overflow-auto p-3">
          <NuxtLink
            v-for="item in items"
            :key="item.id"
            :to="item.link"
            target="_blank"
            rel="noopener"
            ><li
              class="flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-item-hover-bg cursor-pointer"
            >
              <img
                :src="item.flag"
                :alt="item.title"
                class="h-12 w-12 rounded-lg object-cover"
              />
              <span class="font-semibold text-white">{{ item.title }}</span>
            </li>
          </NuxtLink>
        </ul>

        <footer class="flex items-center justify-end gap-2 px-4 py-3">
          <button
            class="inline-flex items-center rounded-xl bg-slate-200 px-3 py-2 font-medium text-slate-900 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
            @click="close"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </teleport> -->
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const items = ref<any[]>([]);
const { isOpen } = useSidebar();

function close() {
  isOpen.value = false;
}

const flags = ref([
  {
    flag: "/images/de_100x150.gif",
    title: "Alukov DE",
    link: "https://www.alukov.de/",
    id: 2,
  },
  {
    flag: "/images/at_100x150.gif",
    title: "Alukov AT",
    link: "https://www.alukov.at/",
    id: 3,
  },
  {
    flag: "/images/ch_100x150.gif",
    title: "Alukov CH",
    link: "https://www.alukov.ch/",
    id: 4,
  },
  {
    flag: "/images/cz_100x150.gif",
    title: "Alukov CZ",
    link: "https://www.alukov.cz/",
    id: 17,
  },
  {
    flag: "/images/gb.gif",
    title: "Alukov UK",
    link: "https://www.alukov.co.uk/",
    id: 1,
  },
  {
    flag: "/images/us_100x150.gif",
    title: "Alukov US",
    link: "https://www.sunrooms-enclosures.com/",
    id: 5,
  },
  {
    flag: "/images/it_100x150.gif",
    title: "Alukov IT",
    link: "https://www.coperturepiscine.it/",
    id: 6,
  },
  {
    flag: "/images/pl_100x150.gif",
    title: "Alukov PL",
    link: "https://www.alukov.pl/",
    id: 7,
  },
  {
    flag: "/images/se_100x150.gif",
    title: "Alukov SE",
    link: "https://www.termatec.se/",
    id: 8,
  },
  {
    flag: "/images/fr_100x150.gif",
    title: "Alukov FR",
    link: "https://www.alukov.fr/",
    id: 9,
  },
  {
    flag: "/images/nz_100x150.gif",
    title: "Alukov NZ",
    link: "https://www.poolenclosures.co.nz/",
    id: 10,
  },
  {
    flag: "/images/lt_100x150.gif",
    title: "Alukov LT",
    link: "https://www.baseinu-uzdangos.lt/",
    id: 11,
  },
  {
    flag: "/images/be_100x150.gif",
    title: "Alukov BE",
    link: "https://www.axess-europe.com/",
    id: 12,
  },
  {
    flag: "/images/ro_100x150.gif",
    title: "Alukov RO",
    link: "https://www.alukov.ro/",
    id: 13,
  },
  {
    flag: "/images/hu_100x150.gif",
    title: "Alukov HU",
    link: "https://www.alukov.hu/",
    id: 14,
  },
  {
    flag: "/images/kr_100x150.gif",
    title: "Alukov KR",
    link: "https://www.alukov.co.kr/",
    id: 15,
  },
  {
    flag: "/images/hr.png",
    title: "Alukov HR",
    link: "https://www.alukov.hr/",
    id: 16,
  },
]);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
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
