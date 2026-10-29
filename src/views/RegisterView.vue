<template>
  <div class="max-w-xl mx-auto my-10 px-4">
    <div class="card p-6 sm:p-8 space-y-6">
      
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-cricket-100 text-cricket-700 flex items-center justify-center mx-auto mb-2">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Register Your Tournament Team</h2>
        <p class="text-xs text-slate-500">
          To manage your team, save players one by one, and upload payment proof, please start by setting up your Captain Account.
        </p>
      </div>

      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
        <div class="font-bold text-slate-800">What you will need:</div>
        <ul class="list-disc list-inside space-y-1">
          <li>Team Name & Home District / Village</li>
          <li>11 to 15 Player details (Name, CNIC, DOB, Playing Role)</li>
          <li>Photo + CNIC Front & Back for each player</li>
          <li>EasyPaisa / JazzCash / Bank payment transaction slip (Rs. 10,000)</li>
        </ul>
      </div>

      <div class="pt-2">
        <router-link to="/login" class="w-full btn-primary !py-3">
          Continue to Team Registration →
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { isAuthenticated } = useAuth();

onMounted(() => {
  if (isAuthenticated.value) {
    router.replace('/my-team');
  }
});
</script>
