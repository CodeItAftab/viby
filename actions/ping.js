fetch("https://viby.onrender.com")
  .then((res) => {
    console.log(`Status Code: ${res.status}`);
    return res.text(); // Or .json(), depending on what your server returns
  })
  .then((body) => {
    console.log("Response Body:", body);
  })
  .catch((err) => {
    console.error("Fetch error:", err.message);
    process.exit(1); // Optional: force exit on error
  });
