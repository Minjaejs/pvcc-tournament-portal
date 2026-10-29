import { ref, computed } from 'vue';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserRole, AuthUser } from '../types';

const currentUser = ref<AuthUser | null>(null);
const authLoading = ref(true);

// Helper to reliably determine if user is an admin
async function resolveRole(userId: string, email?: string, metadataRole?: string): Promise<UserRole> {
  if (metadataRole === 'admin') return 'admin';

  if (isSupabaseConfigured()) {
    try {
      // 1. Check admin_profiles by user id
      const { data: adminById } = await supabase
        .from('admin_profiles')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();

      if (adminById) return 'admin';

      // 2. Fallback check by email (case-insensitive)
      if (email) {
        const { data: adminByEmail } = await supabase
          .from('admin_profiles')
          .select('id, role')
          .ilike('email', email.trim())
          .maybeSingle();

        if (adminByEmail) return 'admin';
      }
    } catch (e) {
      console.warn('Could not query admin_profiles:', e);
    }
  }

  return 'captain';
}

// Initialize auth state
export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  const isCaptain = computed(() => currentUser.value?.role === 'captain');

  const initAuth = async () => {
    authLoading.value = true;
    try {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const role = await resolveRole(
            session.user.id, 
            session.user.email, 
            session.user.user_metadata?.role
          );

          currentUser.value = {
            id: session.user.id,
            email: session.user.email || '',
            role,
          };
        } else {
          currentUser.value = null;
        }

        // Listen for changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const role = await resolveRole(
              session.user.id, 
              session.user.email, 
              session.user.user_metadata?.role
            );

            currentUser.value = {
              id: session.user.id,
              email: session.user.email || '',
              role,
            };
          } else {
            currentUser.value = null;
          }
        });
      } else {
        // Fallback for preview/development when Supabase is not connected yet
        const saved = localStorage.getItem('pvcc_demo_user');
        if (saved) {
          try {
            currentUser.value = JSON.parse(saved);
          } catch {
            currentUser.value = null;
          }
        }
      }
    } finally {
      authLoading.value = false;
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string; role?: UserRole }> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const role = await resolveRole(
          data.user.id, 
          data.user.email, 
          data.user.user_metadata?.role
        );
        currentUser.value = { id: data.user.id, email: data.user.email || '', role };
        return { role };
      }
      return {};
    } else {
      // Demo login
      const role: UserRole = (email.includes('admin') || email.includes('punjabvcc')) ? 'admin' : 'captain';
      const user: AuthUser = { id: 'demo-' + Date.now(), email, role };
      currentUser.value = user;
      localStorage.setItem('pvcc_demo_user', JSON.stringify(user));
      return { role };
    }
  };

  const signup = async (email: string, password: string, role: UserRole = 'captain'): Promise<{ error?: string }> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      if (error) return { error: error.message };
      if (data.user) {
        currentUser.value = { id: data.user.id, email: data.user.email || '', role };
      }
      return {};
    } else {
      // Demo signup
      const user: AuthUser = { id: 'demo-' + Date.now(), email, role };
      currentUser.value = user;
      localStorage.setItem('pvcc_demo_user', JSON.stringify(user));
      return {};
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    currentUser.value = null;
    localStorage.removeItem('pvcc_demo_user');
  };

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isCaptain,
    authLoading,
    initAuth,
    login,
    signup,
    logout,
  };
}
