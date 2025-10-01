<template>
  <div class="flex min-h-screen items-center justify-center mx-auto bg-blue">
    <form class="max-w-sm space-y-4" @submit.prevent="login">
      <div class="space-y-1">
        <label for="email" class="block text-sm font-medium"> Email </label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          required
          autocomplete="email"
          placeholder="např. jan@domena.cz"
          class="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
        />
      </div>

      <div class="space-y-1">
        <label for="password" class="block text-sm font-medium"> Heslo </label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-lg px-4 py-2 font-medium border"
      >
        Přihlásit se
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";

const { $auth } = useNuxtApp();
const router = useRouter();

const email = ref("");
const password = ref("");

async function login() {
  try {
    const res = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    console.log("Přihlášený user:", res.user);
    router.push("/upload-video"); // Přesměrování na domovskou stránku po přihlášení
  } catch (err: any) {
    console.error("Chyba při přihlášení:", err.message);
  }
}
</script>
