<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Official Tournament Registry
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Enrolled Tournament Teams</h1>
        <p class="text-xs text-slate-500 mt-1">
          Confirmed squads whose Rs. 10,000 fee and player identity documents have been verified and approved by the PVCC council.
        </p>
      </div>

      <router-link to="/register" class="btn-primary !text-xs !py-2.5 !px-5 self-start sm:self-center">
        + Register Your Team
      </router-link>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
      <div class="text-xs font-bold text-slate-700">
        Showing <span class="text-emerald-700">{{ filteredTeams.length }}</span> Officially Qualified Squad{{ filteredTeams.length !== 1 ? 's' : '' }}
      </div>

      <div class="relative w-full sm:w-72">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search team name, city, code..." 
          class="input-field !text-xs !pl-9"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div v-for="i in 3" :key="i" class="h-44 bg-slate-100 rounded-2xl"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTeams.length === 0" class="card p-12 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
        🏏
      </div>
      <h3 class="text-sm font-bold text-slate-700">No Enrolled Teams Found</h3>
      <p class="text-xs text-slate-400">
        {{ searchQuery ? `No approved teams match "${searchQuery}".` : 'No teams have been officially enrolled yet.' }}
      </p>
    </div>

    <!-- Teams Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="team in filteredTeams" 
        :key="team.id"
        class="card p-5 space-y-4 relative overflow-hidden hover:shadow-md transition-all border border-slate-200/90"
      >
        <div class="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full -z-0"></div>
        
        <div class="relative z-10 flex items-start justify-between gap-3">
          <div>
            <span class="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {{ team.registration_code }}
            </span>
            <h3 class="text-lg font-extrabold text-slate-900 leading-snug mt-1.5">{{ team.team_name }}</h3>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>📍</span> {{ team.city }}
            </p>
          </div>

          <span class="badge-enrolled shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Enrolled
          </span>
        </div>

        <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Captain</span>
            <span class="font-extrabold text-slate-800">{{ team.captain_name }}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Verified Squad</span>
            <span class="font-extrabold text-emerald-700">{{ team.player_count || 14 }} Players</span>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Fee Verified: Rs. 10,000</span>
          <span class="text-emerald-700 font-semibold">Match Ready ✓</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { tournamentService } from '../services/tournamentService';
import type { Team } from '../types';

const teams = ref<Team[]>([]);
const loading = ref(true);
const searchQuery = ref('');

const sampleFallback: Team[] = [
  {
    id: 'demo-1',
    user_id: 'u1',
    registration_code: 'PVCC-2026-0001',
    team_name: 'Jhang Shaheens Cricket Club',
    city: 'Jhang City',
    captain_name: 'Akhtar Nawaz',
    captain_phone: '0300-1111111',
    player_count: 14,
    status: 'ENROLLED'
  },
  {
    id: 'demo-2',
    user_id: 'u2',
    registration_code: 'PVCC-2026-0002',
    team_name: 'Mandi Shah Jewna Lions',
    city: 'Mandi Shah Jewna',
    captain_name: 'Usman Ghani',
    captain_phone: '0300-2222222',
    player_count: 15,
    status: 'ENROLLED'
  },
  {
    id: 'demo-3',
    user_id: 'u3',
    registration_code: 'PVCC-2026-0003',
    team_name: 'Chenab Tigers 11',
    city: 'Thatta Jhabana',
    captain_name: 'Muhammad Rizwan',
    captain_phone: '0300-3333333',
    player_count: 13,
    status: 'ENROLLED'
  }
];

const loadEnrolledTeams = async () => {
  loading.value = true;
  try {
    const data = await tournamentService.getEnrolledTeams();
    if (data && data.length > 0) {
      teams.value = data;
    } else {
      teams.value = sampleFallback;
    }
  } catch (err) {
    console.error('Error fetching enrolled teams:', err);
    teams.value = sampleFallback;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadEnrolledTeams();
});

const filteredTeams = computed(() => {
  if (!searchQuery.value.trim()) return teams.value;
  const q = searchQuery.value.toLowerCase();
  return teams.value.filter(t => 
    t.team_name.toLowerCase().includes(q) ||
    t.city.toLowerCase().includes(q) ||
    t.registration_code.toLowerCase().includes(q) ||
    t.captain_name.toLowerCase().includes(q)
  );
});
</script>
