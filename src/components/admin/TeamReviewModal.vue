<template>
  <div v-if="isOpen && team" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="review-modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-center justify-center p-3 sm:p-6 text-center">
      <div 
        class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-5xl border border-slate-200"
        @click.stop
      >
        <!-- Modal Top Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 bg-slate-50/80">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cricket-600 to-emerald-700 text-white font-black flex items-center justify-center text-xl shadow-md border border-emerald-400/40 shrink-0">
              🏏
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-mono font-bold bg-white text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
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
              <h3 class="text-xl font-extrabold text-slate-900 tracking-tight mt-1" id="review-modal-title">
                {{ team.team_name }}
              </h3>
              <p class="text-xs text-slate-500">
                District / City: <strong class="text-slate-700">{{ team.city }}</strong> • Captain: <strong class="text-slate-700">{{ team.captain_name }}</strong>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5 self-end sm:self-center">
            <!-- WhatsApp Chat Link -->
            <a 
              v-if="team.captain_phone" 
              :href="getWhatsAppLink(team.captain_phone)" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-secondary !text-xs !py-2 !px-3.5 inline-flex items-center gap-1.5 !text-emerald-700 !border-emerald-200 hover:!bg-emerald-50"
              title="Open WhatsApp chat with Captain"
            >
              <span>💬</span> WhatsApp Captain
            </a>

            <button 
              type="button" 
              class="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              @click="close"
              :disabled="actionLoading"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs: Payment Slip vs Roster Inspection -->
        <div class="border-b border-slate-200 px-6 flex items-center gap-6 bg-white text-xs font-bold">
          <button 
            type="button" 
            class="py-3 border-b-2 transition-colors flex items-center gap-2"
            :class="activeTab === 'payment' ? 'border-cricket-600 text-cricket-800' : 'border-transparent text-slate-500 hover:text-slate-800'"
            @click="activeTab = 'payment'"
          >
            <span>💳</span> Payment Verification
            <span v-if="team.payment_slip_url" class="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">Attached</span>
          </button>

          <button 
            type="button" 
            class="py-3 border-b-2 transition-colors flex items-center gap-2"
            :class="activeTab === 'roster' ? 'border-cricket-600 text-cricket-800' : 'border-transparent text-slate-500 hover:text-slate-800'"
            @click="activeTab = 'roster'"
          >
            <span>👥</span> Squad Roster Inspection
            <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">{{ team.players?.length || 0 }} Players</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          <!-- TAB 1: Payment Verification -->
          <div v-if="activeTab === 'payment'" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Payment Details Card -->
              <div class="space-y-4">
                <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/80 pb-2">
                    Payment Transaction Summary
                  </h4>

                  <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                      <span class="text-sm font-extrabold text-slate-800">{{ team.payment_method || 'EasyPaisa' }}</span>
                    </div>

                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Entry Fee Amount</span>
                      <span class="text-sm font-extrabold text-emerald-700">Rs. 10,000 (PKR)</span>
                    </div>

                    <div class="col-span-2 bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Transaction Reference ID</span>
                        <span class="text-sm font-mono font-bold text-slate-900">{{ team.transaction_id || 'Not Provided' }}</span>
                      </div>
                      <button 
                        v-if="team.transaction_id"
                        type="button" 
                        class="text-xs font-bold text-cricket-700 hover:text-cricket-800 px-2 py-1 rounded-md bg-cricket-50 border border-cricket-200 transition-colors"
                        @click="copyTrxId(team.transaction_id)"
                      >
                        {{ copiedTrx ? '✓ Copied' : 'Copy Trx ID' }}
                      </button>
                    </div>

                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Submitted At</span>
                      <span class="font-semibold text-slate-700">
                        {{ team.payment_submitted_at ? new Date(team.payment_submitted_at).toLocaleString() : 'N/A' }}
                      </span>
                    </div>

                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Captain WhatsApp</span>
                      <span class="font-semibold text-slate-700">{{ team.captain_phone }}</span>
                    </div>
                  </div>
                </div>

                <!-- Admin Audit Notes Input -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    Administrative Notes / Committee Remarks (Optional)
                  </label>
                  <textarea 
                    v-model="adminNotes" 
                    rows="3" 
                    placeholder="e.g. Verified payment of Rs. 10,000 received in EasyPaisa account statement at 12:45 PM. CNIC records verified."
                    class="input-field text-xs resize-none"
                  ></textarea>
                </div>

                <!-- Rejection Reason Input (Shown if rejecting) -->
                <div v-if="showRejectBox" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-rose-900">Specify Rejection / Return Reason</span>
                    <button type="button" class="text-xs text-rose-700 hover:underline" @click="showRejectBox = false">Cancel</button>
                  </div>
                  <textarea 
                    v-model="rejectionReason" 
                    rows="3" 
                    placeholder="e.g. Transaction ID 82910 not found on council EasyPaisa ledger. Please upload clear receipt screenshot."
                    class="input-field !border-rose-300 text-xs resize-none"
                  ></textarea>
                  <button 
                    type="button" 
                    class="btn-danger w-full !text-xs !py-2.5 font-bold"
                    :disabled="!rejectionReason.trim() || actionLoading"
                    @click="confirmReject"
                  >
                    Confirm Rejection & Send Reason to Captain
                  </button>
                </div>

              </div>

              <!-- Payment Receipt Image Preview -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Payment Receipt Evidence</h4>
                  <button 
                    v-if="team.payment_slip_url"
                    type="button" 
                    class="text-xs font-semibold text-cricket-700 hover:underline inline-flex items-center gap-1"
                    @click="emit('preview-doc', { title: `${team.team_name} - Payment Slip`, url: team.payment_slip_url })"
                  >
                    <span>🔍</span> Enlarge Image
                  </button>
                </div>

                <div 
                  v-if="team.payment_slip_url" 
                  class="rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 p-2 flex items-center justify-center min-h-[320px] max-h-[420px] group cursor-pointer"
                  @click="emit('preview-doc', { title: `${team.team_name} - Payment Slip`, url: team.payment_slip_url })"
                >
                  <img 
                    :src="team.payment_slip_url" 
                    alt="Payment Slip" 
                    class="max-h-[380px] max-w-full rounded-xl object-contain group-hover:scale-102 transition-transform" 
                  />
                </div>

                <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-400 space-y-2">
                  <svg class="w-12 h-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div class="text-xs font-bold text-slate-600">No Payment Slip Attached</div>
                  <p class="text-[11px] text-slate-400">The team has not uploaded their payment receipt screenshot yet.</p>
                </div>
              </div>

            </div>

          </div>

          <!-- TAB 2: Squad Roster Inspection -->
          <div v-else-if="activeTab === 'roster'" class="space-y-4">
            
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Registered Players ({{ team.players?.length || 0 }} / 15)
                </h4>
                <p class="text-xs text-slate-500">
                  Review each player's identity documents, age eligibility, and playing profile.
                </p>
              </div>

              <!-- Min Players Badge -->
              <span 
                class="px-2.5 py-1 rounded-full text-xs font-bold"
                :class="(team.players?.length || 0) >= 11 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
              >
                {{ (team.players?.length || 0) >= 11 ? '✓ Minimum 11 Met' : `⚠️ Needs ${11 - (team.players?.length || 0)} More` }}
              </span>
            </div>

            <!-- Players Table -->
            <div class="overflow-x-auto rounded-2xl border border-slate-200">
              <table class="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead class="bg-slate-50 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th scope="col" class="px-4 py-3">#</th>
                    <th scope="col" class="px-4 py-3">Player Info</th>
                    <th scope="col" class="px-4 py-3">CNIC / B-Form</th>
                    <th scope="col" class="px-4 py-3">DOB & Age</th>
                    <th scope="col" class="px-4 py-3">Role</th>
                    <th scope="col" class="px-4 py-3">Documents</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr 
                    v-for="(p, idx) in team.players" 
                    :key="p.id" 
                    class="hover:bg-slate-50/70 transition-colors"
                    :class="{ 'bg-amber-50/30': p.is_captain }"
                  >
                    <!-- Index & Captain Star -->
                    <td class="px-4 py-3 font-mono font-bold text-slate-400">
                      {{ idx + 1 }}
                      <span v-if="p.is_captain" class="text-amber-500 ml-0.5" title="Designated Captain">★</span>
                    </td>

                    <!-- Name & Father Name -->
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <!-- Avatar / Photo -->
                        <div 
                          class="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 cursor-pointer"
                          @click="p.photo_url && emit('preview-doc', { title: `${p.player_name} - Photo`, url: p.photo_url })"
                        >
                          <img v-if="p.photo_url" :src="p.photo_url" :alt="p.player_name" class="w-full h-full object-cover" />
                          <div v-else class="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                            {{ p.player_name.charAt(0) }}
                          </div>
                        </div>

                        <div>
                          <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
                            {{ p.player_name }}
                            <span v-if="p.is_captain" class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              Captain
                            </span>
                          </div>
                          <div class="text-[11px] text-slate-500">S/O {{ p.father_name || 'N/A' }}</div>
                          <div class="text-[10px] text-slate-400 truncate max-w-[140px]">{{ p.address }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- CNIC -->
                    <td class="px-4 py-3 font-mono font-bold text-slate-800">
                      {{ formatCNIC(p.cnic) }}
                    </td>

                    <!-- DOB & Age -->
                    <td class="px-4 py-3">
                      <div class="font-semibold text-slate-700">{{ p.dob || 'N/A' }}</div>
                      <div v-if="calculateAge(p.dob)" class="text-[11px] text-slate-500 font-medium">
                        {{ calculateAge(p.dob) }} yrs old
                      </div>
                    </td>

                    <!-- Playing Role -->
                    <td class="px-4 py-3">
                      <span 
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold capitalize"
                        :class="getRoleBadgeClass(p.role)"
                      >
                        {{ p.role.replace('_', ' ') }}
                      </span>
                    </td>

                    <!-- Document Triggers -->
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1.5">
                        <!-- Photo -->
                        <button 
                          v-if="p.photo_url"
                          type="button" 
                          class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors"
                          @click="emit('preview-doc', { title: `${p.player_name} - Photo`, url: p.photo_url })"
                        >
                          Photo
                        </button>

                        <!-- CNIC Front -->
                        <button 
                          v-if="p.cnic_front_url"
                          type="button" 
                          class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold transition-colors"
                          @click="emit('preview-doc', { title: `${p.player_name} - CNIC Front`, url: p.cnic_front_url })"
                        >
                          CNIC Front
                        </button>

                        <!-- CNIC Back -->
                        <button 
                          v-if="p.cnic_back_url"
                          type="button" 
                          class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold transition-colors"
                          @click="emit('preview-doc', { title: `${p.player_name} - CNIC Back`, url: p.cnic_back_url })"
                        >
                          CNIC Back
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!team.players || team.players.length === 0">
                    <td colspan="6" class="px-4 py-8 text-center text-slate-400 text-xs">
                      No players registered in this squad yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

        <!-- Action Footer -->
        <div class="border-t border-slate-200 px-6 py-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Registered on {{ team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A' }}
          </div>

          <div class="flex items-center gap-2.5 flex-wrap justify-end">
            <button 
              type="button" 
              class="btn-secondary !text-xs !py-2.5 !px-4"
              @click="close"
              :disabled="actionLoading"
            >
              Close Drawer
            </button>

            <!-- Reject Button (Trigger rejection box) -->
            <button 
              v-if="team.status !== 'REJECTED'"
              type="button" 
              class="btn-danger !text-xs !py-2.5 !px-4"
              :disabled="actionLoading"
              @click="showRejectBox = !showRejectBox"
            >
              ✕ Reject Submission
            </button>

            <!-- Approve Button -->
            <button 
              v-if="team.status !== 'ENROLLED'"
              type="button" 
              class="btn-primary !text-xs !py-2.5 !px-6 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              :disabled="actionLoading"
              @click="confirmApprove"
            >
              <svg v-if="actionLoading" class="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>✓ Approve & Enroll Team</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Team, TeamStatus, PlayerRole } from '../../types';
import { tournamentService } from '../../services/tournamentService';

const props = defineProps<{
  isOpen: boolean;
  team: Team | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'team-updated'): void;
  (e: 'preview-doc', doc: { title: string; url: string }): void;
}>();

const activeTab = ref<'payment' | 'roster'>('payment');
const adminNotes = ref('');
const showRejectBox = ref(false);
const rejectionReason = ref('');
const actionLoading = ref(false);
const copiedTrx = ref(false);

const close = () => {
  if (!actionLoading.value) {
    showRejectBox.value = false;
    emit('close');
  }
};

const copyTrxId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id);
    copiedTrx.value = true;
    setTimeout(() => {
      copiedTrx.value = false;
    }, 2000);
  } catch {
    // fallback
  }
};

const getWhatsAppLink = (phone: string) => {
  const clean = phone.replace(/\D/g, '');
  const international = clean.startsWith('0') ? '92' + clean.slice(1) : clean;
  return `https://wa.me/${international}?text=Hello%20Captain%2C%20regarding%20your%20PVCC%20Season%204%20team%20registration...`;
};

const confirmApprove = async () => {
  if (!props.team) return;
  if (!confirm(`Are you sure you want to approve "${props.team.team_name}" and grant official tournament enrollment?`)) {
    return;
  }

  actionLoading.value = true;
  try {
    const res = await tournamentService.approveTeam(props.team.id, adminNotes.value.trim());
    if (res.error) {
      alert(`Approval error: ${res.error}`);
      return;
    }
    emit('team-updated');
    close();
  } catch (err: any) {
    alert(err.message || 'Failed to approve team.');
  } finally {
    actionLoading.value = false;
  }
};

const confirmReject = async () => {
  if (!props.team || !rejectionReason.value.trim()) return;

  actionLoading.value = true;
  try {
    const res = await tournamentService.rejectTeam(props.team.id, rejectionReason.value.trim());
    if (res.error) {
      alert(`Rejection error: ${res.error}`);
      return;
    }
    emit('team-updated');
    close();
  } catch (err: any) {
    alert(err.message || 'Failed to reject team.');
  } finally {
    actionLoading.value = false;
  }
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

const getRoleBadgeClass = (role: PlayerRole) => {
  switch (role) {
    case 'batsman': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'bowler': return 'bg-red-50 text-red-700 border border-red-200';
    case 'all_rounder': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'wicket_keeper': return 'bg-purple-50 text-purple-700 border border-purple-200';
    default: return 'bg-slate-50 text-slate-700';
  }
};
</script>
