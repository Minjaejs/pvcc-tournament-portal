import type { Tournament } from '../types';

export const DEFAULT_TOURNAMENT: Tournament = {
  id: 'pvcc-season-35',
  name: 'Punjab Village Cricket Council (PVCC)',
  season: 'Season 35 Championship 2026',
  organizer: 'Punjab Village Cricket Council Management Committee',
  feeAmount: 10000,
  minPlayers: 11,
  maxPlayers: 15,
  registrationDeadline: 'Nov 15, 2026',
  tournamentStartDate: 'Nov 20, 2026',
  venue: 'Central Cricket Ground, District Jhang',
  rules: [
    'Minimum 11 and maximum 15 registered players per squad.',
    'Clear CNIC Front & Back and passport-style photo required for every player.',
    'Only 1 designated Captain per squad.',
    'Registration fee must be transferred via EasyPaisa, JazzCash, or Bank.',
    'Official enrollment is granted only after management verifies the payment receipt.',
    'No player can be enrolled in multiple teams during the same tournament.'
  ],
  paymentInstructions: [
    {
      id: 'ep-1',
      method: 'easypaisa',
      provider: 'EasyPaisa',
      accountTitle: 'Ali Nawaz (PVCC Treasurer)',
      accountNumber: '03001234567',
      note: 'Please mention your Team Name in the payment remarks.'
    },
    {
      id: 'jc-1',
      method: 'jazzcash',
      provider: 'JazzCash',
      accountTitle: 'Ali Nawaz',
      accountNumber: '03007654321',
      note: 'Save screenshot of the successful transaction slip.'
    },
    {
      id: 'bank-1',
      method: 'bank',
      provider: 'Meezan Bank Ltd.',
      accountTitle: 'Punjab Village Cricket Council',
      accountNumber: '01020304050607',
      iban: 'PK12MEZN0001020304050607',
      note: 'IBAN transfer supported from any Pakistani banking app.'
    }
  ]
};
