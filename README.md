# Punjab Village Cricket Council (PVCC) — Season 35 Portal 🏏

Official online tournament registration, roster management, and committee verification portal for Punjab Village Cricket Council (PVCC) Championship Season 35.

## 🌟 Key Features

### For Team Captains
- **Squad Builder:** Register team name, district, and manage 11 to 15 players with designated captain.
- **Player Details:** Name, Father's Name, CNIC / B-Form (`33202-XXXXXXX-X`), Date of Birth, Playing Role, and Achievements.
- **Client-Side Image Compressor:** Automatically compresses player photos and CNIC front/back documents down to ~150 KB directly in the browser before upload to avoid mobile timeouts.
- **Fee Payment Submission:** Submit payment method (EasyPaisa, JazzCash, Bank Transfer) with transaction ID and payment slip upload.
- **Live Status Tracking:** Real-time feedback on team approval, enrolled status, or committee review notes.

### For Organizing Committee (Admins)
- **Verification Dashboard:** Key metrics for total registrations, pending reviews, enrolled teams, and verified fee pool.
- **Audit Modal:** Review player profiles, inspect high-res photos and CNIC cards via lightbox preview, verify transaction ID, and open direct captain WhatsApp chat.
- **1-Click Approvals & Rejections:** Approve and officially enroll teams or reject with structured feedback.
- **Match-Day Export:** 1-click export of officially enrolled team rosters and contact details to CSV for match scoreboards.

### Public Directory
- **Enrolled Teams Directory:** Public directory of qualified teams with search and squad cards.

## 🛠️ Tech Stack
- **Frontend:** Vue 3 (Composition API, `<script setup>`), Vite, TypeScript, Tailwind CSS
- **Backend / Database:** Supabase (PostgreSQL, Supabase Storage, Supabase Auth, Row Level Security)
- **Deployment:** Vercel

## 🚀 Local Development Setup

1. **Clone repository:**
   ```bash
   git clone <repo-url>
   cd cricket-tournament-reg-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
