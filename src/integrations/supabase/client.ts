// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xxcgpoksxyqbxheonash.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Y2dwb2tzeHlxYnhoZW9uYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MTE3OTEsImV4cCI6MjA2MDI4Nzc5MX0.3GBhUMFkurFbVnXYXJO5mY9v1e0Cq-JnQvgjFSNsQSM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);