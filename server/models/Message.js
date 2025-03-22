const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    type: {
      type: String,
      default: "text",
      enum: ["text", "media", "file"],
    },
    content: {
      type: String,
    },
    attachments: [
      {
        public_id: String,
        url: String,
        type: {
          type: String,
          enum: ["image", "audio", "video", "file"],
        },
      },
    ],
    state: {
      type: String,
      default: "sent",
      enum: ["sent", "delivered", "read"],
    },
    readList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deliveredList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Message", schema);
