<template>
  <div class="card p-6 sm:p-8 space-y-6">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>💳</span> Step 3: Entry Fee & Submission
        </div>
        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">
          Tournament Fee & Payment Verification
        </h3>
        <p class="text-xs text-slate-500">
          Transfer the official tournament entry fee of <span class="font-bold text-slate-800">Rs. 10,000</span> and upload your payment transaction receipt.
        </p>
      </div>

      <!-- Fee Pill -->
      <div class="bg-gradient-to-br from-cricket-700 to-emerald-800 text-white px-5 py-3 rounded-2xl shadow-md text-right shrink-0">
        <div class="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">Tournament Entry Fee</div>
        <div class="text-2xl font-black tracking-tight">Rs. 10,000</div>
      </div>
    </div>

    <!-- Official PVCC Accounts Grid -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Official PVCC Payment Accounts</h4>
        <span class="text-[11px] text-slate-500">Click to copy account details</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        <!-- EasyPaisa -->
        <div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              EasyPaisa
            </span>
            <button 
              type="button" 
              class="text-[11px] font-bold text-cricket-700 hover:text-cricket-800 inline-flex items-center gap-1 transition-colors"
              @click="copyText('0301-7654321', 'EasyPaisa Number')"
            >
              <span>{{ copiedField === 'EasyPaisa Number' ? '✓ Copied' : 'Copy' }}</span>
            </button>
          </div>
          <div>
            <div class="text-xs text-slate-500">Account Title</div>
            <div class="text-sm font-bold text-slate-800">Muhammad Irfan</div>
            <div class="font-mono text-xs font-semibold text-slate-700 mt-0.5">0301-7654321</div>
          </div>
        </div>

        <!-- JazzCash -->
        <div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-red-300 transition-all space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              JazzCash
            </span>
            <button 
              type="button" 
              class="text-[11px] font-bold text-cricket-700 hover:text-cricket-800 inline-flex items-center gap-1 transition-colors"
              @click="copyText('0300-9876543', 'JazzCash Number')"
            >
              <span>{{ copiedField === 'JazzCash Number' ? '✓ Copied' : 'Copy' }}</span>
            </button>
          </div>
          <div>
            <div class="text-xs text-slate-500">Account Title</div>
            <div class="text-sm font-bold text-slate-800">Muhammad Irfan</div>
            <div class="font-mono text-xs font-semibold text-slate-700 mt-0.5">0300-9876543</div>
          </div>
        </div>

        <!-- Bank Al Habib -->
        <div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Bank Al Habib
            </span>
            <button 
              type="button" 
              class="text-[11px] font-bold text-cricket-700 hover:text-cricket-800 inline-flex items-center gap-1 transition-colors"
              @click="copyText('PK36BAHL1029008101928301', 'Bank IBAN')"
            >
              <span>{{ copiedField === 'Bank IBAN' ? '✓ Copied' : 'Copy IBAN' }}</span>
            </button>
          </div>
          <div>
            <div class="text-xs text-slate-500">Account Title</div>
            <div class="text-sm font-bold text-slate-800">Punjab Village Cricket Council</div>
            <div class="font-mono text-[11px] font-semibold text-slate-700 mt-0.5 truncate" title="PK36BAHL1029008101928301">
              IBAN: PK36BAHL...28301
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Payment Upload & Submission Form (When Draft) -->
    <div v-if="team.status === 'DRAFT' || team.status === 'REJECTED'" class="pt-4 border-t border-slate-100 space-y-5">
      
      <!-- Missing Requirements Warning if any -->
      <div v-if="!canSubmit" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1.5">
        <div class="font-bold flex items-center gap-1.5">
          <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Requirements to unlock registration submission:
        </div>
        <ul class="list-disc list-inside space-y-1 pl-1">
          <li v-if="playerCount < minPlayers">
            Minimum {{ minPlayers }} players required (Current: {{ playerCount }} / {{ minPlayers }}). Add {{ minPlayers - playerCount }} more.
          </li>
          <li v-if="!hasCaptain">
            One player must be designated as Team Captain (C).
          </li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmitPayment" class="space-y-5">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Payment Method -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Payment Method Used <span class="text-rose-500">*</span>
            </label>
            <select v-model="form.paymentMethod" class="input-field" :disabled="!canSubmit || submitting">
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Bank Transfer">Bank Transfer (Bank Al Habib)</option>
              <option value="Cash with Committee">Cash with Committee Member</option>
            </select>
          </div>

          <!-- Transaction ID -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Transaction ID / Trx Ref Number <span class="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              v-model="form.transactionId" 
              placeholder="e.g. 84920193820 or Ref No" 
              class="input-field font-mono"
              :disabled="!canSubmit || submitting"
              required
            />
            <span class="text-[11px] text-slate-400 mt-0.5 block">Found on SMS confirmation or bank digital receipt</span>
          </div>
        </div>

        <!-- Receipt / Slip Upload Box -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-slate-700">
              Upload Payment Slip / Screenshot <span class="text-rose-500">*</span>
            </label>
            <span v-if="compressionStat" class="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ {{ compressionStat }}
            </span>
          </div>

          <!-- Upload Dropzone or Preview -->
          <div v-if="form.slipUrl" class="relative rounded-2xl overflow-hidden border border-slate-200 max-w-sm bg-slate-900 group">
            <img :src="form.slipUrl" alt="Payment Receipt" class="w-full h-44 object-contain" />
            <button 
              type="button" 
              class="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-xl text-xs transition-colors"
              @click="form.slipUrl = ''"
              title="Replace slip"
            >
              ✕ Remove
            </button>
          </div>

          <label 
            v-else 
            class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-cricket-500 bg-slate-50/50 hover:bg-slate-50 transition-all p-4 text-center"
            :class="{ 'opacity-50 pointer-events-none': !canSubmit || submitting }"
          >
            <svg class="w-8 h-8 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="text-xs font-bold text-cricket-700">Upload Receipt Screenshot</span>
            <span class="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP (auto-compressed before upload)</span>
            <input type="file" accept="image/*" class="hidden" @change="handleSlipUpload" :disabled="!canSubmit || submitting" />
          </label>
        </div>

        <!-- Terms Agreement -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <input 
            type="checkbox" 
            id="terms_agree" 
            v-model="form.agreeTerms"
            class="mt-1 h-4 w-4 rounded border-slate-300 text-cricket-600 focus:ring-cricket-500"
            :disabled="!canSubmit || submitting"
            required
          />
          <label for="terms_agree" class="text-xs text-slate-700 select-none cursor-pointer">
            <span class="font-bold text-slate-900 block">Declaration & Rule Commitment</span>
            <span class="text-slate-500 text-[11px] block mt-0.5">
              I certify that our {{ playerCount }} players meet PVCC tournament eligibility rules and the uploaded payment receipt is valid. I understand that fraudulent entries will lead to immediate disqualification.
            </span>
          </label>
        </div>

        <!-- Error feedback -->
        <div v-if="submissionError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {{ submissionError }}
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button 
            type="submit" 
            class="btn-primary w-full !py-3.5 text-sm inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            :disabled="!canSubmit || submitting || !form.slipUrl || !form.agreeTerms"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="submitting">Submitting Squad for Review...</span>
            <span v-else>Submit Team for Verification →</span>
          </button>
        </div>

      </form>
    </div>

    <!-- Submitted / Read-Only Display (When PENDING or ENROLLED) -->
    <div v-else class="pt-4 border-t border-slate-100 space-y-4">
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Method & Reference</div>
          <div class="text-sm font-bold text-slate-800 mt-0.5">
            {{ team.payment_method || 'EasyPaisa' }} • <span class="font-mono text-slate-600">Trx ID: {{ team.transaction_id || 'PVCC-TX-VERIFY' }}</span>
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Submitted on: {{ team.payment_submitted_at ? new Date(team.payment_submitted_at).toLocaleDateString() : 'Today' }}
          </div>
        </div>

        <button 
          v-if="team.payment_slip_url"
          type="button" 
          class="btn-secondary !text-xs !py-2 !px-4 self-start sm:self-center"
          @click="emit('preview-doc', { title: `${team.team_name} - Payment Slip`, url: team.payment_slip_url })"
        >
          View Submitted Slip 🧾
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Team } from '../../types';
import { compressImageFile, formatBytes } from '../../utils/imageCompressor';
import { tournamentService } from '../../services/tournamentService';

const props = defineProps<{
  team: Team;
  playerCount: number;
  minPlayers: number;
  hasCaptain: boolean;
  canSubmit: boolean;
}>();

const emit = defineEmits<{
  (e: 'submission-complete'): void;
  (e: 'preview-doc', doc: { title: string; url: string }): void;
}>();

const copiedField = ref('');
const submitting = ref(false);
const submissionError = ref('');
const compressionStat = ref('');

const form = reactive({
  paymentMethod: 'EasyPaisa',
  transactionId: '',
  slipUrl: '',
  agreeTerms: false,
});

const copyText = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = label;
    setTimeout(() => {
      copiedField.value = '';
    }, 2500);
  } catch {
    // fallback
  }
};

const handleSlipUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];

  try {
    const originalSize = file.size;
    const compressed = await compressImageFile(file, {
      maxWidth: 1400,
      maxHeight: 1400,
      quality: 0.75,
      targetSizeKB: 200,
    });

    const ratio = Math.round((1 - compressed.size / originalSize) * 100);
    compressionStat.value = `${formatBytes(compressed.size)} (${ratio > 0 ? ratio + '% saved' : 'optimized'})`;

    const fileName = `${props.team.id}/payment_slip_${Date.now()}.jpg`;
    const uploadRes = await tournamentService.uploadDocument('payment-slips', fileName, compressed);

    if (uploadRes.error) {
      submissionError.value = `Failed to upload payment slip: ${uploadRes.error}`;
      return;
    }

    if (uploadRes.path) {
      form.slipUrl = await tournamentService.getSecureUrl('payment-slips', uploadRes.path);
    }
  } catch (err: any) {
    submissionError.value = err.message || 'Error processing payment receipt.';
  } finally {
    target.value = '';
  }
};

const handleSubmitPayment = async () => {
  submissionError.value = '';

  if (!form.transactionId.trim()) {
    submissionError.value = 'Please provide the transaction ID / reference number.';
    return;
  }
  if (!form.slipUrl) {
    submissionError.value = 'Please upload a screenshot or photo of your payment receipt.';
    return;
  }
  if (!form.agreeTerms) {
    submissionError.value = 'You must confirm the PVCC tournament rules agreement.';
    return;
  }

  submitting.value = true;
  try {
    const res = await tournamentService.submitTeamRegistration({
      teamId: props.team.id,
      paymentMethod: form.paymentMethod,
      transactionId: form.transactionId.trim(),
      paymentSlipUrl: form.slipUrl,
    });

    if (res.error) {
      submissionError.value = res.error;
      return;
    }

    emit('submission-complete');
  } catch (err: any) {
    submissionError.value = err.message || 'Error submitting registration.';
  } finally {
    submitting.value = false;
  }
};
</script>
