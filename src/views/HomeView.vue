<template>
  <div class="space-y-16 pb-16">
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 border-b border-slate-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Hero Text -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Punjab Village Cricket Council — Season 35 Registration
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Register Your Squad. <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-cricket-600 via-cricket-700 to-emerald-800">
                Compete For Glory.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Official online registration portal for the upcoming PVCC cricket championship. Register your 11 to 15 players with verified CNICs, upload payment receipt, and track your team's official enrollment status in real time.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <router-link to="/register" class="w-full sm:w-auto btn-primary text-base px-7 py-3.5 shadow-md shadow-cricket-600/25">
                <svg class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Register Your Team
              </router-link>

              <router-link to="/teams" class="w-full sm:w-auto btn-secondary text-base px-6 py-3.5">
                <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Enrolled Teams
              </router-link>
            </div>

            <!-- Key Quick Stats -->
            <div class="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80">
              <div class="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <div class="text-xs text-slate-500 font-medium">Squad Size</div>
                <div class="text-lg font-bold text-slate-900 mt-0.5">11 - 15 Players</div>
              </div>
              <div class="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <div class="text-xs text-slate-500 font-medium">Tournament Fee</div>
                <div class="text-lg font-bold text-cricket-700 mt-0.5">Rs. 10,000</div>
              </div>
              <div class="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <div class="text-xs text-slate-500 font-medium">Payment Mode</div>
                <div class="text-lg font-bold text-slate-900 mt-0.5">EasyPaisa / Bank</div>
              </div>
              <div class="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <div class="text-xs text-slate-500 font-medium">Verification</div>
                <div class="text-lg font-bold text-amber-600 mt-0.5">Admin Verified</div>
              </div>
            </div>
          </div>

          <!-- Hero Visual / Form Sample Card -->
          <div class="lg:col-span-5">
            <div class="relative bg-white rounded-2xl border-2 border-emerald-600/30 p-5 shadow-xl shadow-emerald-950/5">
              <!-- Header Bar of Physical Form Preview -->
              <div class="flex items-center justify-between pb-4 border-b border-slate-200">
                <div class="flex items-center gap-2.5">
                  <img src="/logo.png" alt="PVCC Logo" class="w-8 h-8 object-contain shrink-0" />
                  <div>
                    <div class="text-xs font-black text-slate-900 uppercase tracking-wider">Official Registration Card</div>
                    <div class="text-[10px] text-slate-500">Punjab Village Cricket Council Standard</div>
                  </div>
                </div>
                <span class="badge-pending">Status: In Verification</span>
              </div>

              <!-- Form Preview Fields Mock -->
              <div class="mt-4 space-y-3">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span class="text-slate-400 block text-[10px] font-semibold uppercase">Team Name</span>
                    <span class="font-bold text-slate-800 text-sm">Jhang Super Kings</span>
                  </div>
                  <div class="text-right">
                    <span class="text-slate-400 block text-[10px] font-semibold uppercase">Captain</span>
                    <span class="font-semibold text-slate-800">Akhtar Nawaz</span>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                  <div class="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>Verified Squad Roster</span>
                    <span class="text-cricket-700">14 / 15 Players</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-cricket-600 h-2 rounded-full" style="width: 93%"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                    <div class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      14 Player Photos
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      28 CNIC Documents
                    </div>
                  </div>
                </div>

                <!-- Payment Receipt Preview -->
                <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div class="font-bold text-emerald-950">EasyPaisa Slip Attached</div>
                      <div class="text-[10px] text-emerald-700 font-mono">TRX: EP-98721345</div>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-emerald-800">Rs. 10,000</span>
                </div>
              </div>

              <!-- Ready Callout -->
              <div class="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                Official enrollment granted after receipt approval by PVCC council.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- How It Works (4-Step Flow) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <h2 class="text-xs uppercase font-extrabold tracking-widest text-cricket-600">Simple 4-Step Process</h2>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How Team Enrollment Works</h3>
        <p class="text-sm text-slate-600">
          Everything is organized step-by-step so you can save players one by one without losing any information.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        
        <div class="card p-6 relative">
          <div class="w-10 h-10 rounded-xl bg-cricket-100 text-cricket-700 font-extrabold flex items-center justify-center mb-4 text-base">
            01
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Create Team</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Create a captain account and set up your team name, club or village, and primary WhatsApp contact.
          </p>
        </div>

        <div class="card p-6 relative">
          <div class="w-10 h-10 rounded-xl bg-cricket-100 text-cricket-700 font-extrabold flex items-center justify-center mb-4 text-base">
            02
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Add Players (11 to 15)</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Add players one-by-one with photo, CNIC front/back, playing role, and mark your designated Captain.
          </p>
        </div>

        <div class="card p-6 relative">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center mb-4 text-base">
            03
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Transfer Fee & Slip</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Send the Rs. 10,000 fee via EasyPaisa, JazzCash, or Bank, and upload the screenshot with transaction ID.
          </p>
        </div>

        <div class="card p-6 relative">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center mb-4 text-base">
            04
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Official Enrollment</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Management verifies the payment and player documents. Once approved, your team receives official enrollment!
          </p>
        </div>

      </div>
    </section>

    <!-- Payment Accounts Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div class="max-w-2xl">
          <span class="text-xs uppercase font-extrabold tracking-widest text-amber-400">Official Tournament Accounts</span>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 mb-3">
            Registration Fee Payment Methods
          </h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            Please transfer exactly <strong class="text-white">Rs. 10,000</strong> using any of the authorized accounts below. Keep your transaction ID and receipt screenshot ready to attach during registration.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          
          <!-- EasyPaisa Card -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">EasyPaisa Account</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Instant</span>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">Account Title</div>
              <div class="font-bold text-white text-sm">Ali Nawaz (PVCC Treasurer)</div>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">Mobile Number</div>
              <div class="flex items-center justify-between mt-1">
                <span class="font-mono text-lg font-extrabold text-amber-300 tracking-wider">0300-1234567</span>
                <button 
                  @click="copyToClipboard('03001234567', 'ep')" 
                  class="px-2.5 py-1 text-xs rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  {{ copiedAccount === 'ep' ? 'Copied! ✓' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- JazzCash Card -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400">JazzCash Account</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Instant</span>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">Account Title</div>
              <div class="font-bold text-white text-sm">Ali Nawaz</div>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">Mobile Number</div>
              <div class="flex items-center justify-between mt-1">
                <span class="font-mono text-lg font-extrabold text-amber-300 tracking-wider">0300-7654321</span>
                <button 
                  @click="copyToClipboard('03007654321', 'jc')" 
                  class="px-2.5 py-1 text-xs rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  {{ copiedAccount === 'jc' ? 'Copied! ✓' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Bank Account Card -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Meezan Bank Ltd.</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">IBAN</span>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">Account Title</div>
              <div class="font-bold text-white text-sm">Punjab Village Cricket Council</div>
            </div>
            <div>
              <div class="text-xs text-slate-400 font-medium">IBAN Number</div>
              <div class="flex items-center justify-between mt-1">
                <span class="font-mono text-xs font-bold text-amber-300 truncate max-w-[150px]">PK12MEZN0001020304050607</span>
                <button 
                  @click="copyToClipboard('PK12MEZN0001020304050607', 'bank')" 
                  class="px-2.5 py-1 text-xs rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  {{ copiedAccount === 'bank' ? 'Copied! ✓' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Tournament Guidelines & Rules Checklist -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="card p-6 sm:p-8">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-cricket-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mandatory Player & Registration Rules
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-emerald-600 font-bold text-sm">1.</span>
            <span><strong>Squad Size:</strong> Minimum 11 players and maximum 15 players allowed. No additions after final enrollment approval.</span>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-emerald-600 font-bold text-sm">2.</span>
            <span><strong>Identity Verification:</strong> Every player must have their National ID Card (CNIC/B-Form front and back) and a clear face photo uploaded.</span>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-emerald-600 font-bold text-sm">3.</span>
            <span><strong>Single Designated Captain:</strong> Exactly one player in each team's roster must be selected as Team Captain.</span>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-emerald-600 font-bold text-sm">4.</span>
            <span><strong>Payment Approval:</strong> Uploading a receipt sets your team to <em>PENDING</em>. Management reviews the transaction before marking your team as <em>ENROLLED</em>.</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-slate-500">
            Need assistance or have special eligibility inquiries? Contact the PVCC committee.
          </p>
          <router-link to="/register" class="btn-primary">
            Start Team Registration Now
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const copiedAccount = ref<string | null>(null);

const copyToClipboard = async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedAccount.value = id;
    setTimeout(() => {
      if (copiedAccount.value === id) {
        copiedAccount.value = null;
      }
    }, 2500);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};
</script>
