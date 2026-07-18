const express = require("express");
const {
  enrollInCourse,
  getCourseStudents,
  getMyCourses,
  updateEnrollment,
  unenrollFromCourse,
  getPendingEnrollments,
  approveEnrollment
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin/pending", protect, getPendingEnrollments);
router.put("/approve", protect, approveEnrollment);

router.post("/:courseId", protect, enrollInCourse);
router.delete("/:courseId", protect, unenrollFromCourse);

router.get("/course/:courseId", protect, getCourseStudents);
router.get("/my-courses", protect, getMyCourses);

router.put("/:enrollmentId", protect, updateEnrollment);

module.exports = router;