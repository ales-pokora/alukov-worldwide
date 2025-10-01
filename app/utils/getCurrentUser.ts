import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Vrátí aktuálního uživatele.
 * Čeká na plugin `firebase.client.js`, kde už je app i auth inicializované.
 */
export function getCurrentUser(): Promise<User | null> {
  if (process.server) {
    // Na serveru Firebase client SDK neběží
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    // vezmi auth přímo z Nuxt pluginu
    const { $auth } = useNuxtApp();

    if ($auth.currentUser) {
      return resolve($auth.currentUser);
    }

    const unsubscribe = onAuthStateChanged($auth, (user) => {
      unsubscribe();
      resolve(user ?? null);
    });
  });
}
