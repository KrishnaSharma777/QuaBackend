import express from 'express';
import Blog from '../models/Blog.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory to save uploaded files
  },
  // filename: (req, file, cb) => {
  //   cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  // },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix); // Generate unique file name
  },
});
const upload = multer({ storage });

// Get all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// Create blog
// router.post('/', async (req, res) => {
//   const blog = new Blog(req.body);
//   await blog.save();
//   res.status(201).json(blog);
// });
router.post('/', upload.single("image"), async (req, res) => {
  try {

    console.log("Uploaded File:", req.file); // Debug log for image upload

    const { title, author, time, sections } = req.body;
      // 👇 Log all incoming form data
      // const baseUrl = `${req.protocol}://${req.get('host')}`;



    const newBlog = new Blog({
      title,
      author,
      time,
      // image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null,

      
      image: req.file ? `uploads/${req.file.filename}` : null, // Correct image path

      // image: req.file ? req.file.path : null,
      sections: JSON.parse(sections), // assuming 'sections' is sent as a JSON string
    });

    await newBlog.save();
    res.status(200).json(newBlog);
  } catch (error) {
        console.error("Error while saving blog:", error);

    res.status(400).json({ error: error.message });
  }
  
});


// Update blog
// router.put('/:id', async (req, res) => {
//   const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updatedBlog);
// });

router.put('/:id', upload.single("image"), async (req, res) => {
  try {
    const { title, author, time, sections } = req.body;
    // const baseUrl = `${req.protocol}://${req.get('host')}`;

    const updateData = {
      title,
      author,
      time,
      sections: JSON.parse(sections),
    };
    
    if (req.file) {
      // updateData.image = `${baseUrl}/uploads/${req.file.filename}`;

      updateData.image = req.file.path;
    }
    

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete blog
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

export default router;
