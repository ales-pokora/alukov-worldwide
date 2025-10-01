<template>
  <nav
    class="flex w-full fixed items-center justify-between px-6 py-4 z-70 bg-navbar-bg text-white h-22"
  >
    <div class="flex items-center gap-4 justify-between w-full">
      <NuxtLink to="/"
        ><img src="/logo.png" alt="Worldwide Logo" class="h-12"
      /></NuxtLink>

      <div class="flex">
        <VisitWebsiteCta @click="open" class="hidden md:block" />
        <HamburgerButton class="lg:hidden" />
      </div>
    </div>
  </nav>

  <teleport to="body">
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
  </teleport>
</template>

<script setup lang="ts">
import HamburgerButton from "./hamburgerButton.vue";
import VisitWebsiteCta from "./visitWebsiteCta.vue";

import { ref, onMounted, onBeforeUnmount } from "vue";

const isOpen = ref(false);

const items = ref([
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

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

// Zavření přes klávesu Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
});

// Klik mimo dialog (na backdrop)
function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
