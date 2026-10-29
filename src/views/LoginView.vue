<template>
  <div class="max-w-md mx-auto my-10 px-4">
    <div class="card p-6 sm:p-8">
      
      <!-- Card Header -->
      <div class="text-center space-y-2 mb-6">
        <img 
          src="/logo.png" 
          alt="Punjab Village Cricket Council Logo" 
          class="h-16 w-auto object-contain mx-auto mb-2" 
        />
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
          {{ isSignUp ? 'Create Captain Account' : 'Portal Login' }}
        </h2>
        <p class="text-xs text-slate-500">
          {{ isSignUp ? 'Sign up to register and manage your tournament team' : 'Log in to your squad dashboard or admin panel' }}
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login / Signup Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="form-label" for="email">Email Address</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            placeholder="captain@example.com"
            class="form-input"
          />
        </div>

        <div>
          <label class="form-label" for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            minlength="6"
            placeholder="••••••••"
            class="form-input"
          />
        </div>

        <div v-if="isSignUp" class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <div class="font-semibold text-slate-800 mb-1">Instant Account Setup</div>
          No email confirmation required. You will be logged in immediately to start adding your team.
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full btn-primary !py-3"
        >
          <span v-if="loading" class="animate-spin mr-2">⏳</span>
          {{ isSignUp ? 'Create Account & Continue' : 'Log In' }}
        </button>
      </form>

      <!-- Toggle Sign In / Sign Up -->
      <div class="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
        <span v-if="isSignUp">
          Already have an account? 
          <button type="button" @click="isSignUp = false" class="text-cricket-700 font-bold hover:underline ml-1">
            Sign In
          </button>
        </span>
        <span v-else>
          Need to register a team? 
          <button type="button" @click="isSignUp = true" class="text-cricket-700 font-bold hover:underline ml-1">
            Create Captain Account
          </button>
        </span>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login, signup, isAdmin, currentUser } = useAuth();

const isSignUp = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

onMounted(() => {
  if (currentUser.value) {
    if (isAdmin.value) {
      router.replace('/admin');
    } else {
      router.replace('/my-team');
    }
  }
});

const handleSubmit = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    if (isSignUp.value) {
      const res = await signup(email.value, password.value, 'captain');
      if (res.error) {
        errorMessage.value = res.error;
        return;
      }
      router.push('/my-team');
    } else {
      const res = await login(email.value, password.value);
      if (res.error) {
        errorMessage.value = res.error;
        return;
      }
      if (res.role === 'admin' || isAdmin.value) {
        router.push('/admin');
      } else {
        router.push('/my-team');
      }
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An error occurred during authentication.';
  } finally {
    loading.value = false;
  }
};

</script>
