import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING"
});

export default cloudinary;