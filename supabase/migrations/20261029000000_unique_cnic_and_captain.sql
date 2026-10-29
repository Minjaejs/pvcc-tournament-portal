-- PVCC Season 35: Database constraints for unique CNIC and single captain per squad

-- 1. Deduplicate any test entries that may share the same CNIC (keeps the latest created entry)
DELETE FROM public.players a USING public.players b
WHERE a.id < b.id AND a.cnic = b.cnic;

-- 2. Add Unique constraint on CNIC so no two players across the tournament can share the same CNIC
ALTER TABLE public.players
  DROP CONSTRAINT IF EXISTS players_cnic_key;

ALTER TABLE public.players
  ADD CONSTRAINT players_cnic_key UNIQUE (cnic);

-- 3. Add Partial Unique Index: Exactly one captain per squad
-- Prevents race conditions or direct inserts of multiple captains for the same team
DROP INDEX IF EXISTS public.idx_players_unique_captain_per_team;

CREATE UNIQUE INDEX idx_players_unique_captain_per_team
  ON public.players (team_id)
  WHERE (is_captain = true);
