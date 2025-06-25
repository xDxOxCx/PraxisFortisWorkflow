# Step-by-Step Supabase Database Setup

## Step 1: Access Your Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Click on your project: **drfgolabfqynwkoatcim**

## Step 2: Open SQL Editor
1. In the left sidebar, click on **SQL Editor**
2. Click the **New Query** button (green plus icon)
3. You'll see a blank SQL editor

## Step 3: Copy and Paste This Exact SQL Script
Copy everything below and paste it into the SQL editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE TABLE IF NOT EXISTS public.workflows (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.templates (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  flow_data jsonb NOT NULL,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert sample templates
INSERT INTO public.templates (name, description, category, flow_data, icon) VALUES
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

## Step 4: Run the Script
1. Click the **Run** button (or press Ctrl+Enter)
2. You should see "Success. No rows returned" or similar success message
3. If you see any errors, let me know exactly what they say

## Step 5: Enable Google Authentication
1. In the left sidebar, click on **Authentication**
2. Click on **Providers**
3. Find **Google** in the list and click on it
4. Toggle the **Enable sign in with Google** switch to ON
5. You can use the default settings for now

## Step 6: Test the Setup
1. Go back to your application at the Replit URL
2. Try clicking the "Sign In" button
3. You should be able to sign in with Google
4. After signing in, you should see the dashboard

## What to Expect
- The landing page should load correctly
- "Sign In" button should redirect to Google OAuth
- After successful login, you'll see the main dashboard
- You can create workflows and use all features

Let me know when you've completed these steps or if you encounter any issues!