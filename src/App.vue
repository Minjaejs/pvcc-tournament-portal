<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import { useAuth } from './composables/useAuth';

const { initAuth } = useAuth();

onMounted(async () => {
  await initAuth();
});
</script>
