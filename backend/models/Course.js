const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Please add a course title"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Please add a description"] 
    },
    category: { 
      type: String, 
      required: [true, "Please specify a category"],
      default: "General"
    },
    level: { 
      type: String, 
      enum: ["Beginner", "Intermediate", "Advanced"], 
      default: "Beginner" 
    },
    price: { 
      type: Number, 
      default: 0 
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    capacity: {
      type: Number,
      default: 30
    },
    enrolledCount: {
      type: Number,
      default: 0
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);