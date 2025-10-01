// ~/stores/main.js
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Pomocné funkce
function slugify(input) {
  return (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function readFromFormData(fd) {
  const get = (k) => String(fd.get(k) ?? "").trim();
  const gf = (k) => (fd.get(k) instanceof File ? fd.get(k) : null);
  return {
    location: get("location"),
    title: get("title"),
    content: get("content"),
    image: get("image"),
    seoTitle: get("seoTitle"),
    seoDescription: get("seoDescription"),
    url: get("url"),
    video: get("video"),
    thumbnailFile: gf("thumbnailFile"),
    videoFile: gf("videoFile"),
  };
}

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    pages: [],
  }),

  actions: {
    /**
     * Vytvoří stránku:
     * - vezme data z objektu nebo FormData,
     * - nahraje thumbnail/video do Storage (pokud jsou),
     * - uloží metadata do Firestore,
     * - přidá do lokálního stavu a vrátí záznam.
     */
    async addPage(page) {
      const { $db, $storage } = useNuxtApp();
      if (!$db) throw new Error("Chybí Firestore instance ($db).");
      if (!$storage)
        throw new Error("Chybí Firebase Storage instance ($storage).");

      // Normalizace vstupu
      const data =
        page instanceof FormData ? readFromFormData(page) : page || {};

      const title = (data.title || "").trim();
      const seoTitle = (data.seoTitle || "").trim();
      const seoDescription = (data.seoDescription || "").trim();
      const url = slugify((data.url || "").trim());

      if (!title) throw new Error("Titulek je povinný.");
      if (!seoTitle) throw new Error("SEO titulek je povinný.");
      if (!seoDescription) throw new Error("SEO popis je povinný.");
      if (!url) throw new Error("URL/slug je povinný.");

      const basePath = `pages/${url}`;
      const ts = Date.now();

      // Uploady (pokud jsou files)
      let imageUrl = data.image || "";
      let videoUrl = data.video || "";

      if (data.thumbnailFile) {
        const thumbRef = sRef($storage, `${basePath}/thumb-${ts}`);
        await uploadBytes(thumbRef, data.thumbnailFile);
        imageUrl = await getDownloadURL(thumbRef);
      }

      if (data.videoFile) {
        const videoRef = sRef($storage, `${basePath}/video-${ts}`);
        await uploadBytes(videoRef, data.videoFile);
        videoUrl = await getDownloadURL(videoRef);
      }

      // Dokument pro Firestore (držím se tvého schématu + přidané video)
      const newPage = {
        location: (data.location || "").trim(),
        title,
        content: (data.content || "").trim(),
        image: imageUrl, // URL thumbnailu (nebo "")
        video: videoUrl || "", // URL videa (nebo "")
        seoTitle,
        seoDescription,
        url, // uložený slug
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection($db, "pages"), newPage);
      const record = { id: docRef.id, ...newPage };

      this.pages.push(record);
      return record;
    },
  },
});
