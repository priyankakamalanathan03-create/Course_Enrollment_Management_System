const express = require("express");
const { 
  createCourse, 
  getCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse 
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, createCourse)
  .get(getCourses);

router.route("/:id")
  .get(getCourseById)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;