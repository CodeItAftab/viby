const { model, Schema } = require("mongoose");
const { hashSync } = require("bcrypt");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    bio: {
      type: String,
      default: "Hey there! I am using Vib.",
    },
    verified: {
      type: Boolean,
      default: false,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otp_expiry_time: {
      type: Date,
      select: false,
    },
    fcm_token: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = hashSync(this.password, 10);
  return next();
});

module.exports = model("User", schema);
