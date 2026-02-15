-- Fix RLS (Row Level Security) for orders table updates
-- This allows admins to accept/update orders

-- First, ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT orders (read)
CREATE POLICY IF NOT EXISTS "allow_select_orders"
ON orders FOR SELECT
USING (true);

-- Allow anyone to INSERT orders (create)
CREATE POLICY IF NOT EXISTS "allow_insert_orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Allow anyone to UPDATE orders (edit status)
CREATE POLICY IF NOT EXISTS "allow_update_orders"
ON orders FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to DELETE orders
CREATE POLICY IF NOT EXISTS "allow_delete_orders"
ON orders FOR DELETE
USING (true);

-- Do the same for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "allow_select_order_items"
ON order_items FOR SELECT
USING (true);

CREATE POLICY IF NOT EXISTS "allow_insert_order_items"
ON order_items FOR INSERT
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "allow_update_order_items"
ON order_items FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "allow_delete_order_items"
ON order_items FOR DELETE
USING (true);

-- Do the same for items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "allow_select_items"
ON items FOR SELECT
USING (true);

CREATE POLICY IF NOT EXISTS "allow_insert_items"
ON items FOR INSERT
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "allow_update_items"
ON items FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "allow_delete_items"
ON items FOR DELETE
USING (true);
