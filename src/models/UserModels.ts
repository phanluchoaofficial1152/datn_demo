import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  username: string;
  images?: string;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    images: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const AccountModels =
  mongoose.models.Account || mongoose.model<IUser>("Account", UserSchema);

export default AccountModels;
