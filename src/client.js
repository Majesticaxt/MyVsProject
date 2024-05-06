
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ioynkpwscfbxocvvarzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveW5rcHdzY2ZieG9jdnZhcnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2Njk1NTcsImV4cCI6MjAyODI0NTU1N30.TXEFSm1UXVK51iNUL5JHPlfFPWvCoVlU0gj2G7NOaD8'
export const supabase = createClient(supabaseUrl, supabaseKey)
// changes from github
