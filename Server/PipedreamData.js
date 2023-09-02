const https = require("https");

const options = {
  hostname: "api.pipedream.com",
  port: 443,
  /* path: "/v1/sources/dc_J4ue0xA/event_summaries?limit=2", */
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
    resp.on("end", () => {
      console.log("fff", JSON.parse(t1).data);
    });
  })
  .on("error", (err) => {
    console.error("[error] " + err.message);
  });
req.end();
