import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/blogs', blogRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
  console.log();
  
