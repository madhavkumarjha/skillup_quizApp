import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: [{ type: String }],
    correctAnswerIndex: {
      type: Number,
      validate: {
        validator: function (value) {
          // Only validate if type is mcq or true_false
          if (this.type === 'mcq' || this.type === 'true_false') {
            return (
              value !== undefined && value >= 0 && value < this.options.length
            );
          }
          return true; // skip validation for fill_blank
        },
        message:
          'Correct answer index must be valid for MCQ/True-False questions',
      },
    },
    correctAnswerText: {
      type: String,
      required: function () {
        return this.type === 'fill_blank';
      },
    },
    marks: { type: Number, default: 1 },
    explanation: { type: String },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'fill_blank'],
      default: 'mcq',
    },
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resourses: [
      {
        title: { type: String },
        url: { type: String },
        fileId: { type: String },
      },
    ],
    // description: { type: String, trim: true },
    questions: [questionSchema],
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number, default: 0 },
    timeLimit: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'inactive'],
      default: 'draft',
    },
    maxAttempts: { type: Number, default: 1 },
    randomizeQuestions: { type: Boolean, default: false },
  },
  { timestamps: true, optimisticConcurrency: false, versionKey: false }
);

quizSchema.pre('save', function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
  next();
});

quizSchema.path('passingMarks').validate(function (value) {
  return value <= this.totalMarks;
}, 'Passing marks cannot exceed total marks');

export const Quiz = mongoose.model('Quiz', quizSchema);
