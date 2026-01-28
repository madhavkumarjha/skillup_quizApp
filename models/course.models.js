import mongoose from 'mongoose';

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  lesson_name: { type: String, required: true },
  content: { type: String },
  resources: [
    {
      title: {
        type: String,
        // required: true,
        trim: true,
        enum: ['video', 'document', 'link', 'other'],
      },
      url: { type: String },
      fileId: { type: String },
    },
  ],
  duration: { type: Number }, // minutes
});

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String },
  lessons: [lessonSchema],
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // optional quiz per chapter
  active: { type: Boolean, default: false }, // availability toggle
});

// Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Hierarchy
    chapters: [chapterSchema],

    // Metadata
    category: {
      type: String,
      enum: [
        'frontend',
        'backend',
        'database',
        'programming',
        'design',
        'business',
        'marketing',
        'other',
      ],
      default: 'other',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: { type: Number }, // estimated total minutes
    tags: [String],

    // Status fields
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    // Scheduling
    startDate: { type: Date },
    endDate: { type: Date },

    // Resources
    resources: [
      {
        title: {
          type: String,
          // required: true,
          trim: true,
          enum: ['syllabus', 'curriculum', 'other'],
        },
        url: { type: String },
        fileId: { type: String },
      },
    ],
    thumbnail: {
      url: { type: String },
      fileId: { type: String },
    },

    // Quizzes (course‑level, e.g. final exam)
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
  { timestamps: true, optimisticConcurrency: false, versionKey: false }
);

export const Course = mongoose.model('Course', courseSchema);
