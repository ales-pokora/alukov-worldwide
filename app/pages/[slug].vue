<template>
  <!-- celý pohled přes výšku okna -->
  <div class="min-h-screen flex flex-col">
    <!-- horní část s obsahem -->
    <div class="container mx-auto">
      <div v-if="pending">Načítám…</div>

      <div v-else-if="error" class="py-20">
        <h1 class="text-6xl font-bold">Stránka nenalezena.</h1>
        <p>{{ error }}</p>
      </div>

      <div v-else></div>
    </div>

    <!-- SPODNÍ ČÁST: video vyplní zbytek obrazovky -->
    <div v-if="!pending && !error && page?.video" class="relative flex-1">
      <video
        :src="page.video"
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        loop
        playsinline
        preload="metadata"
        poster="/images/video-poster.jpg"
      ></video>

      <!-- volitelná tmavá vrstva pro čitelnost textu přes video
      <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  doc,
  getDoc,
  query,
  where,
  limit,
  getDocs,
  collection,
} from "firebase/firestore";

const route = useRoute();
const { $db } = useNuxtApp();
const slug = route.params.slug as string;

// Pokud máš ID dokumentu = slug, je to nejjednodušší a nejrychlejší:
const fetchById = async () => {
  const snap = await getDoc(doc($db, "pages", slug));
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
};

// Pokud máš ve storu pole `slug` nebo `to` (např. "/freiberg"):
const fetchByField = async () => {
  // zkusíme nejdřív `slug`, pak `to`
  const trySlug = await getDocs(
    query(collection($db, "pages"), where("url", "==", slug), limit(1))
  );
  if (!trySlug.empty)
    return { id: trySlug.docs[0].id, ...trySlug.docs[0].data() };

  const path = "/" + slug;
  const tryTo = await getDocs(
    query(collection($db, "pages"), where("to", "==", path), limit(1))
  );
  if (!tryTo.empty) return { id: tryTo.docs[0].id, ...tryTo.docs[0].data() };

  return null;
};

const {
  data: page,
  pending,
  error,
} = await useAsyncData(`${slug}`, async () => {
  return (
    (await fetchById()) ??
    (await fetchByField()) ??
    (() => {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    })()
  );
});
</script>
