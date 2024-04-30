import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://qxinxsmiwfvlvprnouva.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aW54c21pd2Z2bHZwcm5vdXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxNDgxNDAsImV4cCI6MjAyNTcyNDE0MH0.1r__3NdlgaJuWbQIiL-hEIz6YfPO-4WpKNN5c3pW5hg')