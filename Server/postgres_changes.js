const { createClient } = require("@supabase/supabase-js");
const clientA = createClient(
  "https://fvilglklgsllkcpzasaa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWxnbGtsZ3NsbGtjcHphc2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2Mjc3NzgsImV4cCI6MTk5MDIwMzc3OH0.5A_E3MTPnHRU47kAG0EfOZnSTM-j6ewu6Euv_kmG-l8"
);


   clientA
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table:'countries',
      filter:'id=eq.7'
    },
    (payload) => console.log(payload)
  )
  .subscribe()
