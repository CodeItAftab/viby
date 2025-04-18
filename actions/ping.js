const https = require("https");

https
  .get("https://viby.onrender.com", (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Response Body:", data);
      process.exit(0); // Clean exit
    });
  })
  .on("error", (e) => {
    console.error(`Error: ${e.message}`);
  });
