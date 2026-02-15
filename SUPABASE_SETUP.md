# Supabase Setup Guide

## ✅ Configuration

### 1. **Environment Variables**
Ensure your `.env` file contains:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

For reference, check [`.env.example`](.env.example)

### 2. **Get Your Credentials**

1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new project or select an existing one
3. Navigate to **Settings → API** (or **Project Settings → API**)
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### 3. **Required Database Tables**

Create these tables in your Supabase project:

#### `items` table
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `orders` table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  counter_number INTEGER NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### `order_items` table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 4. **Enable RLS policies (required for order status updates)**

If accepting orders shows "Order status could not be updated" or RLS errors:

1. In Supabase go to **SQL Editor** → **New query**
2. Open the file `SUPABASE_RLS_FIX.sql` in this project, copy all its contents
3. Paste into the SQL Editor and click **Run**
4. You should see "Success. No rows returned." Policies are now in place for `orders`, `order_items`, and `items`

Without these policies, the anon key cannot UPDATE the `orders` table (e.g. set status to "accepted").

### 5. **Optional: Item images (admin Add Item)**

To use the optional picture when adding menu items:

1. Run `SUPABASE_ADD_ITEM_IMAGE.sql` in the SQL Editor (adds `image_url` column to `items`).
2. For **file upload**: In Supabase go to **Storage** → **New bucket** → Name: `item-images`, set to **Public** → Create. Then add a policy that allows insert/update for your auth (e.g. "Allow all" for anon if your app uses anon key for uploads).

## 🔧 Troubleshooting

### Connection Fails
- ✅ Verify `.env` variables are set correctly
- ✅ Check your Supabase project URL starts with `https://`
- ✅ Ensure Anon Key is not empty and properly formatted

### "Table not found" Error
- ✅ Confirm tables are created in your Supabase project
- ✅ Check table and column naming matches exactly

### Real-time Updates Not Working
- ✅ Enable Realtime in Supabase: **Project Settings → Realtime → Enable Realtime for tables**
- ✅ Ensure the table has `INSERT`, `UPDATE`, `DELETE` replications enabled

### CORS Issues
- ✅ Go to **Project Settings → API → CORS**
- ✅ Add your application URL to allowed origins

## 📝 Error Messages & Solutions

| Error | Solution |
|-------|----------|
| `Missing VITE_SUPABASE_URL` | Add to `.env` file |
| `Missing VITE_SUPABASE_ANON_KEY` | Add to `.env` file |
| `Invalid VITE_SUPABASE_URL` | Must start with `https://` |
| `Failed to fetch items` | Check internet connection and Supabase status |
| `Error creating order` | Check `orders` table exists with correct schema |
| `Order status could not be updated` / RLS | Run `SUPABASE_RLS_FIX.sql` in Supabase SQL Editor (see step 4 above) |

## 🐛 Debug Mode

Check the browser console (F12) for detailed error messages:
- ✅ symbols indicate successful operations
- ⚠️ symbols indicate warnings
- ❌ symbols indicate errors

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Supabase SQL Editor](https://app.supabase.com/project/_/editor)
