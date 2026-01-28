import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions' },
  answer: String,
  isCorrect: Boolean,
  skipped: { type: Boolean, default: false },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  {
    timestamps: true,
    optimisticConcurrency: false,
    versionKey: false,
  }
);

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
