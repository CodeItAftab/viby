const { Schema, model } = require("mongoose");

const schema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
  },
  groupAvatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Chat", schema);
