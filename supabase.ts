import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvbaneclqphnreaiooov.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2YmFuZWNscXBobnJlYWlvb292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjA5MjUsImV4cCI6MjA5NzE5NjkyNX0.BepEaL-KOiSQ23ttnMJrzusaYq4ElinBqW2R1kqt-CY'

export const supabase = createClient(supabaseUrl, supabaseKey)