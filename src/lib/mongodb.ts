import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Không tìm thấy tệp cấu hình MONGODB.");
}

let cachedPromise: Promise<typeof mongoose> | null = null;

async function dbConnect() {
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI);
  }

  return cachedPromise;
}

export default dbConnect;
