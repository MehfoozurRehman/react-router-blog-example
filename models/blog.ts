import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const schema = new Schema(
  {
    title: String,
    markdownPath: String,
    description: String,
    published: Boolean,
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", schema);

export default Blog;
