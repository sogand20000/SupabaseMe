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

        let { data, error } = await supabase
          .from("events")
          .insert([
            {
              eventId: events[0].event["id"],
              name: events[0].event["summary"],
              startTime: events[0].event.start.dateTime,
              endTime: events[0].event.end.dateTime,
              location: "NULL",
              summary: "NULL",
              status: "NULL",
              description: "NULL",

              calendarId: events[0].event.organizer.email,
            },
          ])
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
  //
  /* let { data, error } = await supabase
    .from("events")
    .insert([
      {
        name: events[0].event["summary"],
        startTime: events[0].event.start.startTime, // "2023-09-02T13:30:00+03:30",
        endTime: events[0].event.end.endTime, // "2023-09-02T14:30:00+03:30",
        location: "NULL",
        summary: "NULL",
        status: "NULL",
        description: "NULL",

        calendarId: events[0].event.organizer.email,
        // "7316873df2f349be5dca79f5db526b40c70d90650e5e8f01ec5beb01fbda6e7e@group.calendar.google.com",
      },
    ])
    .select();
  if (error) {
    console.error(error);
    return;
  }
  console.log("data", data); */
};

insert();

/* const GetDataPipdream = async () => {
  const req = https
    .request(options, (resp) => {
      let t1 = "";
      resp.on("data", (chunk) => {
        t1 += chunk;
      });
      resp.on("end", () => {
        console.log("fff", JSON.parse(t1).data);
        return JSON.parse(t1).data;
      });
    })
    .on("error", (err) => {
      console.error("[error] " + err.message);
    });

  req.end();
}; */
