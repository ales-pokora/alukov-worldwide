<template>
  <!-- Fullscreen stránka -->
  <div class="min-h-screen relative">
    <!-- Video přes celou obrazovku -->
    <template>
      <div class="min-h-screen relative">
        <video
          class="absolute inset-0 w-full h-full object-cover"
          src="/videos/video.mp4"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        >
          Tvůj prohlížeč nepodporuje přehrávání videa.
        </video>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts"></script>
