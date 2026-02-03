import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },


    accountType: { type: String, default: "particular", enum: ["particular","club","pena"] },
    clubVerified: { type: Boolean, default: false },

    passwordHash: { type: String, required: true },

    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiresAt: { type: Date },


    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },

    username: { type: String, default: "" },
    avatar: { type: String, default: "" },
    team: { type: String, default: "" },
    name: { type: String, default: "" },
    surnames: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
