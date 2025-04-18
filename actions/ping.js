const https = require("https");

https
  .get("https://viby.onrender.com", (res) => {
    console.log(`Status Code: ${res.statusCode}`);
  })
  .on("error", (e) => {
    console.error(`Error: ${e.message}`);
  });
