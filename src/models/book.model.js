import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    externalId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Title of the book is required"],
    },
    author: {
      type: String,
      trim: true,
      required: [true, "Author of the book is required"],
    },
    coverImg: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
    },
    status: {
      type: String,
      enum: ["finished", "current_read", "want_to_read"],
      default: "want_to_read",
    },
    totalPages: {
      type: Number,
      required: [true, "Total number of pages is required"],
    },
    pagesRead: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentRead: {
      type: Number,
      default: 0,
      max: 100,
      min: 0,
    },
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ userId: 1, externalId: 1 }, { unique: true });

const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
