import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  oauthId: { type: String, required: true },
  provider: { type: String, required: true },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
