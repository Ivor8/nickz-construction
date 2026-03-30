import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://bkxxpzsquvgbkdazrbno.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZiZjc3ZmM5LTMzOGItNDU2MC04NDZjLWUyZjViNDM0OWY1MSJ9.eyJwcm9qZWN0SWQiOiJia3h4cHpzcXV2Z2JrZGF6cmJubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc0ODc4MTM1LCJleHAiOjIwOTAyMzgxMzUsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.xt31ZBOk3DvAdMj9Wr97NEyxcNLqmAdtqVbHzdHAZB4';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };