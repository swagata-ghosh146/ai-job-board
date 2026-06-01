import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tvufyfijralzxfysqecr.supabase.co'
const supabaseKey = 'sb_publishable_09Tsqim4I2k7oJTVxhUynQ_W6D3zvcZ'

export const supabase = createClient(supabaseUrl, supabaseKey)