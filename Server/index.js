const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://fvilglklgsllkcpzasaa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWxnbGtsZ3NsbGtjcHphc2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2Mjc3NzgsImV4cCI6MTk5MDIwMzc3OH0.5A_E3MTPnHRU47kAG0EfOZnSTM-j6ewu6Euv_kmG-l8"
);
const main = async () => {
  let { data, error } = await supabase
    .from("countries")
    .select("id,name,continent")
    .eq("continent", "Oceania");
   // .eq('id', '272')
  //.eq("id", "3");
  //.like("name", "%Island%");
  //.or("name.like.Z%, name.like.Q%");
  //.is("continent", null);

  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
};

const update = async () => {
  let { data, error } = await supabase
    .from("countries")
    .update({ continent: "Europe" })
    .eq("name", "Jersey");
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
};

const insert = async () => {
  let { data, error } = await supabase
    .from("countries")
    .insert([{ name: "Iran1", continent: "Oceania", iso2: "Ir" }]).select();

  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
};
const deleteItem = async () => {
  const { data,error } = await supabase
    .from("countries")
    .delete()
    .eq('name', 'Iran1').select()

  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
};


const upsert=async()=>{
  const {data,error}=await supabase.from('countries').upsert([{ name: "Iran1", continent: "Oceania", iso2: "Ir" }]).select();
}


main();
