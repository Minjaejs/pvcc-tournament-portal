<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    
    <!-- Top Header & Admin Context -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
          <span>🛡️</span> PVCC Management Portal
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Tournament Admin Dashboard</h1>
        <p class="text-xs text-slate-500 mt-1">
          Signed in as: <strong class="text-slate-700 font-bold">{{ currentUser?.email || 'admin@pvcc.pk' }}</strong>. Verify incoming registrations, review payment receipts, and qualify squads for Punjab Village Cricket Council Season 4.
        </p>
      </div>

      <div class="flex items-center gap-2.5 self-start sm:self-center">
        <button 
          type="button" 
          class="btn-secondary !text-xs !py-2.5 !px-4 inline-flex items-center gap-1.5"
          @click="loadAllTeams"
          :disabled="loading"
        >
          <span :class="{ 'animate-spin': loading }">🔄</span> Refresh
        </button>

        <button 
          type="button" 
          class="btn-secondary !text-xs !py-2.5 !px-4 inline-flex items-center gap-1.5"
          @click="exportCsv"
          :disabled="teams.length === 0"
        >
          <span>📥</span> Export Roster CSV
        </button>
      </div>
    </div>

    <!-- Overview KPI Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- Total Teams -->
      <div class="card p-5 space-y-1">
        <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Registrations</div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900">{{ teams.length }}</div>
        <div class="text-[11px] text-slate-500">All submitted & drafts</div>
      </div>

      <!-- Pending Verification (Critical) -->
      <div 
        class="card p-5 space-y-1 border-2 transition-all"
        :class="pendingCount > 0 ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200'"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Pending Verification</span>
          <span v-if="pendingCount > 0" class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-amber-700">{{ pendingCount }}</div>
        <div class="text-[11px] text-amber-800/80 font-medium">Awaiting receipt check</div>
      </div>

      <!-- Enrolled -->
      <div class="card p-5 space-y-1 bg-emerald-50/30 border border-emerald-200/80">
        <div class="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Officially Enrolled</div>
        <div class="text-2xl sm:text-3xl font-black text-emerald-700">{{ enrolledCount }}</div>
        <div class="text-[11px] text-emerald-800/80 font-medium">Qualified for Season 4</div>
      </div>

      <!-- Rejected / In Correction -->
      <div class="card p-5 space-y-1">
        <div class="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Changes Requested</div>
        <div class="text-2xl sm:text-3xl font-black text-rose-600">{{ rejectedCount }}</div>
        <div class="text-[11px] text-slate-500">Returned to captain</div>
      </div>

      <!-- Verified Fees Collected -->
      <div class="card p-5 space-y-1 col-span-2 lg:col-span-1 bg-slate-900 text-white">
        <div class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Verified Fee Pool</div>
        <div class="text-xl sm:text-2xl font-black text-white">Rs. {{ (enrolledCount * 10000).toLocaleString() }}</div>
        <div class="text-[10px] text-slate-400">Rs. 10k × {{ enrolledCount }} squads</div>
      </div>

    </div>

    <!-- Filters & Search Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
      
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.id"
          type="button"
          class="px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5"
          :class="[
            currentTab === tab.id 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
          @click="currentTab = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span 
            class="px-1.5 py-0.5 rounded-full text-[10px]"
            :class="currentTab === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search Field -->
      <div class="relative w-full md:w-72">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search team, captain, code..." 
          class="input-field !text-xs !pl-9"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

    </div>

    <!-- Management Teams Table -->
    <div class="card overflow-hidden">
      
      <!-- Loading Skeleton -->
      <div v-if="loading" class="p-8 space-y-4 animate-pulse">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-xl"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTeams.length === 0" class="p-12 text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
          🔍
        </div>
        <h4 class="text-sm font-bold text-slate-700">No Tournament Registrations Found</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          {{ searchQuery ? `No teams match "${searchQuery}" in this filter view.` : 'No teams have submitted under this status category yet.' }}
        </p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th scope="col" class="px-5 py-3.5">Team & Code</th>
              <th scope="col" class="px-5 py-3.5">District / City</th>
              <th scope="col" class="px-5 py-3.5">Captain & WhatsApp</th>
              <th scope="col" class="px-5 py-3.5">Roster Size</th>
              <th scope="col" class="px-5 py-3.5">Payment Ref</th>
              <th scope="col" class="px-5 py-3.5">Status</th>
              <th scope="col" class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr 
              v-for="t in filteredTeams" 
              :key="t.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Team Name & Reg Code -->
              <td class="px-5 py-4">
                <div class="font-extrabold text-slate-900 text-sm leading-snug">
                  {{ t.team_name }}
                </div>
                <div class="font-mono text-[11px] font-bold text-slate-500 mt-0.5">
                  {{ t.registration_code || 'PVCC-DRAFT' }}
                </div>
              </td>

              <!-- City / District -->
              <td class="px-5 py-4 text-slate-600 font-medium">
                {{ t.city }}
              </td>

              <!-- Captain & WhatsApp -->
              <td class="px-5 py-4">
                <div class="font-bold text-slate-800">{{ t.captain_name }}</div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-slate-500 font-mono text-[11px]">{{ t.captain_phone }}</span>
                  <a 
                    v-if="t.captain_phone"
                    :href="getWhatsAppLink(t.captain_phone)" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                    title="Direct WhatsApp"
                  >
                    💬 Chat
                  </a>
                </div>
              </td>

              <!-- Roster Size -->
              <td class="px-5 py-4">
                <span 
                  class="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px]"
                  :class="(t.player_count || 0) >= 11 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'"
                >
                  {{ t.player_count || t.players?.length || 0 }} Players
                </span>
              </td>

              <!-- Payment Method & Receipt Thumbnail -->
              <td class="px-5 py-4">
                <div v-if="t.payment_slip_url || t.transaction_id" class="space-y-0.5">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{{ t.payment_method || 'EasyPaisa' }}</span>
                    <button 
                      v-if="t.payment_slip_url"
                      type="button" 
                      class="text-[10px] text-cricket-700 hover:underline bg-cricket-50 px-1 rounded border border-cricket-200 font-semibold"
                      @click="handlePreviewDoc({ title: `${t.team_name} - Payment Receipt`, url: t.payment_slip_url })"
                    >
                      Receipt 🧾
                    </button>
                  </div>
                  <div class="font-mono text-[10px] text-slate-500 truncate max-w-[130px]">
                    Trx: {{ t.transaction_id || 'N/A' }}
                  </div>
                </div>
                <span v-else class="text-slate-400 text-[11px]">Pending Payment</span>
              </td>

              <!-- Status Badge -->
              <td class="px-5 py-4">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="getStatusBadgeClass(t.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(t.status)"></span>
                  <span>{{ formatStatus(t.status) }}</span>
                </span>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    type="button" 
                    class="btn-primary !text-xs !py-1.5 !px-3 font-bold"
                    @click="openReviewModal(t)"
                  >
                    Review 🔍
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modals -->
    <!-- Team Review Modal -->
    <TeamReviewModal 
      :is-open="isReviewModalOpen"
      :team="selectedTeamToReview"
      @close="isReviewModalOpen = false"
      @team-updated="handleTeamUpdated"
      @preview-doc="handlePreviewDoc"
    />

    <!-- Document Lightbox Modal -->
    <DocumentPreviewModal 
      :is-open="previewModalState.isOpen"
      :title="previewModalState.title"
      :image-url="previewModalState.url"
      @close="previewModalState.isOpen = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { tournamentService } from '../../services/tournamentService';
import type { Team, TeamStatus } from '../../types';
import TeamReviewModal from '../../components/admin/TeamReviewModal.vue';
import DocumentPreviewModal from '../../components/team/DocumentPreviewModal.vue';

const { currentUser } = useAuth();

const teams = ref<Team[]>([]);
const loading = ref(true);
const currentTab = ref<'ALL' | 'PENDING' | 'ENROLLED' | 'REJECTED' | 'DRAFT'>('PENDING');
const searchQuery = ref('');

const isReviewModalOpen = ref(false);
const selectedTeamToReview = ref<Team | null>(null);

const previewModalState = ref({
  isOpen: false,
  title: '',
  url: '',
});

// Load teams
const loadAllTeams = async () => {
  loading.value = true;
  try {
    const data = await tournamentService.getAllTeamsForAdmin();
    teams.value = data;

    // If no pending teams, default tab to ALL
    const hasPending = data.some(t => t.status === 'PENDING');
    if (!hasPending && currentTab.value === 'PENDING' && data.length > 0) {
      currentTab.value = 'ALL';
    }
  } catch (err) {
    console.error('Error fetching admin teams:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAllTeams();
});

// Counts
const pendingCount = computed(() => teams.value.filter(t => t.status === 'PENDING').length);
const enrolledCount = computed(() => teams.value.filter(t => t.status === 'ENROLLED').length);
const rejectedCount = computed(() => teams.value.filter(t => t.status === 'REJECTED').length);
const draftCount = computed(() => teams.value.filter(t => t.status === 'DRAFT').length);

const filterTabs = computed(() => [
  { id: 'PENDING' as const, label: 'Pending Verification', count: pendingCount.value },
  { id: 'ALL' as const, label: 'All Teams', count: teams.value.length },
  { id: 'ENROLLED' as const, label: 'Enrolled', count: enrolledCount.value },
  { id: 'REJECTED' as const, label: 'Changes Requested', count: rejectedCount.value },
  { id: 'DRAFT' as const, label: 'Drafts', count: draftCount.value },
]);

// Filtered and searched list
const filteredTeams = computed(() => {
  let list = teams.value;

  if (currentTab.value !== 'ALL') {
    list = list.filter(t => t.status === currentTab.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(t => 
      t.team_name.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.captain_name.toLowerCase().includes(q) ||
      t.registration_code.toLowerCase().includes(q) ||
      (t.transaction_id && t.transaction_id.toLowerCase().includes(q))
    );
  }

  return list;
});

// Actions
const openReviewModal = (team: Team) => {
  selectedTeamToReview.value = team;
  isReviewModalOpen.value = true;
};

const handleTeamUpdated = () => {
  loadAllTeams();
};

const handlePreviewDoc = (doc: { title: string; url: string }) => {
  previewModalState.value = {
    isOpen: true,
    title: doc.title,
    url: doc.url,
  };
};

const getWhatsAppLink = (phone: string) => {
  const clean = phone.replace(/\D/g, '');
  const international = clean.startsWith('0') ? '92' + clean.slice(1) : clean;
  return `https://wa.me/${international}?text=Hello%20Captain%2C%20regarding%20your%20PVCC%20Season%204%20registration...`;
};

// Export to CSV for match day sheets
const exportCsv = () => {
  if (teams.value.length === 0) return;

  const headers = ['Registration Code', 'Team Name', 'City', 'Captain Name', 'Captain Phone', 'Status', 'Player Count', 'Trx ID', 'Payment Method'];
  const rows = teams.value.map(t => [
    `"${t.registration_code || ''}"`,
    `"${t.team_name}"`,
    `"${t.city}"`,
    `"${t.captain_name}"`,
    `"${t.captain_phone}"`,
    `"${t.status}"`,
    t.player_count || t.players?.length || 0,
    `"${t.transaction_id || ''}"`,
    `"${t.payment_method || ''}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PVCC_Season4_Teams_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helpers
const formatStatus = (status: TeamStatus) => {
  switch (status) {
    case 'DRAFT': return 'Draft Roster';
    case 'PENDING': return 'Pending Verification';
    case 'ENROLLED': return 'Enrolled';
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
