const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

/**
 * @desc    Enroll a student in a course or join the waitlist if full
 * @route   POST /api/enroll/:courseId
 * @access  Private (Student Only)
 */
exports.enrollInCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      res.status(403);
      throw new Error("Only students can enroll in courses");
    }

    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    // Check if already enrolled
    const exists = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: courseId
    });

    if (exists) {
      res.status(400);
      throw new Error("You are already enrolled or waitlisted for this course");
    }

    // Check if course has already started (registration closed)
    if (course.startDate && new Date() > new Date(course.startDate)) {
      res.status(400);
      throw new Error("Registration is closed. This course has already started.");
    }

    // Check capacity and waitlist if full
    if (course.enrolledCount >= course.capacity) {
      const waitlist = await Enrollment.create({
        studentId: req.user.id,
        courseId: courseId,
        status: "waitlisted"
      });
      return res.status(201).json({ message: "Course is full. You have been added to the waitlist.", enrollment: waitlist });
    }

    const enroll = await Enrollment.create({
      studentId: req.user.id,
      courseId: courseId,
      status: "pending"
    });

    res.status(201).json({ message: "Enrollment pending approval", enrollment: enroll });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all enrolled students for a specific course
 * @route   GET /api/enroll/course/:courseId
 * @access  Private (Course Instructor or Admin Only)
 */
exports.getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    // Verify ownership or admin status
    if (course.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view students of this course");
    }

    const students = await Enrollment.find({
      courseId: req.params.courseId
    }).populate("studentId", "name email");

    res.json(students);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all courses the logged-in student is enrolled in
 * @route   GET /api/enroll/my-courses
 * @access  Private (Student Only)
 */
exports.getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user.id
    }).populate("courseId");

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a student's enrollment progress, grade, or status
 * @route   PUT /api/enroll/:enrollmentId
 * @access  Private (Course Instructor or Admin Only)
 * @param   {Object} req.body - Fields to update (status, progress, grade)
 */
exports.updateEnrollment = async (req, res, next) => {
  try {
    const { status, progress, grade } = req.body;
    let enrollment = await Enrollment.findById(req.params.enrollmentId).populate("courseId");

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    // Verify ownership or admin status
    if (enrollment.courseId.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to update this enrollment");
    }

    const oldStatus = enrollment.status;

    enrollment.status = status || enrollment.status;
    if (progress !== undefined) enrollment.progress = progress;
    if (grade !== undefined) enrollment.grade = grade;

    await enrollment.save();

    // Adjust enrolledCount if status changed
    if (oldStatus !== enrollment.status) {
      if (enrollment.status === "enrolled" && oldStatus !== "enrolled") {
         await Course.findByIdAndUpdate(enrollment.courseId._id, { $inc: { enrolledCount: 1 } });
      } else if (oldStatus === "enrolled" && enrollment.status !== "enrolled") {
         await Course.findByIdAndUpdate(enrollment.courseId._id, { $inc: { enrolledCount: -1 } });
      }
    }
    
    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Drop or unenroll from a course
 * @route   DELETE /api/enroll/:courseId
 * @access  Private (Student Only)
 */
exports.unenrollFromCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: req.params.courseId
    });

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    // LOGIC FIX: Only decrement the count if they were officially 'enrolled'.
    // If they were 'pending', the count hadn't increased yet, so we don't decrease it.
    if (enrollment.status === "enrolled") {
      await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrolledCount: -1 } });
    }

    // Delete the record immediately (No Admin approval needed to quit)
    await enrollment.deleteOne();

    res.json({ message: "Successfully removed from course" });
  } catch (error) {
    next(error);
  }
};

exports.getPendingEnrollments = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Access denied. Admin only.");
    }
    const pending = await Enrollment.find({ status: "pending" }).populate("studentId", "name email").populate("courseId", "title");
    res.json(pending);
  } catch (error) { next(error); }
};

exports.approveEnrollment = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Access denied. Admin only.");
    }
    const { enrollmentId, action } = req.body; 
    const enrollment = await Enrollment.findById(enrollmentId);

    if (action === "enrolled") {
      enrollment.status = "enrolled";
      await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { enrolledCount: 1 } });
    } else {
      enrollment.status = "rejected";
      // No count change needed here because they were 'pending' (0 count)
    }

    await enrollment.save();
    res.json({ message: `Student ${action} successfully` });
  } catch (error) { next(error); }
};
