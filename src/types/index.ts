export type TeamStatus = 'DRAFT' | 'PENDING' | 'ENROLLED' | 'REJECTED';

export type PlayerRole = 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';

export type UserRole = 'captain' | 'admin';

export interface PaymentInstruction {
  id: string;
  method: 'easypaisa' | 'jazzcash' | 'bank';
  provider: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  note?: string;
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  organizer: string;
  feeAmount: number;
  minPlayers: number;
  maxPlayers: number;
  registrationDeadline: string;
  tournamentStartDate: string;
  venue: string;
  rules: string[];
  paymentInstructions: PaymentInstruction[];
}

export interface Player {
  id: string;
  team_id: string;
  player_name: string;
  father_name: string;
  cnic: string;
  dob: string;
  address: string;
  role: PlayerRole;
  seasons_played: string[]; // e.g. ['Season 1', 'Season 2']
  achievements_note?: string;
  is_captain: boolean;
  photo_url?: string;
  cnic_front_url?: string;
  cnic_back_url?: string;
  created_at?: string;
}

export interface Team {
  id: string;
  user_id: string;
  registration_code: string;
  team_name: string;
  city: string;
  captain_name: string;
  captain_phone: string;
  captain_email?: string;
  status: TeamStatus;
  rejection_reason?: string;
  payment_method?: string;
  transaction_id?: string;
  payment_slip_url?: string;
  payment_submitted_at?: string;
  verified_at?: string;
  verified_by?: string;
  created_at?: string;
  updated_at?: string;
  // Joined or client-aggregated data
  players?: Player[];
  player_count?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
