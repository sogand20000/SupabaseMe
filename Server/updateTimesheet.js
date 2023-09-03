const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var localizedFormat = require("dayjs/plugin/localizedFormat");
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
const supabase = createClient(
  "https://nahgfivlpvjbhsaqdxgf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haGdmaXZscHZqYmhzYXFkeGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcwNTEwOTEsImV4cCI6MTk5MjYyNzA5MX0.nMhE50WJz_UKNU_Cu5IYKZ8G0oZSYfyYSM_DnXCu458"
);

/* const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
); */
supabase
  .channel("schema-db-changes")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "events",
    },
    (payload) => {
      upsert(payload);
    }
  )
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "events",
    },
    (payload) => {
      upsert(payload);
    }
  )
  .subscribe();

async function getTimesheet(payload) {
  let { data: timesheets, error: timesheetsError } = await supabase
    .from("timesheets")
    .select("*")
    .eq("eventId", payload.new.id);

  if (timesheets[0] != null) return timesheets[0].id;
  else return null;
}

async function upsert(payload) {
  console.log("payload1", payload);

  var date = dayjs
    .utc(payload.new.endTime)
    .tz("Asia/Tehran")
    .format("YYYY-MM-DD");

  var endTime = dayjs
    .utc(payload.new.endTime)
    .tz("Asia/Tehran")
    .format("HH:mm");

  var startTime = dayjs
    .utc(payload.new.startTime)
    .tz("Asia/Tehran")
    .format("HH:mm");
  let item;

  if (payload.eventType == "UPDATE") {
    let timesheetId = await getTimesheet(payload);
    if (timesheetId != null) {
      item = {
        id: timesheetId,
        title: payload.new.name,
        startTime: startTime,
        endTime: endTime,
        date: date,
        eventId: payload.new.id,
      };
    } else {
      console.log('error:"Timesheet not exist"');
    }
  } else if (payload.eventType == "INSERT") {
    item = {
      title: payload.new.name,
      startTime: startTime,
      endTime: endTime,
      date: date,
      eventId: payload.new.id,
    };
  }

  const { data, error } = await supabase
    .from("timesheets")

    .upsert(item)

    .select();

  if (error != null) {
    console.log(error);
  } else {
    console.log(data);
  }
}
