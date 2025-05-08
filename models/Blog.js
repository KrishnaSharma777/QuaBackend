import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  heading: String,
  subheading: String,
  description: String
});

const BlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String, // base64 string
  time: String,
  sections: [SectionSchema]
});

export default mongoose.model('Blog', BlogSchema);
