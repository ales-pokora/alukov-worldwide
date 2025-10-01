<template>
  <div class="min-h-screen flex flex-col">
    <div class="container mx-auto">
      <div v-if="pending">Načítám…</div>

      <div v-else-if="error" class="py-20">
        <h1 class="text-6xl font-bold">Stránka nenalezena.</h1>
        <p>{{ error }}</p>
      </div>

      <div v-else></div>
    </div>

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

const fetchById = async () => {
  const snap = await getDoc(doc($db, "pages", slug));
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
};

const fetchByField = async () => {
  const trySlug = await getDocs(
    query(collection($db, "pages"), where("url", "==", slug), limit(1))
  );
  if (!trySlug.empty)
    return { id: trySlug.docs.at(0)!.id, ...trySlug.docs.at(0)!.data() };

  const path = "/" + slug;
  const tryTo = await getDocs(
    query(collection($db, "pages"), where("to", "==", path), limit(1))
  );
  if (!tryTo.empty)
    return { id: tryTo.docs.at(0)!.id, ...tryTo.docs.at(0)!.data() };

  return null;
};

const {
  data: page,
  pending,
  error,
} = await useAsyncData<any>(`${slug}`, async () => {
  return (
    (await fetchById()) ??
    (await fetchByField()) ??
    (() => {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    })()
  );
});
</script>
