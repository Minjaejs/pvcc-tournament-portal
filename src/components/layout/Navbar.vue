<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Logo & Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Punjab Village Cricket Council Logo" 
            class="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200 shrink-0" 
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">PVCC</span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Season 35</span>
            </div>
            <p class="text-xs text-slate-500 font-medium hidden sm:block">Punjab Village Cricket Council</p>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <router-link 
            to="/" 
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            :class="$route.path === '/' ? 'text-cricket-700 bg-cricket-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'"
          >
            Home
          </router-link>

          <router-link 
            to="/teams" 
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            :class="$route.path === '/teams' ? 'text-cricket-700 bg-cricket-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'"
          >
            Enrolled Teams
          </router-link>

          <router-link 
            v-if="isAuthenticated && isCaptain"
            to="/my-team" 
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            :class="$route.path === '/my-team' ? 'text-cricket-700 bg-cricket-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'"
          >
            My Squad
          </router-link>

          <router-link 
            v-if="isAuthenticated && isAdmin"
            to="/admin" 
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors text-amber-700 hover:bg-amber-50"
            :class="$route.path.startsWith('/admin') ? 'bg-amber-100/70 font-bold' : ''"
          >
            Admin Panel
          </router-link>
        </nav>

        <!-- Desktop Action Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn-secondary !py-2 text-xs">
              Captain / Admin Login
            </router-link>
            <router-link to="/register" class="btn-primary !py-2 text-xs">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Register Team
            </router-link>
          </template>

          <template v-else>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <span class="w-2 h-2 rounded-full" :class="isAdmin ? 'bg-amber-500' : 'bg-emerald-500'"></span>
              <span class="text-xs font-medium text-slate-700 max-w-[140px] truncate">{{ currentUser?.email }}</span>
              <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" :class="isAdmin ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'">
                {{ currentUser?.role }}
              </span>
            </div>

            <button @click="handleLogout" class="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              Logout
            </button>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
      <router-link 
        to="/" 
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
      >
        Home
      </router-link>

      <router-link 
        to="/teams" 
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
      >
        Enrolled Teams
      </router-link>

      <router-link 
        v-if="isAuthenticated && isCaptain"
        to="/my-team" 
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
      >
        My Squad
      </router-link>

      <router-link 
        v-if="isAuthenticated && isAdmin"
        to="/admin" 
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-base font-bold text-amber-700 bg-amber-50"
      >
        Admin Panel
      </router-link>

      <div class="pt-3 border-t border-slate-100 space-y-2">
        <template v-if="!isAuthenticated">
          <router-link 
            to="/register" 
            @click="isMobileMenuOpen = false"
            class="w-full btn-primary"
          >
            Register Team
          </router-link>
          <router-link 
            to="/login" 
            @click="isMobileMenuOpen = false"
            class="w-full btn-secondary"
          >
            Login
          </router-link>
        </template>
        <template v-else>
          <div class="text-xs text-slate-500 px-1 py-1">Logged in as: <strong class="text-slate-800">{{ currentUser?.email }}</strong></div>
          <button 
            @click="handleLogout" 
            class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            Log Out
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { currentUser, isAuthenticated, isAdmin, isCaptain, logout } = useAuth();
const isMobileMenuOpen = ref(false);

const handleLogout = async () => {
  await logout();
  isMobileMenuOpen.value = false;
  router.push('/');
};
</script>
