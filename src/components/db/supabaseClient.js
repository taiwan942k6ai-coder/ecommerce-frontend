import { createClient } from '@supabase/supabase-js'

// 這裡的 URL 和 Anon Key 請到 Supabase 後台的 Settings -> API 複製
const supabaseUrl = 'https://yxshqhkjfkljnnhwgbod.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)