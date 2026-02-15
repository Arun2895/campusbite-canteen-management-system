-- Fix RLS (Row Level Security) for orders table updates
-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- PostgreSQL does NOT support "CREATE POLICY IF NOT EXISTS", so we drop then create.

BEGIN;

-- ========== ORDERS TABLE ==========
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_select_orders" ON orders;
CREATE POLICY "allow_select_orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_insert_orders" ON orders;
CREATE POLICY "allow_insert_orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_update_orders" ON orders;
CREATE POLICY "allow_update_orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_delete_orders" ON orders;
CREATE POLICY "allow_delete_orders" ON orders FOR DELETE USING (true);

-- ========== ORDER_ITEMS TABLE ==========
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_select_order_items" ON order_items;
CREATE POLICY "allow_select_order_items" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_insert_order_items" ON order_items;
CREATE POLICY "allow_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_update_order_items" ON order_items;
CREATE POLICY "allow_update_order_items" ON order_items FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_delete_order_items" ON order_items;
CREATE POLICY "allow_delete_order_items" ON order_items FOR DELETE USING (true);

-- ========== ITEMS TABLE ==========
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_select_items" ON items;
CREATE POLICY "allow_select_items" ON items FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_insert_items" ON items;
CREATE POLICY "allow_insert_items" ON items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_update_items" ON items;
CREATE POLICY "allow_update_items" ON items FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_delete_items" ON items;
CREATE POLICY "allow_delete_items" ON items FOR DELETE USING (true);

COMMIT;
