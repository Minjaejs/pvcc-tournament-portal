<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div>
            <h3 class="text-base font-bold text-slate-900" id="modal-title">
              {{ title || 'Document Preview' }}
            </h3>
            <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
              {{ subtitle }}
            </p>
          </div>
          <button 
            type="button" 
            class="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Document Image Content -->
        <div class="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[300px] max-h-[70vh] overflow-auto">
          <img 
            v-if="imageUrl" 
            :src="imageUrl" 
            :alt="title" 
            class="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
          />
          <div v-else class="text-center text-slate-400 py-12">
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs">No image preview available for this document.</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50">
          <div class="text-xs text-slate-500">
            Protected under PVCC Tournament Privacy Policy
          </div>
          <div class="flex items-center gap-2">
            <a 
              v-if="imageUrl" 
              :href="imageUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-secondary !text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Full Size
            </a>
            <button type="button" class="btn-primary !text-xs !py-1.5 !px-4" @click="close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};
</script>
