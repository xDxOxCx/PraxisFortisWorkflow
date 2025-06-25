# Supabase Database Setup Instructions

**IMPORTANT**: The database tables need to be created manually in your Supabase dashboard for the application to work properly.

Connection string: `postgresql://postgres.drfgolabfqynwkoatcim:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres`

## Required Setup Steps:

## 1. Go to Supabase SQL Editor
1. Open your Supabase project dashboard at https://supabase.com/dashboard
2. Click on your project: `drfgolabfqynwkoatcim`
3. Navigate to the SQL Editor section in the left sidebar
4. Click "New Query"

## 2. Copy and Run the Database Setup Script
Copy and paste the following SQL script to create the necessary tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE,
  first_name text,
  last_name text,
  profile_image_url text,
  subscription_status text DEFAULT 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  monthly_workflows integer DEFAULT 0,
  total_workflows integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  flow_data jsonb NOT NULL,
  ai_analysis jsonb,
  mermaid_code text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  flow_data jsonb NOT NULL,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to increment workflow usage
CREATE OR REPLACE FUNCTION increment_workflow_usage(user_id text)
RETURNS users AS $$
DECLARE
  updated_user users;
BEGIN
  UPDATE users 
  SET 
    monthly_workflows = monthly_workflows + 1,
    total_workflows = total_workflows + 1,
    updated_at = timezone('utc'::text, now())
  WHERE id = user_id
  RETURNING * INTO updated_user;
  
  RETURN updated_user;
END;
$$ LANGUAGE plpgsql;

-- Insert sample templates
INSERT INTO templates (name, description, category, flow_data, icon) VALUES
(
  'Patient Check-in Process',
  'Streamlined patient registration and check-in workflow for medical practices',
  'Healthcare',
  '{"nodes":[{"id":"1","type":"start","position":{"x":100,"y":100},"data":{"label":"Patient Arrival"}},{"id":"2","type":"process","position":{"x":100,"y":200},"data":{"label":"Digital Check-in"}},{"id":"3","type":"decision","position":{"x":100,"y":300},"data":{"label":"Insurance Verification"}},{"id":"4","type":"end","position":{"x":100,"y":400},"data":{"label":"Ready for Provider"}}],"edges":[{"id":"e1-2","source":"1","target":"2"},{"id":"e2-3","source":"2","target":"3"},{"id":"e3-4","source":"3","target":"4"}]}',
  'user-check'
),
(
  'Appointment Scheduling',
  'Efficient appointment booking and confirmation process',
  'Healthcare',
  '{"nodes":[{"id":"1","type":"start","position":{"x":100,"y":100},"data":{"label":"Schedule Request"}},{"id":"2","type":"process","position":{"x":100,"y":200},"data":{"label":"Check Availability"}},{"id":"3","type":"decision","position":{"x":100,"y":300},"data":{"label":"Confirm Appointment"}},{"id":"4","type":"end","position":{"x":100,"y":400},"data":{"label":"Send Confirmation"}}],"edges":[{"id":"e1-2","source":"1","target":"2"},{"id":"e2-3","source":"2","target":"3"},{"id":"e3-4","source":"3","target":"4"}]}',
  'calendar'
)
ON CONFLICT DO NOTHING;
```

## 3. Enable Google OAuth
1. In your Supabase project dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your OAuth credentials if needed

## 4. Set Row Level Security (Optional)
For better security, you can enable RLS policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can read own workflows" ON workflows FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own workflows" ON workflows FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own workflows" ON workflows FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own workflows" ON workflows FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Templates are readable by all authenticated users" ON templates FOR SELECT TO authenticated;
```

## 3. Enable Google OAuth (Required)
1. In your Supabase dashboard, go to Authentication > Providers
2. Find Google and click to configure it
3. Enable the Google provider
4. Add these URLs to your Google OAuth configuration:
   - Authorized redirect URI: `https://drfgolabfqynwkoatcim.supabase.co/auth/v1/callback`

## 4. Test the Setup
After running the SQL script and enabling Google OAuth:
1. Your application should be able to authenticate users
2. Users can create and manage workflows
3. Database operations will work properly

**Status**: The Supabase integration is complete on the application side. The database tables just need to be created using the SQL script above.