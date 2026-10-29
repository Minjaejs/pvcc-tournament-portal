# Supabase Setup Guide for PVCC Cricket Tournament System

Follow these simple steps to configure your 100% free Supabase backend.

---

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and click **"Start your project"**.
2. Name your project (e.g. `pvcc-cricket-championship`).
3. Set a strong database password and pick the region closest to Pakistan (e.g. `Singapore` or `Mumbai`).
4. Click **Create new project** (takes ~1-2 minutes).

---

### Step 2: Run the Database Migration
1. In your Supabase project dashboard, click on **SQL Editor** in the left sidebar.
2. Click **"+ New Query"**.
3. Open the file [`supabase/migrations/20261027000000_cricket_tournament_schema.sql`](file:///home/abdul-hannan/Documents/cricket-tournament-reg-system/supabase/migrations/20261027000000_cricket_tournament_schema.sql).
4. Copy the entire SQL content and paste it into the Supabase SQL Editor.
5. Click **"Run"** (or press Ctrl + Enter).
   * It will create all tables (`tournaments`, `teams`, `players`, `admin_profiles`, `registration_events`).
   * It will configure strict **Row Level Security (RLS)**.
   * It will create the **private storage buckets** (`player-documents` and `payment-slips`).
   * It will register atomic procedures: `submit_team_registration`, `approve_team`, and `reject_team`.

---

### Step 3: Disable "Confirm Email" for Instant Captain Signups
To allow captains to register immediately on their phone without email verification delay:
1. In the Supabase sidebar, go to **Authentication** ➔ **Providers** ➔ **Email**.
2. Toggle **OFF** the switch: **"Confirm email"**.
3. Click **Save**.

---

### Step 4: Create the Tournament Organizer Admin User
1. In Supabase sidebar, go to **Authentication** ➔ **Users**.
2. Click **"Add user"** ➔ **"Create user"**.
3. Enter your cousin's email (e.g. `admin@pvcc.pk`) and a secure password.
4. After the user is created, copy their **User UID** (a UUID like `11111111-2222-3333-4444-555555555555`).
5. Open **SQL Editor**, run this one-line command to grant them Admin privileges:
   ```sql
   INSERT INTO public.admin_profiles (id, email, full_name, role)
   VALUES (
     'PASTE_USER_UID_HERE',
     'admin@pvcc.pk',
     'Tournament Director',
     'superadmin'
   );
   ```

---

### Step 5: Connect Environment Variables
1. In Supabase sidebar, go to **Project Settings** (gear icon) ➔ **API**.
2. Copy:
   * **Project URL**
   * **anon / public** API key
3. In your project root, create a file named `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Restart your Vite dev server:
   ```bash
   npm run dev
   ```

You are now completely ready to manage live team enrollments!
