<template>
  <div 
    class="bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-md"
    :class="[
      player.is_captain 
        ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-sm' 
        : 'border-slate-200/90 hover:border-slate-300'
    ]"
  >
    <!-- Top Card Header -->
    <div class="p-5 space-y-4">
      <div class="flex items-start gap-3.5">
        <!-- Player Photo / Avatar -->
        <div class="relative shrink-0">
          <div 
            v-if="player.photo_url"
            class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group shadow-sm"
            @click="emit('preview-doc', { title: `${player.player_name} - Photo`, url: player.photo_url })"
            title="Click to view full photo"
          >
            <img 
              :src="player.photo_url" 
              :alt="player.player_name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl text-white">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div 
            v-else 
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cricket-100 to-emerald-200 text-cricket-800 font-extrabold flex items-center justify-center text-xl shadow-inner border border-emerald-300/40"
          >
            {{ getInitials(player.player_name) }}
          </div>

          <!-- Captain Crown/Star Badge -->
          <div 
            v-if="player.is_captain"
            class="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full p-1 shadow-md border-2 border-white"
            title="Designated Team Captain"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        <!-- Name & Roles -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h4 class="font-extrabold text-slate-900 text-base truncate">
              {{ player.player_name }}
            </h4>
            <span 
              v-if="player.is_captain"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0 uppercase tracking-wider"
            >
              Captain (C)
            </span>
          </div>

          <p class="text-xs text-slate-500 truncate mt-0.5">
            S/O {{ player.father_name || 'N/A' }}
          </p>

          <!-- Role Pill -->
          <div class="mt-2 flex items-center gap-2 flex-wrap">
            <span 
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
              :class="getRoleBadgeClass(player.role)"
            >
              <span>{{ getRoleIcon(player.role) }}</span>
              <span>{{ formatRole(player.role) }}</span>
            </span>

            <span v-if="calculateAge(player.dob)" class="text-[11px] text-slate-500 font-medium">
              Age: {{ calculateAge(player.dob) }} yrs
            </span>
          </div>
        </div>
      </div>

      <!-- Player Key Details Grid -->
      <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
        <div class="bg-slate-50/80 p-2 rounded-xl">
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CNIC / B-Form</div>
          <div class="font-mono font-semibold text-slate-700 text-xs mt-0.5">
            {{ formatCNIC(player.cnic) }}
          </div>
        </div>
        <div class="bg-slate-50/80 p-2 rounded-xl">
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address / Village</div>
          <div class="font-medium text-slate-700 text-xs mt-0.5 truncate" :title="player.address">
            {{ player.address || 'District Jhang' }}
          </div>
        </div>
      </div>

      <!-- PVCC Previous Seasons Badges -->
      <div v-if="player.seasons_played && player.seasons_played.length" class="space-y-1">
        <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PVCC Experience</div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <span 
            v-for="s in player.seasons_played" 
            :key="s"
            class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-semibold"
          >
            {{ s }}
          </span>
        </div>
      </div>

      <!-- Achievements / Special note -->
      <p v-if="player.achievements_note" class="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/50 p-2 rounded-xl italic">
        "{{ player.achievements_note }}"
      </p>

      <!-- Document Status & Lightbox Triggers -->
      <div class="pt-2 border-t border-slate-100">
        <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Attached Documents</div>
        <div class="flex items-center gap-2 flex-wrap text-xs">
          <!-- Photo -->
          <button 
            type="button" 
            v-if="player.photo_url"
            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            @click="emit('preview-doc', { title: `${player.player_name} - Passport Photo`, url: player.photo_url })"
          >
            <span>✓</span> Photo
          </button>
          <span v-else class="px-2 py-1 rounded-lg bg-slate-100 text-slate-400 text-[11px]">
            No Photo
          </span>

          <!-- CNIC Front -->
          <button 
            type="button" 
            v-if="player.cnic_front_url"
            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            @click="emit('preview-doc', { title: `${player.player_name} - CNIC Front`, url: player.cnic_front_url })"
          >
            <span>✓</span> CNIC Front
          </button>
          <span v-else class="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
            Pending CNIC Front
          </span>

          <!-- CNIC Back -->
          <button 
            type="button" 
            v-if="player.cnic_back_url"
            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            @click="emit('preview-doc', { title: `${player.player_name} - CNIC Back`, url: player.cnic_back_url })"
          >
            <span>✓</span> CNIC Back
          </button>
          <span v-else class="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
            Pending CNIC Back
          </span>
        </div>
      </div>
    </div>

    <!-- Actions Footer (Only active in DRAFT mode) -->
    <div 
      v-if="canEdit" 
      class="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2"
    >
      <button 
        type="button" 
        class="text-xs font-semibold text-slate-600 hover:text-cricket-700 inline-flex items-center gap-1.5 transition-colors"
        @click="emit('edit-player', player)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Player
      </button>

      <button 
        type="button" 
        class="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5 transition-colors"
        @click="emit('delete-player', player.id)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player, PlayerRole } from '../../types';

defineProps<{
  player: Player;
  canEdit: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit-player', player: Player): void;
  (e: 'delete-player', id: string): void;
  (e: 'preview-doc', doc: { title: string; url: string }): void;
}>();

const getInitials = (name: string) => {
  if (!name) return 'PL';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatCNIC = (cnic: string) => {
  if (!cnic) return '-----';
  const clean = cnic.replace(/\D/g, '');
  if (clean.length === 13) {
    return `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12)}`;
  }
  return cnic;
};

const calculateAge = (dob: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : null;
};

const formatRole = (role: PlayerRole) => {
  switch (role) {
    case 'batsman': return 'Batsman';
    case 'bowler': return 'Bowler';
    case 'all_rounder': return 'All-Rounder';
    case 'wicket_keeper': return 'Wicket Keeper';
    default: return role;
  }
};

const getRoleIcon = (role: PlayerRole) => {
  switch (role) {
    case 'batsman': return '🏏';
    case 'bowler': return '🎯';
    case 'all_rounder': return '⚡';
    case 'wicket_keeper': return '🧤';
    default: return '🏏';
  }
};

const getRoleBadgeClass = (role: PlayerRole) => {
  switch (role) {
    case 'batsman': return 'bg-blue-50 text-blue-700 border border-blue-200/80';
    case 'bowler': return 'bg-red-50 text-red-700 border border-red-200/80';
    case 'all_rounder': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    case 'wicket_keeper': return 'bg-purple-50 text-purple-700 border border-purple-200/80';
    default: return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};
</script>
