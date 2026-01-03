const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    view: {
      type: Number,
      default:0
    },
    shortDescription:{
      type: String,
    },
    longDescription:{
      type: String,
    },
    authorName: {
      type: String,
    },
    bannerImage: {
      type: String,
    },
    keywords: {
      type: [],
    },
   tableContent: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
