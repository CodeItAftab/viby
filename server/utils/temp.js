function transformCloudinaryUrl(url, options = {}) {
  const defaultParams = {
    c: "fill",
    g: "auto", // Use 'auto' to let Cloudinary decide the best focus area
    w: 128,
    h: 128,
    q: 100,
    f: "webp",
  };

  const params = { ...defaultParams, ...options };

  const transformationString = Object.entries(params)
    .map(([key, value]) => `${key}_${value}`)
    .join(",");

  console.log("Transformation String:", transformationString);

  // Replace the /upload/ segment with the transformation string
  return url.replace("/upload/", `/upload/${transformationString}/`);
}

console.log(
  transformCloudinaryUrl(
    "https://res.cloudinary.com/dmpicisue/image/upload/v1743083706/avatars/k3yxbo3fkxthk5blac78.webp",
    { w: 300, h: 300 }
  )
);
