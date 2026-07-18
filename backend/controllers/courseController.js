const Course = require("../models/Course");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin Only)
 * @param   {Object} req.body - Course details (title, description, capacity, etc.)
 */
exports.createCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Access denied. Instructors and Admins only.");
    }

    const course = await Course.create({
      ...req.body,
      instructorId: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a list of all courses with optional search, filtering, and pagination
 * @route   GET /api/courses
 * @access  Public
 * @query   {string} category - Filter by course category
 * @query   {string} level - Filter by difficulty level
 * @query   {string} search - Search query for course title
 * @query   {number} page - Current page number (default 1)
 * @query   {number} limit - Number of courses per page (default 10)
 */
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 100 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: "i" };

    const courses = await Course.find(query)
      .populate("instructorId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalCourses: count
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructorId", "name email");
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course details
 * @route   PUT /api/courses/:id
 * @access  Private (Course Instructor or Admin Only)
 */
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    // Verify ownership or admin status
    if (course.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403);
      throw new Error("User not authorized to update this course");
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a course from the platform
 * @route   DELETE /api/courses/:id
 * @access  Private (Course Instructor or Admin Only)
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    // Verify ownership or admin status
    if (course.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403);
      throw new Error("User not authorized to delete this course");
    }

    const Enrollment = require("../models/Enrollment");
    await Enrollment.deleteMany({ courseId: req.params.id });
    await course.deleteOne();

    res.json({ message: "Course successfully removed" });
  } catch (error) {
    next(error);
  }
};
