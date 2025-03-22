const cloudinary = require("cloudinary").v2;

const uploadOnCloudinary = async (files) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!files) return;
    if (Array.isArray(files)) {
      const urls = await Promise.all(
        files.map(async (file) => {
          const res = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "attachments",
            resource_type: "auto",
          });
          // console.log(res);
          return {
            public_id: res.public_id,
            url: res.secure_url,
          };
        })
      );
      return urls;
    } else {
      const res = await cloudinary.uploader.upload(files.tempFilePath, {
        folder: "attachments",
        resource_type: "auto",
      });
      // console.log(res);
      return [
        {
          public_id: res.public_id,
          url: res.secure_url,
          type: res.resource_type,
        },
      ];
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadAvatarOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "avatars",
      resource_type: "auto",
    });
    return {
      public_id: res.public_id,
      url: res.secure_url,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadOnCloudinary, uploadAvatarOnCloudinary };
