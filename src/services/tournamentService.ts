import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Team, Player, Tournament } from '../types';
import { DEFAULT_TOURNAMENT } from '../constants/tournament';

// Key for mock local storage when Supabase is not connected
const STORAGE_KEY_TEAMS = 'pvcc_mock_teams';
const STORAGE_KEY_PLAYERS = 'pvcc_mock_players';

function getStoredMockTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredMockTeams(teams: Team[]) {
  localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
}

function getStoredMockPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAYERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredMockPlayers(players: Player[]) {
  localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
}

export const tournamentService = {
  /**
   * Fetch active tournament details
   */
  async getTournament(): Promise<Tournament> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', 'pvcc-season-4')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          season: data.season,
          organizer: data.organizer,
          feeAmount: Number(data.fee_amount),
          minPlayers: data.min_players,
          maxPlayers: data.max_players,
          registrationDeadline: data.registration_deadline,
          tournamentStartDate: '2026-11-20',
          venue: 'Central Cricket Ground, District Jhang',
          rules: data.rules,
          paymentInstructions: data.payment_instructions,
        };
      }
    }
    return DEFAULT_TOURNAMENT;
  },

  /**
   * Get team for current captain
   */
  async getCaptainTeam(userId: string): Promise<Team | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('teams')
        .select('*, players(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching captain team:', error);
      }
      return data;
    } else {
      const teams = getStoredMockTeams();
      const team = teams.find(t => t.user_id === userId);
      if (team) {
        const players = getStoredMockPlayers().filter(p => p.team_id === team.id);
        return { ...team, players, player_count: players.length };
      }
      return null;
    }
  },

  /**
   * Create team draft
   */
  async createTeam(teamData: {
    user_id: string;
    team_name: string;
    city: string;
    captain_name: string;
    captain_phone: string;
    captain_email?: string;
  }): Promise<{ data?: Team; error?: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          user_id: teamData.user_id,
          team_name: teamData.team_name,
          city: teamData.city,
          captain_name: teamData.captain_name,
          captain_phone: teamData.captain_phone,
          captain_email: teamData.captain_email,
          status: 'DRAFT',
        })
        .select()
        .single();

      if (error) return { error: error.message };
      return { data };
    } else {
      const teams = getStoredMockTeams();
      const newTeam: Team = {
        id: 'team-' + Date.now(),
        user_id: teamData.user_id,
        registration_code: 'PVCC-2026-' + String(teams.length + 1).padStart(4, '0'),
        team_name: teamData.team_name,
        city: teamData.city,
        captain_name: teamData.captain_name,
        captain_phone: teamData.captain_phone,
        captain_email: teamData.captain_email,
        status: 'DRAFT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        players: [],
        player_count: 0
      };
      teams.push(newTeam);
      saveStoredMockTeams(teams);
      return { data: newTeam };
    }
  },

  /**
   * Update team info
   */
  async updateTeam(teamId: string, updates: Partial<Team>): Promise<{ error?: string }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', teamId);
      if (error) return { error: error.message };
      return {};
    } else {
      const teams = getStoredMockTeams();
      const idx = teams.findIndex(t => t.id === teamId);
      if (idx !== -1) {
        teams[idx] = { ...teams[idx], ...updates, updated_at: new Date().toISOString() };
        saveStoredMockTeams(teams);
      }
      return {};
    }
  },

  /**
   * Fetch all players for a team
   */
  async getPlayers(teamId: string): Promise<Player[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('is_captain', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching players:', error);
        return [];
      }
      return data || [];
    } else {
      return getStoredMockPlayers().filter(p => p.team_id === teamId);
    }
  },

  /**
   * Add a player to a team
   */
  async addPlayer(player: Omit<Player, 'id' | 'created_at'>): Promise<{ data?: Player; error?: string }> {
    // 1. Strict documents verification
    if (!player.photo_url || !player.cnic_front_url || !player.cnic_back_url) {
      return { error: 'Player photo, CNIC front, and CNIC back images are all strictly required.' };
    }

    if (isSupabaseConfigured()) {
      // 2. Captain validation: Check if team already has a captain
      if (player.is_captain) {
        const { data: existingCaptain } = await supabase
          .from('players')
          .select('id, player_name')
          .eq('team_id', player.team_id)
          .eq('is_captain', true)
          .maybeSingle();

        if (existingCaptain) {
          return {
            error: `This team already has a designated captain (${existingCaptain.player_name}). A team can only have one captain.`
          };
        }
      }

      // 3. Unique CNIC check across the tournament
      const cleanCnic = player.cnic.trim();
      const { data: existingCnic } = await supabase
        .from('players')
        .select('id, player_name')
        .eq('cnic', cleanCnic)
        .maybeSingle();

      if (existingCnic) {
        return {
          error: `A player with CNIC (${cleanCnic}) is already registered as "${existingCnic.player_name}". Each player's CNIC must be unique.`
        };
      }

      const { data, error } = await supabase
        .from('players')
        .insert(player)
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('players_cnic_key')) {
          return { error: `A player with CNIC (${player.cnic}) is already registered in the tournament.` };
        }
        if (error.message?.includes('idx_players_unique_captain_per_team')) {
          return { error: 'This team already has a designated captain. You cannot assign another captain.' };
        }
        return { error: error.message };
      }
      return { data };
    } else {
      const players = getStoredMockPlayers();

      // Check captain
      if (player.is_captain) {
        const existingCaptain = players.find(p => p.team_id === player.team_id && p.is_captain);
        if (existingCaptain) {
          return {
            error: `This team already has a designated captain (${existingCaptain.player_name}). A team can only have one captain.`
          };
        }
      }

      // Check CNIC uniqueness
      const existingCnic = players.find(p => p.cnic === player.cnic);
      if (existingCnic) {
        return {
          error: `A player with CNIC (${player.cnic}) is already registered (${existingCnic.player_name}). Each player's CNIC must be unique.`
        };
      }

      const newPlayer: Player = {
        ...player,
        id: 'player-' + Date.now(),
        created_at: new Date().toISOString()
      };
      players.push(newPlayer);
      saveStoredMockPlayers(players);
      return { data: newPlayer };
    }
  },

  /**
   * Update an existing player
   */
  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<{ error?: string }> {
    // 1. Documents check on update
    if (
      (updates.photo_url !== undefined && !updates.photo_url) ||
      (updates.cnic_front_url !== undefined && !updates.cnic_front_url) ||
      (updates.cnic_back_url !== undefined && !updates.cnic_back_url)
    ) {
      return { error: 'Player photo, CNIC front, and CNIC back images cannot be empty.' };
    }

    if (isSupabaseConfigured()) {
      // 2. Captain validation
      if (updates.is_captain && updates.team_id) {
        const { data: existingCaptain } = await supabase
          .from('players')
          .select('id, player_name')
          .eq('team_id', updates.team_id)
          .eq('is_captain', true)
          .neq('id', playerId)
          .maybeSingle();

        if (existingCaptain) {
          return {
            error: `This team already has a designated captain (${existingCaptain.player_name}). A team can only have one captain.`
          };
        }
      }

      // 3. Unique CNIC check on update
      if (updates.cnic) {
        const cleanCnic = updates.cnic.trim();
        const { data: existingCnic } = await supabase
          .from('players')
          .select('id, player_name')
          .eq('cnic', cleanCnic)
          .neq('id', playerId)
          .maybeSingle();

        if (existingCnic) {
          return {
            error: `A player with CNIC (${cleanCnic}) is already registered as "${existingCnic.player_name}". Each player's CNIC must be unique.`
          };
        }
      }

      const { error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);

      if (error) {
        if (error.code === '23505' || error.message?.includes('players_cnic_key')) {
          return { error: `A player with CNIC (${updates.cnic}) is already registered in the tournament.` };
        }
        if (error.message?.includes('idx_players_unique_captain_per_team')) {
          return { error: 'This team already has a designated captain. You cannot assign another captain.' };
        }
        return { error: error.message };
      }
      return {};
    } else {
      const players = getStoredMockPlayers();
      const idx = players.findIndex(p => p.id === playerId);
      if (idx !== -1) {
        if (updates.is_captain) {
          const existingCaptain = players.find(p => p.team_id === players[idx].team_id && p.is_captain && p.id !== playerId);
          if (existingCaptain) {
            return {
              error: `This team already has a designated captain (${existingCaptain.player_name}). A team can only have one captain.`
            };
          }
        }

        if (updates.cnic) {
          const existingCnic = players.find(p => p.id !== playerId && p.cnic === updates.cnic);
          if (existingCnic) {
            return {
              error: `A player with CNIC (${updates.cnic}) is already registered (${existingCnic.player_name}). Each player's CNIC must be unique.`
            };
          }
        }

        players[idx] = { ...players[idx], ...updates };
        saveStoredMockPlayers(players);
      }
      return {};
    }
  },

  /**
   * Delete a player
   */
  async deletePlayer(playerId: string): Promise<{ error?: string }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
      if (error) return { error: error.message };
      return {};
    } else {
      const players = getStoredMockPlayers().filter(p => p.id !== playerId);
      saveStoredMockPlayers(players);
      return {};
    }
  },

  /**
   * Upload file to Supabase private bucket
   */
  async uploadDocument(
    bucket: 'player-documents' | 'payment-slips',
    path: string,
    file: File
  ): Promise<{ path?: string; error?: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) return { error: error.message };
      return { path: data.path };
    } else {
      // Mock upload for local preview: create data URL or fake path
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ path: reader.result as string });
        reader.onerror = () => resolve({ path: 'demo-local-preview.jpg' });
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Get secure download or signed preview URL for private bucket file
   */
  async getSecureUrl(bucket: 'player-documents' | 'payment-slips', path: string): Promise<string> {
    if (path.startsWith('data:image')) {
      return path; // Local data URL preview
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60); // 1 hour expiration
      if (error || !data) return '';
      return data.signedUrl;
    }
    return path;
  },

  /**
   * Submit team for verification (locks roster, sets status to PENDING)
   */
  async submitTeamRegistration(params: {
    teamId: string;
    paymentMethod: string;
    transactionId: string;
    paymentSlipUrl: string;
  }): Promise<{ success?: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('submit_team_registration', {
        p_team_id: params.teamId,
        p_payment_method: params.paymentMethod,
        p_transaction_id: params.transactionId,
        p_payment_slip_url: params.paymentSlipUrl,
      });

      if (error) return { error: error.message };
      return { success: data.success };
    } else {
      const teams = getStoredMockTeams();
      const idx = teams.findIndex(t => t.id === params.teamId);
      if (idx !== -1) {
        teams[idx].status = 'PENDING';
        teams[idx].payment_method = params.paymentMethod;
        teams[idx].transaction_id = params.transactionId;
        teams[idx].payment_slip_url = params.paymentSlipUrl;
        teams[idx].payment_submitted_at = new Date().toISOString();
        saveStoredMockTeams(teams);
      }
      return { success: true };
    }
  },

  /**
   * Get officially ENROLLED teams for public showcase
   */
  async getEnrolledTeams(): Promise<Team[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('teams')
        .select('*, players(count)')
        .eq('status', 'ENROLLED')
        .order('verified_at', { ascending: false });

      if (error) {
        console.error('Error fetching enrolled teams:', error);
        return [];
      }
      return (data || []).map(t => ({
        ...t,
        player_count: t.players?.[0]?.count || 0
      }));
    } else {
      const teams = getStoredMockTeams().filter(t => t.status === 'ENROLLED');
      const allPlayers = getStoredMockPlayers();
      return teams.map(t => ({
        ...t,
        player_count: allPlayers.filter(p => p.team_id === t.id).length
      }));
    }
  },

  /**
   * ADMIN: Fetch all registered teams with roster
   */
  async getAllTeamsForAdmin(): Promise<Team[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('teams')
        .select('*, players(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin teams:', error);
        return [];
      }
      return (data || []).map(t => ({
        ...t,
        player_count: t.players?.length || 0
      }));
    } else {
      const teams = getStoredMockTeams();
      const allPlayers = getStoredMockPlayers();
      return teams.map(t => ({
        ...t,
        players: allPlayers.filter(p => p.team_id === t.id),
        player_count: allPlayers.filter(p => p.team_id === t.id).length
      }));
    }
  },

  /**
   * ADMIN: 1-click Approve Team
   */
  async approveTeam(teamId: string, adminNotes?: string): Promise<{ success?: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('approve_team', {
        p_team_id: teamId,
        p_admin_notes: adminNotes || null,
      });

      if (error) return { error: error.message };
      return { success: data.success };
    } else {
      const teams = getStoredMockTeams();
      const idx = teams.findIndex(t => t.id === teamId);
      if (idx !== -1) {
        teams[idx].status = 'ENROLLED';
        teams[idx].verified_at = new Date().toISOString();
        saveStoredMockTeams(teams);
      }
      return { success: true };
    }
  },

  /**
   * ADMIN: Reject Team with Reason
   */
  async rejectTeam(teamId: string, reason: string): Promise<{ success?: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('reject_team', {
        p_team_id: teamId,
        p_rejection_reason: reason,
      });

      if (error) return { error: error.message };
      return { success: data.success };
    } else {
      const teams = getStoredMockTeams();
      const idx = teams.findIndex(t => t.id === teamId);
      if (idx !== -1) {
        teams[idx].status = 'REJECTED';
        teams[idx].rejection_reason = reason;
        saveStoredMockTeams(teams);
      }
      return { success: true };
    }
  }
};
