const { createClient } = require("@supabase/supabase-js");
const https = require("https");

const supabase = createClient(
  "https://nahgfivlpvjbhsaqdxgf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haGdmaXZscHZqYmhzYXFkeGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcwNTEwOTEsImV4cCI6MTk5MjYyNzA5MX0.nMhE50WJz_UKNU_Cu5IYKZ8G0oZSYfyYSM_DnXCu458"
);

const insert = async () => {
  /// Get data from pipedream

  let events;

  const options = {
    hostname: "api.pipedream.com",
    port: 443,

    path: "/v1/sources/dc_J4ue0xA/event_summaries",
    headers: {
      Authorization: "Bearer 340afc30d8661946eb7adf453fbbbde7",
    },
  };

  const req = https
    .request(options, (resp) => {
      let t1 = "";
      resp.on("data", (chunk) => {
        t1 += chunk;
      });
      resp.on("end", async () => {
        //insert data to supabase database event table
        events = JSON.parse(t1).data;

        let items = [];
        events.forEach((element) => {
          let i = {
            eventId: element.event["id"],
            name: element.event["summary"],
            startTime: element.event.start.dateTime,
            endTime: element.event.end.dateTime,
            location: "NULL",
            summary: "NULL",
            status: "NULL",
            description: "NULL",
            calendarId: element.event.organizer.email,
          };
          items.push(i);
        });

        let { data, error } = await supabase
          .from("events")
          .insert(items)
          .select();
        if (error) {
          console.error(error);
          return;
        }
        console.log("data", data);
      });
    })
    .on("error", (err) => {
      console.error("[error] " + err.message);
    });

  req.end();
};

insert();
