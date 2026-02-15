-- Optional: Add image column for menu items (for admin "Add Item" picture)
-- Run in Supabase SQL Editor if you use the optional image feature

ALTER TABLE items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Optional: Create a Storage bucket for item images (do this in Dashboard if you use file upload)
-- Storage → New bucket → Name: item-images → Public bucket: Yes
-- Then in Storage → item-images → Policies → New policy: Allow public read, and allow authenticated/anon insert if needed
