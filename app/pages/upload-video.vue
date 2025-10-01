<template>
  <form class="max-w-3xl p-8 space-y-6" @submit.prevent="handleSubmit">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Nová podstránka</h1>
      <button
        @click="logout"
        class="text-sm text-gray-500 cursor border px-3 py-1 rounded hover:bg-gray-200"
      >
        Odhlásit se
      </button>
    </div>
    <!-- Titulek -->
    <div class="space-y-2">
      <label class="block text-sm font-medium" for="title"
        >Titulek stránky (Lokace ve formátu: Město, Země)</label
      >
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        minlength="3"
        class="w-full rounded border p-3"
        placeholder="Např. Prague, Czechia"
      />
    </div>

    <!-- Popis / obsah -->
    <div class="space-y-2">
      <label class="block text-sm font-medium" for="description"
        >Název zastřešení</label
      >
      <textarea
        id="description"
        v-model="form.description"
        rows="6"
        required
        class="w-full rounded border p-3"
        placeholder="Název zastřešení, např. Pool enclosure Olympic"
      ></textarea>
    </div>

    <!-- Meta titulek + meta popis -->
    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label class="block text-sm font-medium" for="seoTitle"
          >Meta titulek</label
        >
        <input
          id="seoTitle"
          v-model="form.seoTitle"
          type="text"
          required
          maxlength="60"
          class="w-full rounded border p-3"
          placeholder="Doporučeno do ~60 znaků"
        />
        <p class="text-xs text-gray-500 text-right">
          {{ form.seoTitle.length }}/60
        </p>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium" for="seoDescription"
          >Meta popis</label
        >
        <input
          id="seoDescription"
          v-model="form.seoDescription"
          type="text"
          required
          maxlength="160"
          class="w-full rounded border p-3"
          placeholder="Doporučeno do ~160 znaků"
        />
        <p class="text-xs text-gray-500 text-right">
          {{ form.seoDescription.length }}/160
        </p>
      </div>
    </div>

    <!-- URL (slug) -->
    <div class="space-y-2">
      <label class="block text-sm font-medium" for="url">URL podstránky</label>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 select-none">/</span>
        <input
          id="url"
          v-model="form.url"
          type="text"
          required
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          class="w-full rounded border p-3"
          placeholder="např. prague-czechia"
        />
      </div>
      <p class="text-xs text-gray-500">
        Jen malá písmena, čísla a pomlčky (např. <code>prague-czechia</code>).
      </p>
    </div>

    <!-- Thumbnail -->
    <div class="space-y-2">
      <label class="block text-sm font-medium" for="thumb"
        >Thumbnail (obrázek)</label
      >
      <input
        id="thumb"
        ref="thumbInput"
        type="file"
        accept="image/*"
        class="block w-full text-sm"
        @change="onThumbChange"
      />
      <div v-if="thumbPreview" class="mt-3">
        <img
          :src="thumbPreview"
          alt="Náhled thumbnailu"
          class="max-h-40 rounded border"
        />
      </div>
      <p class="text-xs text-gray-500">
        Ideálně 16:9, menší velikost (např. &lt; 500&nbsp;kB).
      </p>
    </div>

    <!-- Video -->
    <div class="space-y-2">
      <label class="block text-sm font-medium" for="video">Video</label>
      <input
        id="video"
        ref="videoInput"
        type="file"
        accept="video/*"
        class="block w-full text-sm"
        @change="onVideoChange"
      />
      <div v-if="videoPreview" class="mt-3">
        <video
          :src="videoPreview"
          controls
          class="w-full max-h-72 rounded border"
        ></video>
      </div>
      <p class="text-xs text-gray-500">Doporučeno MP4 (H.264 + AAC).</p>
    </div>

    <!-- Stav -->
    <div
      v-if="errorMessage"
      class="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700"
    >
      {{ successMessage }}
    </div>

    <!-- Akce -->
    <div class="flex justify-end gap-3">
      <button type="button" class="rounded border px-4 py-2" @click="resetForm">
        Zrušit
      </button>
      <button
        type="submit"
        class="rounded px-5 py-2 font-medium text-white"
        :class="
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        "
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Ukládám…" : "Vytvořit podstránku" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useMainStore } from "~/stores/main";
import { signOut } from "firebase/auth";

definePageMeta({
  middleware: ["auth-client"],
});

const store = useMainStore();
const { $auth } = useNuxtApp();

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const form = ref({
  title: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  url: "",
});

const thumbFile = ref<File | null>(null);
const videoFile = ref<File | null>(null);
const thumbPreview = ref<string | null>(null);
const videoPreview = ref<string | null>(null);

const thumbInput = ref<HTMLInputElement | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

async function logout() {
  try {
    await signOut($auth);
    console.log("Uživatel byl odhlášen");

    return navigateTo("/login");
  } catch (err: any) {
    console.error("Chyba při odhlášení:", err.message);
  }
}

watch(
  () => form.value.title,
  (val) => {
    if (!form.value.url || !SLUG_REGEX.test(form.value.url)) {
      form.value.url = slugify(val);
    }
  }
);

function onThumbChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Thumbnail musí být obrázek.";
    (e.target as HTMLInputElement).value = "";
    return;
  }
  thumbFile.value = file;
  if (thumbPreview.value) URL.revokeObjectURL(thumbPreview.value);
  thumbPreview.value = URL.createObjectURL(file);
}

function onVideoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  if (!file) return;
  if (!file.type.startsWith("video/")) {
    errorMessage.value = "Soubor videa musí být typu video.";
    (e.target as HTMLInputElement).value = "";
    return;
  }
  videoFile.value = file;
  if (videoPreview.value) URL.revokeObjectURL(videoPreview.value);
  videoPreview.value = URL.createObjectURL(file);
}

async function handleSubmit() {
  errorMessage.value = null;
  successMessage.value = null;
  try {
    if (
      !form.value.title ||
      !form.value.seoTitle ||
      !form.value.seoDescription
    ) {
      throw new Error(
        "Vyplň prosím všechna povinná pole (titulek, meta titulek, meta popis)."
      );
    }
    const slug = slugify(form.value.url);
    if (!slug) throw new Error("Neplatná URL/slug.");

    isSubmitting.value = true;

    await store.addPage({
      title: form.value.title,
      content: form.value.description,
      seoTitle: form.value.seoTitle,
      seoDescription: form.value.seoDescription,
      url: slug,
      thumbnailFile: thumbFile.value,
      videoFile: videoFile.value,
    });

    successMessage.value = "Podstránka byla vytvořena.";
    resetForm();
  } catch (err: any) {
    errorMessage.value = err?.message || "Nepodařilo se uložit stránku.";
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value = {
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    url: "",
  };
  if (thumbPreview.value) URL.revokeObjectURL(thumbPreview.value);
  if (videoPreview.value) URL.revokeObjectURL(videoPreview.value);
  thumbPreview.value = null;
  videoPreview.value = null;
  thumbFile.value = null;
  videoFile.value = null;
  if (thumbInput.value) thumbInput.value.value = "";
  if (videoInput.value) videoInput.value.value = "";
}
</script>
