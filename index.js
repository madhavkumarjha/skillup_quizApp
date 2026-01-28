import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import instructorRoutes from './routes/instructor.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import courseRoutes from './routes/course.routes.js';
import mediaRoutes from './routes/media.routes.js';
import questionRoutes from './routes/quiz.routes.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/upload', mediaRoutes);
app.use('/api/questions', questionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
