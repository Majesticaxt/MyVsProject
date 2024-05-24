
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yjttavjvhdpiwuxyeuol.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHRhdmp2aGRwaXd1eHlldW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NjA2ODUsImV4cCI6MjAyODIzNjY4NX0.EtYnZDb1EQ9qnN_dekIctRfOjHBGrms0WBC41x5g6kc'
export const supabase = createClient(supabaseUrl, supabaseKey)
