<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="player-modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
      <div 
        class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200"
        @click.stop
      >
        <!-- Modal Top Header -->
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cricket-100 text-cricket-800 font-bold flex items-center justify-center text-lg shadow-sm border border-cricket-200">
              🏏
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900" id="player-modal-title">
                {{ isEdit ? 'Edit Player Record' : 'Add New Squad Player' }}
              </h3>
              <p class="text-xs text-slate-500">
                Punjab Village Cricket Council (PVCC) Official Player Registration
              </p>
            </div>
          </div>
          <button 
            type="button" 
            class="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            @click="close"
            :disabled="saving"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <!-- Alert if any error -->
          <div v-if="errorMessage" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Section 1: Basic Information -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span class="w-5 h-5 rounded-full bg-cricket-50 text-cricket-700 text-xs font-bold flex items-center justify-center">1</span>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Personal & Identity Information</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Player Full Name -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Player Full Name <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.player_name" 
                  placeholder="e.g. Babar Azam" 
                  class="input-field"
                  required
                />
              </div>

              <!-- Father's Name -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Father's Name <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.father_name" 
                  placeholder="e.g. Azam Siddique" 
                  class="input-field"
                  required
                />
              </div>

              <!-- CNIC / B-Form Number -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  CNIC / B-Form Number <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  :value="form.cnic" 
                  @input="handleCnicInput"
                  placeholder="33202-XXXXXXX-X" 
                  maxlength="15"
                  class="input-field font-mono"
                  required
                />
                <span class="text-[11px] text-slate-400 mt-0.5 block">13 digits without dashes (auto-formatted)</span>
              </div>

              <!-- Date of Birth -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-xs font-bold text-slate-700">
                    Date of Birth <span class="text-rose-500">*</span>
                  </label>
                  <span v-if="playerAge" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Age: {{ playerAge }} yrs
                  </span>
                </div>
                <input 
                  type="date" 
                  v-model="form.dob" 
                  class="input-field"
                  required
                />
              </div>
            </div>

            <!-- Village / Residential Address -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Permanent Address / Village <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                v-model="form.address" 
                placeholder="e.g. Chak 182 JB, Tehsil & District Jhang" 
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Section 2: Cricket Profile -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span class="w-5 h-5 rounded-full bg-cricket-50 text-cricket-700 text-xs font-bold flex items-center justify-center">2</span>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Cricket Profile & Role</h4>
            </div>

            <!-- Playing Role Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">
                Primary Playing Role <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  v-for="r in roles"
                  :key="r.id"
                  @click="form.role = r.id"
                  class="p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5"
                  :class="[
                    form.role === r.id 
                      ? 'border-cricket-600 bg-cricket-50/60 ring-2 ring-cricket-500/20 text-cricket-900 font-bold' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  ]"
                >
                  <span class="text-lg">{{ r.icon }}</span>
                  <span class="text-xs">{{ r.label }}</span>
                </button>
              </div>
            </div>

            <!-- Designated Captain Checkbox -->
            <div 
              class="p-3.5 rounded-2xl border transition-colors flex items-start gap-3"
              :class="[
                isCaptainLocked 
                  ? 'bg-slate-50 border-slate-200/90' 
                  : 'bg-amber-50/70 border-amber-200/80'
              ]"
            >
              <input 
                type="checkbox" 
                id="is_captain_checkbox" 
                v-model="form.is_captain"
                :disabled="isCaptainLocked"
                class="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <div class="text-xs select-none">
                <label 
                  for="is_captain_checkbox" 
                  class="font-bold flex items-center gap-2"
                  :class="isCaptainLocked ? 'text-slate-600 cursor-not-allowed' : 'text-amber-900 cursor-pointer'"
                >
                  <span>Designate as Team Captain (C)</span>
                  <span v-if="isCaptainLocked" class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    🔒 Assigned to {{ existingCaptainName || 'Another Player' }}
                  </span>
                </label>
                <p v-if="isCaptainLocked" class="text-slate-500 text-[11px] mt-1">
                  This squad already has a designated captain: <strong class="text-slate-700">{{ existingCaptainName || 'Assigned Player' }}</strong>. 
                  To change your captain, edit the current captain first to unassign them.
                </p>
                <p v-else class="text-amber-800/80 text-[11px] mt-0.5">
                  Every team must have exactly one captain. Checking this assigns captaincy to this player.
                </p>
              </div>
            </div>

            <!-- Previous PVCC Seasons Played -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                Previous PVCC Tournament Seasons Played (Optional)
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <label 
                  v-for="season in availableSeasons" 
                  :key="season"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors"
                  :class="[
                    form.seasons_played.includes(season)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  ]"
                >
                  <input 
                    type="checkbox" 
                    :value="season" 
                    v-model="form.seasons_played" 
                    class="rounded text-cricket-600 focus:ring-cricket-500 h-3.5 w-3.5"
                  />
                  <span>{{ season }}</span>
                </label>
              </div>
            </div>

            <!-- Achievements or Special Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Notable Achievements / Player Bio (Optional)
              </label>
              <textarea 
                v-model="form.achievements_note" 
                rows="2" 
                placeholder="e.g. Top run scorer in District Trophy 2025, Right-arm fast bowler."
                class="input-field text-xs resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Section 3: Document Uploads & Compression -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-cricket-50 text-cricket-700 text-xs font-bold flex items-center justify-center">3</span>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Required Documents & Verification</h4>
              </div>
              <span class="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ⚡ Auto-Compressed to ~150 KB
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <!-- 1. Player Photo -->
              <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 flex flex-col justify-between space-y-2">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-slate-800">Player Photo</span>
                    <span class="text-[10px] text-rose-500 font-bold">* Required</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Clear face photo for match ID card</p>
                </div>

                <!-- Preview or Upload Area -->
                <div class="relative group">
                  <div 
                    v-if="form.photo_url"
                    class="relative w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm"
                  >
                    <img :src="form.photo_url" alt="Player Photo" class="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      class="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-lg text-xs"
                      @click="form.photo_url = ''"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <label 
                    v-else 
                    class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-cricket-500 bg-white transition-colors p-2 text-center"
                  >
                    <svg class="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-[11px] font-bold text-cricket-700">Upload Photo</span>
                    <span class="text-[10px] text-slate-400">JPG, PNG</span>
                    <input type="file" accept="image/*" class="hidden" @change="(e) => handleFileUpload(e, 'photo')" />
                  </label>
                </div>

                <!-- Compression badge -->
                <div v-if="compressionStats.photo" class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-center font-medium">
                  {{ compressionStats.photo }}
                </div>
              </div>

              <!-- 2. CNIC Front -->
              <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 flex flex-col justify-between space-y-2">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-slate-800">CNIC Front</span>
                    <span class="text-[10px] text-rose-500 font-bold">* Required</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Identity card / B-Form front side</p>
                </div>

                <!-- Preview or Upload Area -->
                <div class="relative group">
                  <div 
                    v-if="form.cnic_front_url"
                    class="relative w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm"
                  >
                    <img :src="form.cnic_front_url" alt="CNIC Front" class="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      class="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-lg text-xs"
                      @click="form.cnic_front_url = ''"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <label 
                    v-else 
                    class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-cricket-500 bg-white transition-colors p-2 text-center"
                  >
                    <svg class="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-[11px] font-bold text-cricket-700">Upload Front</span>
                    <span class="text-[10px] text-slate-400">JPG, PNG</span>
                    <input type="file" accept="image/*" class="hidden" @change="(e) => handleFileUpload(e, 'cnic_front')" />
                  </label>
                </div>

                <!-- Compression badge -->
                <div v-if="compressionStats.cnic_front" class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-center font-medium">
                  {{ compressionStats.cnic_front }}
                </div>
              </div>

              <!-- 3. CNIC Back -->
              <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 flex flex-col justify-between space-y-2">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-slate-800">CNIC Back</span>
                    <span class="text-[10px] text-rose-500 font-bold">* Required</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Identity card reverse side</p>
                </div>

                <!-- Preview or Upload Area -->
                <div class="relative group">
                  <div 
                    v-if="form.cnic_back_url"
                    class="relative w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm"
                  >
                    <img :src="form.cnic_back_url" alt="CNIC Back" class="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      class="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-lg text-xs"
                      @click="form.cnic_back_url = ''"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <label 
                    v-else 
                    class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-cricket-500 bg-white transition-colors p-2 text-center"
                  >
                    <svg class="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-[11px] font-bold text-cricket-700">Upload Back</span>
                    <span class="text-[10px] text-slate-400">JPG, PNG</span>
                    <input type="file" accept="image/*" class="hidden" @change="(e) => handleFileUpload(e, 'cnic_back')" />
                  </label>
                </div>

                <!-- Compression badge -->
                <div v-if="compressionStats.cnic_back" class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-center font-medium">
                  {{ compressionStats.cnic_back }}
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              class="btn-secondary !text-xs !py-2.5 !px-5"
              @click="close"
              :disabled="saving"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary !text-xs !py-2.5 !px-6 inline-flex items-center gap-2"
              :disabled="saving"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ saving ? 'Saving Player Record...' : (isEdit ? 'Update Player' : 'Save & Add Player') }}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { Player, PlayerRole } from '../../types';
import { compressImageFile, formatBytes } from '../../utils/imageCompressor';
import { tournamentService } from '../../services/tournamentService';

const props = defineProps<{
  isOpen: boolean;
  teamId: string;
  playerToEdit?: Player | null;
  existingCaptainId?: string | null;
  existingCaptainName?: string | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'player-saved'): void;
}>();

const isEdit = computed(() => Boolean(props.playerToEdit));
const isCaptainLocked = computed(() => {
  if (!props.existingCaptainId) return false;
  // If editing the existing captain, allow keeping or unchecking
  if (props.playerToEdit && props.playerToEdit.id === props.existingCaptainId) {
    return false;
  }
  return true;
});
const saving = ref(false);
const errorMessage = ref('');

const availableSeasons = ['Season 1 (2023)', 'Season 2 (2024)', 'Season 3 (2025)'];

const roles: { id: PlayerRole; label: string; icon: string }[] = [
  { id: 'batsman', label: 'Batsman', icon: '🏏' },
  { id: 'bowler', label: 'Bowler', icon: '🎯' },
  { id: 'all_rounder', label: 'All-Rounder', icon: '⚡' },
  { id: 'wicket_keeper', label: 'Wicket Keeper', icon: '🧤' },
];

const compressionStats = reactive<{
  photo?: string;
  cnic_front?: string;
  cnic_back?: string;
}>({});

const form = reactive({
  player_name: '',
  father_name: '',
  cnic: '',
  dob: '',
  address: '',
  role: 'all_rounder' as PlayerRole,
  seasons_played: [] as string[],
  achievements_note: '',
  is_captain: false,
  photo_url: '',
  cnic_front_url: '',
  cnic_back_url: '',
});

const playerAge = computed(() => {
  if (!form.dob) return null;
  const birthDate = new Date(form.dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : null;
});

// Format CNIC on the fly: 33202-1234567-1
const handleCnicInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const raw = input.value.replace(/\D/g, '').slice(0, 13);
  let formatted = raw;
  if (raw.length > 5 && raw.length <= 12) {
    formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
  } else if (raw.length > 12) {
    formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
  }
  form.cnic = formatted;
  input.value = formatted;
};

// Reset or populate form when modal opens
watch(
  () => props.isOpen,
  (open) => {
    errorMessage.value = '';
    compressionStats.photo = undefined;
    compressionStats.cnic_front = undefined;
    compressionStats.cnic_back = undefined;

    if (open) {
      if (props.playerToEdit) {
        form.player_name = props.playerToEdit.player_name;
        form.father_name = props.playerToEdit.father_name || '';
        form.cnic = props.playerToEdit.cnic || '';
        form.dob = props.playerToEdit.dob || '';
        form.address = props.playerToEdit.address || '';
        form.role = props.playerToEdit.role || 'all_rounder';
        form.seasons_played = [...(props.playerToEdit.seasons_played || [])];
        form.achievements_note = props.playerToEdit.achievements_note || '';
        form.is_captain = props.playerToEdit.is_captain || false;
        form.photo_url = props.playerToEdit.photo_url || '';
        form.cnic_front_url = props.playerToEdit.cnic_front_url || '';
        form.cnic_back_url = props.playerToEdit.cnic_back_url || '';
      } else {
        // New player default
        form.player_name = '';
        form.father_name = '';
        form.cnic = '';
        form.dob = '';
        form.address = '';
        form.role = 'all_rounder';
        form.seasons_played = [];
        form.achievements_note = '';
        form.is_captain = !props.existingCaptainId; // If no captain yet, default check for convenience
        form.photo_url = '';
        form.cnic_front_url = '';
        form.cnic_back_url = '';
      }
    }
  }
);

// Client-side image upload & compression
const handleFileUpload = async (e: Event, type: 'photo' | 'cnic_front' | 'cnic_back') => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const originalFile = target.files[0];

  try {
    // 1. Auto-compress image on captain's device
    const originalSize = originalFile.size;
    const compressed = await compressImageFile(originalFile, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.75,
      targetSizeKB: 180,
    });

    const compressedSize = compressed.size;
    const ratio = Math.round((1 - compressedSize / originalSize) * 100);
    const statText = `${formatBytes(compressedSize)} (${ratio > 0 ? ratio + '% saved' : 'optimized'})`;

    if (type === 'photo') compressionStats.photo = statText;
    if (type === 'cnic_front') compressionStats.cnic_front = statText;
    if (type === 'cnic_back') compressionStats.cnic_back = statText;

    // 2. Upload to Supabase Storage
    const fileName = `${props.teamId}/${Date.now()}_${type}.jpg`;
    const uploadRes = await tournamentService.uploadDocument('player-documents', fileName, compressed);

    if (uploadRes.error) {
      errorMessage.value = `Image upload error: ${uploadRes.error}`;
      return;
    }

    if (uploadRes.path) {
      const publicUrl = await tournamentService.getSecureUrl('player-documents', uploadRes.path);
      if (type === 'photo') form.photo_url = publicUrl;
      if (type === 'cnic_front') form.cnic_front_url = publicUrl;
      if (type === 'cnic_back') form.cnic_back_url = publicUrl;
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Image processing failed.';
  } finally {
    target.value = ''; // reset file input
  }
};

const handleSubmit = async () => {
  errorMessage.value = '';

  // Validation
  if (!form.player_name.trim()) {
    errorMessage.value = 'Player full name is required.';
    return;
  }
  if (!form.father_name.trim()) {
    errorMessage.value = "Father's name is required.";
    return;
  }
  const cleanCnic = form.cnic.replace(/\D/g, '');
  if (cleanCnic.length !== 13) {
    errorMessage.value = 'CNIC / B-Form must contain exactly 13 digits (e.g. 33202-1234567-1).';
    return;
  }
  if (!form.dob) {
    errorMessage.value = 'Date of birth is required.';
    return;
  }
  if (!form.address.trim()) {
    errorMessage.value = 'Player address / village is required.';
    return;
  }

  // Captain validation
  if (form.is_captain && isCaptainLocked.value) {
    errorMessage.value = `This squad already has a designated captain (${props.existingCaptainName || 'Assigned'}). You cannot assign another captain.`;
    return;
  }

  // Required Document Uploads Validation
  if (!form.photo_url) {
    errorMessage.value = 'Player Photograph is required. Please upload a passport-style photo.';
    return;
  }
  if (!form.cnic_front_url) {
    errorMessage.value = 'CNIC Front side photo is required. Please upload the front of the CNIC / B-Form.';
    return;
  }
  if (!form.cnic_back_url) {
    errorMessage.value = 'CNIC Back side photo is required. Please upload the back of the CNIC.';
    return;
  }

  saving.value = true;
  try {
    if (props.playerToEdit) {
      const res = await tournamentService.updatePlayer(props.playerToEdit.id, {
        team_id: props.teamId,
        player_name: form.player_name.trim(),
        father_name: form.father_name.trim(),
        cnic: form.cnic.trim(),
        dob: form.dob,
        address: form.address.trim(),
        role: form.role,
        seasons_played: form.seasons_played,
        achievements_note: form.achievements_note.trim(),
        is_captain: form.is_captain,
        photo_url: form.photo_url,
        cnic_front_url: form.cnic_front_url,
        cnic_back_url: form.cnic_back_url,
      });

      if (res.error) {
        errorMessage.value = res.error;
        return;
      }
    } else {
      const res = await tournamentService.addPlayer({
        team_id: props.teamId,
        player_name: form.player_name.trim(),
        father_name: form.father_name.trim(),
        cnic: form.cnic.trim(),
        dob: form.dob,
        address: form.address.trim(),
        role: form.role,
        seasons_played: form.seasons_played,
        achievements_note: form.achievements_note.trim(),
        is_captain: form.is_captain,
        photo_url: form.photo_url,
        cnic_front_url: form.cnic_front_url,
        cnic_back_url: form.cnic_back_url,
      });

      if (res.error) {
        errorMessage.value = res.error;
        return;
      }
    }

    emit('player-saved');
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to save player record.';
  } finally {
    saving.value = false;
  }
};

const close = () => {
  if (!saving.value) {
    emit('close');
  }
};
</script>
