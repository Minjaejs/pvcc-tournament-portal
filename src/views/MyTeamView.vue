<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    
    <!-- Loading State Skeleton -->
    <div v-if="loading" class="space-y-6 animate-pulse">
      <div class="h-10 bg-slate-200 rounded-xl w-1/3"></div>
      <div class="h-44 bg-slate-100 rounded-3xl"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-64 bg-slate-100 rounded-2xl"></div>
      </div>
    </div>

    <!-- Case 1: Captain Does NOT Have a Team Yet -->
    <div v-else-if="!team" class="max-w-2xl mx-auto space-y-6">
      
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1">
          <span>🏏</span> PVCC Season 4 Registration
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Register Your Tournament Team
        </h1>
        <p class="text-sm text-slate-600 max-w-lg mx-auto">
          Start by naming your team and district. You will then be able to add your 11 to 15 players one by one with their photos and CNIC cards.
        </p>
      </div>

      <!-- Create Team Form Card -->
      <div class="card p-6 sm:p-8 space-y-6">
        
        <div v-if="createTeamError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ createTeamError }}</span>
        </div>

        <form @submit.prevent="handleCreateTeam" class="space-y-4">
          
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Official Team Name <span class="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              v-model="createForm.team_name" 
              placeholder="e.g. Jhang Royal Tigers Cricket Club" 
              class="input-field w-full"
              required
            />
            <span class="text-[11px] text-slate-400 mt-0.5 block">This name will appear on official tournament fixtures and scoreboards.</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Home District / Tehsil / City <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                v-model="createForm.city" 
                placeholder="e.g. Kot Shakir, Jhang" 
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Captain Full Name <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                v-model="createForm.captain_name" 
                placeholder="e.g. Muhammad Hannan" 
                class="input-field w-full"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Captain WhatsApp / Contact Number <span class="text-rose-500">*</span>
            </label>
            <input 
              type="tel" 
              v-model="createForm.captain_phone" 
              placeholder="e.g. 0300-1234567" 
              class="input-field font-mono w-full"
              required
            />
            <span class="text-[11px] text-slate-400 mt-0.5 block">Used by the PVCC management committee for match schedules and verification.</span>
          </div>

          <!-- Quick Information Checklist -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div class="font-bold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> Next Steps After Team Creation:
            </div>
            <ul class="list-disc list-inside space-y-1 pl-1">
              <li>Add between <strong>11 to 15 players</strong> into your roster with photos & CNIC front/back.</li>
              <li>Designate one player as your official <strong>Team Captain (C)</strong>.</li>
              <li>Attach the <strong>Rs. 10,000 tournament fee</strong> payment receipt to submit for verification.</li>
            </ul>
          </div>

          <button 
            type="submit" 
            class="btn-primary w-full !py-3.5 text-sm inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            :disabled="creatingTeam"
          >
            <svg v-if="creatingTeam" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ creatingTeam ? 'Registering Team...' : 'Create Team & Open Squad Hub →' }}</span>
          </button>

        </form>
      </div>

    </div>

    <!-- Case 2: Captain Has a Team -->
    <div v-else class="space-y-8">
      
      <!-- Top Team Banner & Status Card -->
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <!-- Team Identity -->
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cricket-600 to-emerald-700 text-white font-black flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-400/40 shrink-0">
              🏏
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {{ team.registration_code || 'PVCC-2026-DRAFT' }}
                </span>
                <span 
                  class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold"
                  :class="getStatusBadgeClass(team.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(team.status)"></span>
                  <span>{{ formatStatus(team.status) }}</span>
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {{ team.team_name }}
              </h1>
              
              <p class="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                <span class="flex items-center gap-1">
                  <span>📍</span> {{ team.city }}
                </span>
                <span class="flex items-center gap-1">
                  <span>👤</span> Captain: <strong class="text-slate-700">{{ team.captain_name }}</strong>
                </span>
                <span class="flex items-center gap-1">
                  <span>📱</span> {{ team.captain_phone }}
                </span>
              </p>
            </div>
          </div>

          <!-- Roster Quick Summary Counter -->
          <div class="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shrink-0 flex items-center gap-6">
            <div class="text-center">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Squad Count</div>
              <div class="text-2xl font-black" :class="players.length >= 11 ? 'text-emerald-700' : 'text-amber-600'">
                {{ players.length }} <span class="text-xs text-slate-400 font-semibold">/ 15 Max</span>
              </div>
            </div>
            <div class="h-8 w-px bg-slate-200"></div>
            <div class="text-center">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Captain Assigned</div>
              <div class="text-xs font-bold mt-1" :class="designatedCaptain ? 'text-emerald-700' : 'text-rose-600'">
                {{ designatedCaptain ? `✓ ${designatedCaptain.player_name}` : '⚠️ None' }}
              </div>
            </div>
          </div>

        </div>

        <!-- Rejection Notice (if rejected) -->
        <div v-if="team.status === 'REJECTED'" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
          <div class="font-bold text-xs flex items-center gap-1.5">
            <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Tournament Committee Rejection Reason:
          </div>
          <p class="text-xs pl-5 font-medium">
            "{{ team.rejection_reason || 'Please correct player documents or re-upload payment receipt.' }}"
          </p>
          <p class="text-[11px] text-rose-700 pl-5 pt-1">
            You can make changes to your roster and re-submit your registration below.
          </p>
        </div>

        <!-- Pending Verification Notice (if pending) -->
        <div v-else-if="team.status === 'PENDING'" class="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
          <div class="font-bold text-xs flex items-center gap-1.5">
            <svg class="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registration Submitted & Locked for Verification
          </div>
          <p class="text-xs pl-5 text-blue-800">
            The PVCC tournament management committee is currently reviewing your player CNIC documents and verifying payment of <strong>Rs. 10,000</strong>. Approvals are typically completed within 12–24 hours.
          </p>
        </div>

        <!-- Enrolled Notice (if enrolled) -->
        <div v-else-if="team.status === 'ENROLLED'" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <div class="font-bold text-xs flex items-center gap-1.5">
            <span>🎉</span>
            Congratulations! Official Tournament Enrollment Approved
          </div>
          <p class="text-xs pl-5 text-emerald-800">
            Your team is officially registered for Punjab Village Cricket Council Season 4 with registration code <strong>{{ team.registration_code }}</strong>. Fixtures and match dates will be published on the Enrolled Teams directory.
          </p>
        </div>

        <!-- Progress Bar for Squad Building (In DRAFT) -->
        <div v-if="team.status === 'DRAFT'" class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700">
              Squad Requirement Progress: 
              <span class="text-cricket-700 font-extrabold">{{ players.length }} / 11 Minimum (15 Max)</span>
            </span>
            <span v-if="players.length < 11" class="text-amber-700 font-semibold">
              Need {{ 11 - players.length }} more player{{ 11 - players.length > 1 ? 's' : '' }} to unlock submission
            </span>
            <span v-else class="text-emerald-700 font-semibold flex items-center gap-1">
              <span>✓</span> Minimum squad requirement satisfied
            </span>
          </div>

          <!-- Progress Bar Track -->
          <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              class="h-full rounded-full transition-all duration-500 ease-out"
              :class="players.length >= 11 ? 'bg-gradient-to-r from-emerald-500 to-cricket-600' : 'bg-gradient-to-r from-amber-400 to-amber-500'"
              :style="{ width: `${Math.min((players.length / 15) * 100, 100)}%` }"
            ></div>
          </div>
        </div>

      </div>

      <!-- Player Roster Hub Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Team Roster</span>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {{ players.length }} Player{{ players.length !== 1 ? 's' : '' }}
            </span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Add player personal details, roles, photo ID, and CNIC front & back attachments.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button" 
            v-if="canEditRoster"
            class="btn-primary !text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            :disabled="players.length >= 15"
            @click="openAddPlayerModal"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ players.length >= 15 ? 'Squad Full (15 Max)' : '+ Add Player' }}</span>
          </button>
        </div>
      </div>

      <!-- Players Cards Grid -->
      <div v-if="players.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <PlayerCard 
          v-for="p in players" 
          :key="p.id" 
          :player="p" 
          :can-edit="canEditRoster"
          @edit-player="handleEditPlayer"
          @delete-player="handleDeletePlayer"
          @preview-doc="handlePreviewDoc"
        />
      </div>

      <!-- Empty State Roster -->
      <div v-else class="card p-12 text-center space-y-4 border-2 border-dashed border-slate-200">
        <div class="w-16 h-16 rounded-3xl bg-cricket-50 text-cricket-700 flex items-center justify-center mx-auto text-2xl">
          🏏
        </div>
        <div class="max-w-sm mx-auto space-y-1">
          <h3 class="text-base font-bold text-slate-900">Your Squad is Empty</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Click the button below to add your first player. Enter their name, CNIC, playing role, and upload their photo ID.
          </p>
        </div>
        <div>
          <button 
            type="button" 
            class="btn-primary !text-xs !py-2.5 !px-6"
            @click="openAddPlayerModal"
          >
            + Add First Player
          </button>
        </div>
      </div>

      <!-- Payment & Final Submission Section -->
      <PaymentSection 
        :team="team"
        :player-count="players.length"
        :min-players="11"
        :has-captain="Boolean(designatedCaptain)"
        :can-submit="canSubmitTeam"
        @submission-complete="handleSubmissionSuccess"
        @preview-doc="handlePreviewDoc"
      />

    </div>

    <!-- Modals -->
    <!-- Add / Edit Player Modal -->
    <PlayerModal 
      v-if="team"
      :is-open="isPlayerModalOpen"
      :team-id="team.id"
      :player-to-edit="selectedPlayerToEdit"
      :existing-captain-id="designatedCaptain?.id || null"
      :existing-captain-name="designatedCaptain?.player_name || null"
      @close="isPlayerModalOpen = false"
      @player-saved="handlePlayerSaved"
    />

    <!-- Document Lightbox Preview Modal -->
    <DocumentPreviewModal 
      :is-open="previewModalState.isOpen"
      :title="previewModalState.title"
      :image-url="previewModalState.url"
      @close="previewModalState.isOpen = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { tournamentService } from '../services/tournamentService';
import type { Team, Player, TeamStatus } from '../types';
import PlayerCard from '../components/team/PlayerCard.vue';
import PlayerModal from '../components/team/PlayerModal.vue';
import PaymentSection from '../components/team/PaymentSection.vue';
import DocumentPreviewModal from '../components/team/DocumentPreviewModal.vue';

const { currentUser } = useAuth();

const loading = ref(true);
const team = ref<Team | null>(null);
const players = ref<Player[]>([]);

// Team creation state
const creatingTeam = ref(false);
const createTeamError = ref('');
const createForm = reactive({
  team_name: '',
  city: '',
  captain_name: '',
  captain_phone: '',
});

// Modal states
const isPlayerModalOpen = ref(false);
const selectedPlayerToEdit = ref<Player | null>(null);

const previewModalState = reactive({
  isOpen: false,
  title: '',
  url: '',
});

// Computed properties
const designatedCaptain = computed(() => {
  return players.value.find(p => p.is_captain);
});

const canEditRoster = computed(() => {
  if (!team.value) return false;
  return team.value.status === 'DRAFT' || team.value.status === 'REJECTED';
});

const canSubmitTeam = computed(() => {
  if (!team.value) return false;
  if (!canEditRoster.value) return false;
  return players.value.length >= 11 && Boolean(designatedCaptain.value);
});

// Fetch team and players
const loadCaptainData = async () => {
  if (!currentUser.value) return;
  loading.value = true;
  try {
    const fetchedTeam = await tournamentService.getCaptainTeam(currentUser.value.id);
    team.value = fetchedTeam;
    if (fetchedTeam) {
      const fetchedPlayers = await tournamentService.getPlayers(fetchedTeam.id);
      players.value = fetchedPlayers;
    }
  } catch (err) {
    console.error('Error loading captain team:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Populate default captain name/contact if available
  if (currentUser.value?.email) {
    createForm.captain_name = currentUser.value.email.split('@')[0];
  }
  loadCaptainData();
});

// Handlers
const handleCreateTeam = async () => {
  if (!currentUser.value) return;
  createTeamError.value = '';
  creatingTeam.value = true;

  try {
    const res = await tournamentService.createTeam({
      user_id: currentUser.value.id,
      team_name: createForm.team_name.trim(),
      city: createForm.city.trim(),
      captain_name: createForm.captain_name.trim(),
      captain_phone: createForm.captain_phone.trim(),
      captain_email: currentUser.value.email,
    });

    if (res.error) {
      createTeamError.value = res.error;
      return;
    }

    if (res.data) {
      team.value = res.data;
      players.value = [];
    }
  } catch (err: any) {
    createTeamError.value = err.message || 'Failed to create team profile.';
  } finally {
    creatingTeam.value = false;
  }
};

const openAddPlayerModal = () => {
  selectedPlayerToEdit.value = null;
  isPlayerModalOpen.value = true;
};

const handleEditPlayer = (player: Player) => {
  selectedPlayerToEdit.value = player;
  isPlayerModalOpen.value = true;
};

const handleDeletePlayer = async (id: string) => {
  if (!confirm('Are you sure you want to remove this player from your squad?')) return;
  try {
    await tournamentService.deletePlayer(id);
    players.value = players.value.filter(p => p.id !== id);
  } catch (err) {
    console.error('Failed to delete player:', err);
  }
};

const handlePlayerSaved = async () => {
  if (team.value) {
    const refreshed = await tournamentService.getPlayers(team.value.id);
    players.value = refreshed;
  }
};

const handleSubmissionSuccess = async () => {
  if (currentUser.value) {
    await loadCaptainData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handlePreviewDoc = (doc: { title: string; url: string }) => {
  previewModalState.title = doc.title;
  previewModalState.url = doc.url;
  previewModalState.isOpen = true;
};

// UI Helpers
const formatStatus = (status: TeamStatus) => {
  switch (status) {
    case 'DRAFT': return 'Draft Roster';
    case 'PENDING': return 'Pending Committee Verification';
    case 'ENROLLED': return 'Officially Enrolled';
    case 'REJECTED': return 'Changes Requested';
    default: return status;
  }
};

const getStatusBadgeClass = (status: TeamStatus) => {
  switch (status) {
    case 'DRAFT': return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'PENDING': return 'bg-blue-50 text-blue-800 border border-blue-200';
    case 'ENROLLED': return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    case 'REJECTED': return 'bg-rose-50 text-rose-800 border border-rose-200';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const getStatusDotClass = (status: TeamStatus) => {
  switch (status) {
    case 'DRAFT': return 'bg-amber-500';
    case 'PENDING': return 'bg-blue-500 animate-ping';
    case 'ENROLLED': return 'bg-emerald-500';
    case 'REJECTED': return 'bg-rose-500';
    default: return 'bg-slate-400';
  }
};
</script>
